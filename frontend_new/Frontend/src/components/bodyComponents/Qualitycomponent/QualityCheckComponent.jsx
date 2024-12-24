import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Select, MenuItem, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QualityCheckComponent = () => {
  const [grnData, setGrnData] = useState([]);
  const [timeouts, setTimeouts] = useState({});
  const [rows, setRows] = useState([]);
  
  // Fetch GRN data
  useEffect(() => {
    const fetchGrnData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/grn`
        );
        const flatData = response.data.grns.flatMap((grn) =>
          grn.items.map((item) => ({
            id: `${grn._id}-${item._id}`, // Unique ID for DataGrid
            poNumber: grn.poNumber || "N/A",
            receivingNo: grn.receivingNo || "N/A",
            itemNo: item.itemNo || "N/A",
            itemQuantity: item.quantity || 0,
            okQuantity: item.okQuantity || 0,
            rejectedQuantity: item.rejectedQuantity || 0,
            status: item.status || "Pending",
            grnId: grn._id,
            itemId: item._id,
          }))
        );
        setRows(flatData);
        setGrnData(response.data.grns);
      } catch (error) {
        console.error("Error fetching GRN data:", error);
        toast.error("Failed to fetch GRN data.");
      }
    };
    fetchGrnData();
  }, []);

  // Handle status change for each item
  const handleStatusChange = (grnId, itemId, newStatus) => {
    const updatedRows = rows.map((row) =>
      row.id === `${grnId}-${itemId}` ? { ...row, status: newStatus } : row
    );
    setRows(updatedRows);

    axios
      .patch(`${import.meta.env.VITE_API_URL}/api/grn/${grnId}/item/${itemId}/status`, {
        status: newStatus,
      })
      .then(() => toast.success("Status updated successfully!"))
      .catch(() => toast.error("Failed to update status."));
  };

  // Handle quantity changes with debouncing
  const handleQuantityChange = useCallback(
    (grnId, itemId, newQuantity, type, event) => {
      const parsedQuantity = newQuantity === "" ? null : parseInt(newQuantity, 10);
  
      // Check for invalid input
      const invalidInputKey = `${grnId}-${itemId}-invalid-input`;
      if (newQuantity !== "" && isNaN(parsedQuantity)) {
        try {
          if (!toast.isActive(invalidInputKey)) {
            toast.error("Please enter a valid number.", { toastId: invalidInputKey , autoClose: 2000});
          }
        } catch (error) {
          console.error("Error displaying invalid input toast:", error);
        }
        return;
      }
  
      setRows((prevRows) => {
        return prevRows.map((row) => {
          if (row.id === `${grnId}-${itemId}`) {
            const updatedRow = { ...row, [type]: parsedQuantity };
  
            // Perform validation: OK + Rejected cannot exceed Item Quantity
            const totalQuantity =
              (updatedRow.okQuantity || 0) + (updatedRow.rejectedQuantity || 0);
  
            const quantityErrorKey = `${grnId}-${itemId}-quantity-error`;
            if (totalQuantity > row.itemQuantity) {
              updatedRow[type] = 0; // Reset the invalid value to 0
  
              try {
                if (!toast.isActive(quantityErrorKey)) {
                  toast.error(
                    "Total OK and Rejected quantities cannot exceed Item Quantity.",
                    { toastId: quantityErrorKey, autoClose: 2000 }
                  );
                }
              } catch (error) {
                console.error("Error displaying quantity error toast:", error);
              }
  
              return updatedRow; // Return updatedRow with reset value
            }
  
            return updatedRow;
          }
          return row;
        });
      });
  
      // Delay API update with debouncing
      if (timeouts[`${grnId}-${itemId}-${type}`]) {
        clearTimeout(timeouts[`${grnId}-${itemId}-${type}`]);
      }
  
      const timeoutId = setTimeout(async () => {
        const successKey = `${grnId}-${itemId}-${type}-success`;
        const errorKey = `${grnId}-${itemId}-${type}-error`;
  
        try {
          await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/grn/${grnId}/item/${itemId}`,
            { [type]: parsedQuantity }
          );
  
          // Show success toast only if Enter is pressed
          if (event.key === "Enter" && !toast.isActive(successKey)) {
            toast.success("Quantity updated successfully!", { toastId: successKey , autoClose: 2000});
          }
        } catch (error) {
          if (!toast.isActive(errorKey)) {
            toast.error("Failed to update quantity.", { toastId: errorKey , autoClose: 2000});
          }
        }
      }, 1000);
  
      setTimeouts((prev) => ({ ...prev, [`${grnId}-${itemId}-${type}`]: timeoutId }));
    },
    [timeouts]
  );
  

  // Columns definition for DataGrid
  const columns = [
    { field: "poNumber", headerName: "PO No", flex: 1 },
    { field: "receivingNo", headerName: "Receiving No", flex: 1 },
    { field: "itemNo", headerName: "Item No", flex: 1 },
    { field: "itemQuantity", headerName: "Item Quantity", flex: 1 },
    {
      field: "okQuantity",
      headerName: "OK Quantity",
      flex: 1,
      renderCell: (params) => (
        <TextField
          size="small"
          value={params.row.okQuantity || ""}
          onChange={(e) => handleQuantityChange(params.row.grnId, params.row.itemId, e.target.value, "okQuantity", e)}
          onKeyDown={(e) => handleQuantityChange(params.row.grnId, params.row.itemId, e.target.value, "okQuantity", e)}
        />
      ),
    },
    {
      field: "rejectedQuantity",
      headerName: "Rejected Quantity",
      flex: 1,
      renderCell: (params) => (
        <TextField
          size="small"
          value={params.row.rejectedQuantity || ""}
          onChange={(e) => handleQuantityChange(params.row.grnId, params.row.itemId, e.target.value, "rejectedQuantity", e)}
          onKeyDown={(e) => handleQuantityChange(params.row.grnId, params.row.itemId, e.target.value, "rejectedQuantity", e)}
        />
      ),
    },
    {
      field: "status",
      headerName: "Item Status",
      flex: 1,
      renderCell: (params) => (
        <Select
          value={params.row.status}
          onChange={(e) => handleStatusChange(params.row.grnId, params.row.itemId, e.target.value)}
          size="small"
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="OK">OK</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </Select>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 4, backgroundColor: "white" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Quality Check
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[20, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 20, page: 0 },
          },
        }}
        getRowId={(row) => row.id}
        autoHeight
      />
      <ToastContainer />
    </Box>
  );
};

export default QualityCheckComponent;
