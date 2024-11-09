import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import axios from 'axios';
import ExcelJS from 'exceljs';
// import { QrReader } from 'react-qr-reader';
import QrScanner from 'react-qr-scanner';



const GRNComponent = ({ orderData }) => {
  const [file, setFile] = useState(null);
  const [grnData, setGrnData] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdGrns, setCreatedGrns] = useState([]);
  const [filteredGrns, setFilteredGrns] = useState([]);
  const [searchPoNumber, setSearchPoNumber] = useState(""); // Search state for P.O Number
  const [allGrns, setAllGrns] = useState([]);  // This state will hold all GRNs
  const [qrData, setQrData] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false); // State to track loading
  const [successMessage, setSuccessMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false); // State to toggle ToastContainer visibility

  const toggleToastVisibility = () => {
    setToastVisible(!toastVisible);
  };





  const handleQrScan = useCallback((result) => {
    if (result && result.text) {
      const scannedData = result.text;
      setQrData(scannedData);
      setLoading(false);

      try {
        // toast.dismiss();
        console.log("Scanned Data:", scannedData); // Log scanned data for debugging
        // setSuccessMessage('QR Code scanned and processed successfully!');
        toast.success('QR Code scanned successfully!');

        let parsedData;
        try {
          // Try parsing as JSON first
          parsedData = JSON.parse(scannedData);
        } catch (jsonError) {
          console.warn('JSON parsing failed, trying CSV or plain text format:', jsonError);

          // Handle CSV or plain text format
          const rows = scannedData.split('\n').map(row => row.trim()).filter(row => row.length > 0);

          // Convert CSV data into JSON format
          parsedData = rows.map(row => {
            const values = row.split(',').map(value => value.trim());
            return {
              PONumber: values[0] || '',
              ReceivingNo: values[1] || '',
              Supplier: values[2] || 'Unknown Supplier',
              items: [
                {
                  ItemNo: values[3] || '',
                  Description: values[4] || '',
                  Quantity: Number(values[5]) || 0,
                  SerialNumber: values[6] || 'Default-SN',
                  InvoiceNo: values[7] || 'Default Invoice',
                  Location: values[8] || 'Unknown',
                  ReceivingDate: new Date().toLocaleDateString(), // Assuming the receiving date is now
                }
              ]
            };
          });
        }

        // Now we expect `parsedData` to be an array of GRNs
        if (Array.isArray(parsedData)) {
          // setSuccessMessage('GRNs added successfully from QR code!');
          toast.success('GRNs added successfully from QR code!');
          // Iterate over each GRN and map to the desired structure
          const grns = parsedData.map(grn => ({
            poNumber: grn.PONumber,
            receivingNo: `GRN-${grn.ReceivingNo}`,
            receivingDate: new Date().toLocaleDateString(), // If not available in the scanned data
            supplier: grn.Supplier,
            items: grn.items.map(item => ({
              itemNo: item.ItemNo,
              description: item.Description,
              quantity: item.Quantity,
              serialNumber: item.SerialNumber,
              invoiceNo: item.InvoiceNo,
              location: item.Location,
              receivingDate: new Date().toLocaleDateString(), // If not available in the scanned data
            }))
          }));

          // Update the GRN data
          setGrnData(prev => [...prev, ...grns]);

          // Show success message
        } else {
          toast.error('QR Code does not contain valid GRN data.');
        }
      } catch (error) {
        console.error('Failed to process scanned data:', error);
        toast.error('Unable to process QR code data. Please check the format.');
      }
      finally {
        setLoading(false); // Reset loading state
        setIsScannerOpen(false); // Close the scanner after successful scan
      }
    }
  }, []);

  const handleError = useCallback((error) => {
    console.error('QR Scan Error:', error);
    toast.error('QR scan error: Unable to detect or decode the QR code. Please try again.');
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/docklocations`);
        setLocationList(response.data);
      } catch (err) {
        console.error("Error fetching locations:", err);
        toast.error("Error fetching locations.");
      }
    };


    const fetchAllGrns = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn`);
        console.log("Full Response:", response);
        console.log("Response from backend:", response.data);
        console.log("Type of response.data:", typeof response.data);

        if (Array.isArray(response.data.grns)) {
          setAllGrns(response.data.grns);  // Update the state with all GRNs
        } else {
          console.error("Backend response is not in expected format:", response.data);
          // setAllGrns([]);  // Reset if the response is not in expected format
        }
      } catch (err) {
        console.error("Error fetching created GRNs:", err);
        setLoading(false);
        // setAllGrns([]);  // Reset state on error
      }
    };

    fetchLocations();
    fetchAllGrns();
    // fetchCreatedGrns();
  }, []);

  // const handleSearchChange = (event) => {
  //   const query = event.target.value;
  //   setSearchQuery(query);

  //   if (query) {
  //     // Filter created GRNs based on search query
  //     const filtered = createdGrns.filter(grn =>
  //       grn.poNumber.includes(query) ||
  //       grn.receivingNo.includes(query) ||
  //       grn.supplier.includes(query)
  //     );
  //     setFilteredGrns(filtered);
  //   } else {
  //     setFilteredGrns(createdGrns); // Reset to all GRNs if the search is cleared
  //   }
  // };


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setGrnData([]);
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload an Excel file.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(await file.arrayBuffer());
      const worksheet = workbook.worksheets[0];
      const grnDataArray = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row

        const poNumber = row.getCell(1).value; // P.O. Number
        const receivingNo = `GRN-${row.getCell(5).value}`; // Receiving No.
        const itemData = {
          itemNo: row.getCell(2).value,
          description: row.getCell(3).value,
          quantity: row.getCell(4).value,
          serialNumber: row.getCell(7).value || "Default-SN",
          invoiceNo: row.getCell(8).value,
          location: row.getCell(10).value,
          receivingDate: new Date().toLocaleDateString(),
        };

        // Find the GRN for this P.O. Number and Receiving No., or create a new one
        let existingGRN = grnDataArray.find(grn => grn.poNumber === poNumber && grn.receivingNo === receivingNo);

        if (!existingGRN) {
          existingGRN = {
            poNumber: poNumber,
            receivingNo: receivingNo,
            receivingDate: new Date().toLocaleDateString(), // You can adjust this as needed
            supplier: row.getCell(6).value, // Supplier
            status: 'Pending', // Default status
            items: [],
          };
          grnDataArray.push(existingGRN);
        }

        // // Add the item to the items array of the found or created GRN
        existingGRN.items.push(itemData);
      });

      // Update the state with the transformed GRN data
      setGrnData(grnDataArray);
      setFile(null); // Reset the file input after successful upload
      toast.success("Excel file uploaded successfully.");
    } catch (error) {
      console.error("Error reading Excel file:", error);
      toast.error("Failed to read Excel file. Please check the file format and try again.");
      const updatedGrnData = [...grnData, ...newGrnData];
      setGrnData(updatedGrnData);
    }
  };

  const handleLocationChange = (grnIndex, itemIndex, newLocation) => {
    const updatedGrnData = [...grnData];
    updatedGrnData[grnIndex].items[itemIndex].location = newLocation;
    setGrnData(updatedGrnData);
  };

  const handleInputChange = (grnIndex, itemIndex, field, value) => {
    const updatedGrnData = [...grnData];
    updatedGrnData[grnIndex].items[itemIndex][field] = value;
    setGrnData(updatedGrnData);
  };


  const handleSaveGRNs = async () => {
    try {
      const savedGrns = [];
      // Iterate through all GRNs and post them to the backend
      for (const grn of grnData) {
        const grnDataToPost = {
          poNumber: grn.poNumber,
          receivingNo: grn.receivingNo,
          receivingDate: grn.receivingDate,
          supplier: grn.supplier,
          // status: grn.status,
          items: grn.items.map((item) => ({
            itemNo: item.itemNo,
            description: item.description,
            quantity: item.quantity,
            serialNumber: item.serialNumber,
            invoiceNo: item.invoiceNo,
            location: item.location,
            receivingDate: item.receivingDate,
          })),
        };

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/grn`,
          grnDataToPost
        );
        savedGrns.push(response.data);
      }

      // Update the state with the newly created GRNs from the backend
      setCreatedGrns((prevState) => {
        const updatedGrns = [...prevState, ...savedGrns];
        localStorage.setItem("createdGrns", JSON.stringify(updatedGrns));  // Optionally, save to localStorage
        setGrnData([]);  // Clear the GRN data after saving
        return updatedGrns;
      });
      toast.success("GRNs saved successfully.");
    } catch (error) {
      console.error("Error posting GRN data:", error);
      toast.error("Error saving GRNs. Please try again.");
    }
  };

  // const handleSaveGRNs = async () => {
  //   try {
  //     const savedGrns = [];
  //     for (const grn of grnData) {
  //       const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/grn`, grnDataToPost);
  //       savedGrns.push(response.data);
  //     }

  //     // After saving, fetch the latest data from the backend
  //     fetchCreatedGrns();

  //     setGrnData([]); // Optionally clear the local GRN data to avoid duplicate entries
  //     alert("All GRNs added successfully.");
  //   } catch (error) {
  //     console.error("Error posting GRN data:", error);
  //     setErrorMessage("Failed to post GRN data for some items. Please check the console for details.");
  //   }
  // };

  useEffect(() => {
    console.log("Created GRNs Updated", createdGrns);
  }, [createdGrns]);

  // const filteredGrns = createdGrns.filter(grn => grn.poNumber.includes(searchPoNumber));

  const handleDeleteGRN = async (grnId) => {
    if (!window.confirm("Are you sure you want to delete this GRN?")) return;
    try {
      // Make API request to delete the GRN
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/grn/${grnId}`);

      // Remove the GRN from the frontend state
      setAllGrns((prevState) => prevState.filter((grn) => grn._id !== grnId));

      alert("GRN deleted successfully.");
    } catch (error) {
      console.error("Error deleting GRN:", error);
      alert("Failed to delete GRN.");
    }
  };

  const handleDeleteItem = async (grnId, itemNo) => {
    try {
      // Send request to backend to delete the individual item
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/grn/${grnId}/item/${itemNo}`);

      // Update state by removing the item from the GRN in the state
      setCreatedGrns((prevState) =>
        prevState.map((grn) =>
          grn._id === grnId
            ? {
              ...grn,
              items: grn.items.filter((item) => item.itemNo !== itemNo),
            }
            : grn
        )
      );

      toast.success("Item deleted successfully.");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OK":
        return { backgroundColor: "#4CAF50", color: "#fff" }; // Green for OK
      case "Pending":
        return { backgroundColor: "#FFEB3B", color: "#000" }; // Yellow for Pending
      case "Rejected":
        return { backgroundColor: "#F44336", color: "#fff" }; // Red for Rejected
      default:
        return { backgroundColor: "#BDBDBD", color: "#000" }; // Gray for undefined status
    }
  };

  useEffect(() => {
    // When a toast is triggered, the ToastContainer should show.
    if (toastVisible) {
      setToastVisible(true);
    } else {
      setToastVisible(false);
    }
  }, [toastVisible]);

  


  return (
    <Box sx={{ padding: 4 }}>
      {toastVisible && (
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
      )}
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>Goods Receipt Note (GRN)</Typography>
      {/* QR Scanner Modal */}
      {/* <QrReader
          onResult={handleQrScan}
          style={{ width: "100%", marginBottom: 20 }}
          containerStyle={{ maxWidth: 600 }}
        /> */}
      {isScannerOpen && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300, }}>
          <Box sx={{ backgroundColor: '#fff', padding: 3, borderRadius: 2, width: '80%', maxWidth: 500, position: 'relative', overflow: 'hidden',}}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Scan QR Code</Typography>
            <QrScanner
              delay={200} // Adjust delay for scan speed
              onScan={handleQrScan}
              onError={handleError}
              style={{ width: '400px', height: '400px' }}
            />
            
            <Button variant="outlined" color="secondary" onClick={() => setIsScannerOpen(false)} sx={{ marginTop: 2 }}>
              Close
            </Button>
          </Box>
        </Box>
      )}

      {/* Button to Open QR Scanner */}
      <Button variant="contained" color="primary" disabled={isScannerOpen} onClick={() => setIsScannerOpen(true)} sx={{ marginTop: 4, marginBottom: 4, marginRight: 3 }}>
        Open QR Scanner
      </Button>


      {/* Success or Error Message */}
      {successMessage && (
        <div style={{ marginTop: 20, color: 'green' }}>
          {successMessage}
        </div>
      )}


      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <Button variant="contained" onClick={handleUpload} sx={{ marginTop: 2, marginBottom: 2 }}>
        Upload Excel
      </Button>

      <TextField
        label="Search P.O Number"
        variant="outlined"
        value={searchPoNumber}
        onChange={(e) => setSearchPoNumber(e.target.value)}
        sx={{ marginBottom: 2, width: '100%' }}
      />

      {/* Table for GRN Data (Uploaded Excel Data) */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table aria-label="GRN Data">
          <TableHead>
            <TableRow>
              <TableCell align="center"><strong>P.O. Number</strong></TableCell>
              <TableCell align="center"><strong>Item No.</strong></TableCell>
              <TableCell align="center"><strong>Description</strong></TableCell>
              <TableCell align="center"><strong>Quantity</strong></TableCell>
              <TableCell align="center"><strong>Serial Number</strong></TableCell>
              <TableCell align="center"><strong>Receiving Date</strong></TableCell>
              <TableCell align="center"><strong>Location</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grnData.map((grn, grnIndex) => (
              grn.items.map((item, itemIndex) => (
                <TableRow key={`${grnIndex}-${itemIndex}`}>
                  {itemIndex === 0 && (
                    <TableCell rowSpan={grn.items.length} align="center">{grn.poNumber}</TableCell>
                  )}
                  <TableCell align="center">{item.itemNo}</TableCell>
                  <TableCell align="center">{item.description}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="center">
                    <TextField
                      value={item.serialNumber}
                      onChange={(e) => handleInputChange(grnIndex, itemIndex, 'serialNumber', e.target.value)}
                    />
                  </TableCell>
                  <TableCell align="center">{item.receivingDate}</TableCell>
                  <TableCell align="center">
                    <Select
                      value={item.location}
                      onChange={(e) => handleLocationChange(grnIndex, itemIndex, e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select Location</MenuItem>
                      {locationList.map((location) => (
                        <MenuItem key={location.id} value={location.dockCode}>
                          {location.dockCode}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            ))}
            {grnData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">No data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" onClick={handleSaveGRNs} sx={{ marginTop: 4 }}>
        Save GRNs
      </Button>

      {errorMessage && <Typography color="error">{errorMessage}</Typography>}

      {/* Table for Created GRNs (Filtered based on search) */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table aria-label="Created GRNs">
          <TableHead>
            <TableRow>
              <TableCell align="center"><strong>P.O. Number</strong></TableCell>
              <TableCell align="center"><strong>Receiving No.</strong></TableCell>
              <TableCell align="center"><strong>Item No.</strong></TableCell>
              <TableCell align="center"><strong>Description</strong></TableCell>
              <TableCell align="center"><strong>Quantity</strong></TableCell>
              <TableCell align="center"><strong>Supplier</strong></TableCell>
              <TableCell align="center"><strong>Serial Number</strong></TableCell>
              <TableCell align="center"><strong>Invoice No.</strong></TableCell>
              <TableCell align="center"><strong>Location</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(allGrns) && allGrns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  No GRNs available
                </TableCell>
              </TableRow>
            ) : (
              allGrns
                .filter((grn) =>
                  (grn.poNumber || "").toLowerCase().includes(searchPoNumber.trim().toLowerCase())
                )
                .map((grn) => (
                  <React.Fragment key={grn._id}>
                    {/* GRN Header Row */}
                    <TableRow>
                      <TableCell align="center" rowSpan={grn.items?.length + 1}>
                        {grn.poNumber}
                      </TableCell>
                      <TableCell align="center" rowSpan={grn.items?.length + 1}>
                        {grn.receivingNo}
                      </TableCell>
                      <TableCell align="right" colSpan={8} sx={{ fontStyle: 'italic' }}>
                        <Box
                          sx={{
                            ...getStatusColor(grn.status),
                            padding: '4px 10px',
                            borderRadius: '4px',
                            display: 'inline-block',
                          }}
                        >
                          {grn.status}
                        </Box>
                      </TableCell>
                      <TableCell align="center" rowSpan={grn.items?.length + 1}>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteGRN(grn._id)} // Delete GRN action
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Item Rows */}
                    {grn.items?.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell align="center">{item.itemNo}</TableCell>
                        <TableCell align="center">{item.description}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="center">{grn.supplier}</TableCell>
                        <TableCell align="center">{item.serialNumber}</TableCell>
                        <TableCell align="center">{item.invoiceNo}</TableCell>
                        <TableCell align="center">{item.location}</TableCell>
                        <TableCell align="center">{grn.status}</TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteItem(grn._id, item.itemNo)} // Delete item action
                          >
                            Delete Item
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>


    </Box>
  );
};

export default GRNComponent;