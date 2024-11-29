import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Select, MenuItem, } from "@mui/material";
import axios from 'axios';
import ExcelJS from 'exceljs';
// import { QrReader } from 'react-qr-reader';
import QrScanner from 'react-qr-scanner';
import { format } from 'date-fns';
import { useAuth } from "../../../AuthContext";

const GRNComponent = () => {
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
  const [liveLocations, setLiveLocations] = useState([]);
  const [loadingGrnId, setLoadingGrnId] = useState(null);
  const today = format(new Date(), 'yyyy-MM-dd');
  const {userRole} = useAuth();



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
              dockCode: item.docklocation || item.dockCode,
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


    const fetchLiveLocations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/locations`);

        // Log the response to check the format of the returned data
        console.log("Locations Response:", response);

        // Ensure that the locations data is in the expected format
        if (response.data && Array.isArray(response.data)) {
          setLiveLocations(response.data); // Set your locations data
        } else {
          console.error("Live locations data is not in the expected format:", response.data);
          setErrorMessage("Invalid data format for live locations.");
        }
      } catch (err) {
        console.error("Error fetching locations:", err);
        setErrorMessage("Failed to fetch live locations.");
      }
    };

    const fetchAllGrns = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn`);
        console.log("fetchallgrns Full Response:", response);
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
    fetchLiveLocations();
  }, []);

  const handleLocationBeforeCreation = (grnIndex, itemIndex, locationCode) => {
    const updatedGrnData = [...grnData];  // Copy the current GRN data

    const item = updatedGrnData[grnIndex].items[itemIndex];

    if (!item) {
      console.error("Item not found in GRN data.");
      return;
    }

    // Find the location object by locationCode
    const location = locationList.find(loc => loc.dockCode === locationCode);
    if (!location) {
      console.error(`Location with dockCode ${locationCode} not found.`);
      return;
    }

    // Set the docklocation for the item
    item.docklocation = location.dockCode;

    // Update the state with the modified GRN data
    setGrnData(updatedGrnData);

    console.log("Dock location set for item:", item);
  };



  const handleLocationChange = async (grnId, itemId, selectedLocation, dockCode) => {
    setLoadingGrnId(grnId); // Show spinner for current GRN
    console.log("Selected Location for GRN Update:", selectedLocation);

    try {
      // Fetch all locations from the API
      const locationResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/locations`);
      const locations = locationResponse.data;

      const grnResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn/${grnId}`);
      const grnData = grnResponse.data;

      // Find the relevant item in the local GRN data (for now, used for validation)
      const item = grnData.items?.find((item) => item._id.toString() === itemId.toString());
      if (!item) {
        throw new Error(`Item with ID ${itemId} not found in GRN ${grnId}`);
      }

      const itemQuantity = item.quantity;

      // Find the selected location in the available locations
      const locationData = locations.find(
        (loc) => loc.locationCode === selectedLocation.locationCode
      );

      if (!locationData) {
        throw new Error(`Location with code ${selectedLocation.locationCode} not found.`);
      }

      // Prepare the payload for the backend with location details
      const payload = {
        grnId,
        items: [
          {
            itemId,
            newLocation: selectedLocation.locationCode,
            locationCode: selectedLocation.locationCode,
            dockCode,
            capacity: locationData.capacity - itemQuantity, // Adjust capacity after moving item
            currentLoad: locationData.currentLoad + itemQuantity, // Adjust current load after moving item
          },
        ],
      };

      console.log("Payload sent to backend:", payload);

      // Send the update request to the backend
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/locations/update-location`,
        payload
      );

      if (response.status === 200) {
        // Fetch fresh GRN data from the backend after successful update
        const updatedGrnResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/grn/${grnId}`
        );
        const updatedGrnData = updatedGrnResponse.data;

        // Update the local GRN data with the fresh data from the backend
        setGrnData(updatedGrnData);

        toast.success("Dock location and dock code updated successfully!");
      } else {
        throw new Error("Failed to update location on backend.");
      }
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update dock location.");
    } finally {
      setLoadingGrnId(null); // Reset loading spinner
    }
  };







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
        existingGRN.items.push(itemData);
      });
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

  const handleInputChange = (grnIndex, itemIndex, field, value) => {
    const updatedGrnData = [...grnData];
    updatedGrnData[grnIndex].items[itemIndex][field] = value;
    setGrnData(updatedGrnData);
  };

  const handleSaveGRNs = async () => {
    try {
      const savedGrns = [];
      for (const grn of grnData) {
        const grnDataToPost = {
          poNumber: grn.poNumber,
          receivingNo: grn.receivingNo,
          receivingDate: grn.receivingDate,
          supplier: grn.supplier,
          status: grn.status,
          items: grn.items.map((item) => ({
            itemNo: item.itemNo,
            description: item.description,
            quantity: item.quantity,
            serialNumber: item.serialNumber,
            invoiceNo: item.invoiceNo,
            dockCode: item.docklocation || item.dockCode,
            receivingDate: item.receivingDate,
          })),
        };

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/grn`,
          grnDataToPost
        );
        savedGrns.push(response.data);
      }

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

    if (userRole !== 'admin') {
      toast.error("You do not have permission to delete GRNs.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this GRN?")) return;
    try {
      // Fetch the GRN to get the list of items
      const grnResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn/${grnId}`);
      const grnData = grnResponse.data;
  
      // Loop through each item in the GRN and update stock
      for (const item of grnData.items) {
        const location = liveLocations.find((loc) => loc.locationCode === item.dockCode);
        if (location) {
          const updatedStock = location.currentLoad - item.quantity;
  
          // Update the stock in the location (allowing it to go negative)
          await axios.patch(`${import.meta.env.VITE_API_URL}/api/locations/${location._id}/stock`, {
            stock: updatedStock,
          });
        }
      }
  
      // Make API request to delete the GRN
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/grn/${grnId}`);
  
      // Remove the GRN from the frontend state
      setAllGrns((prevState) => prevState.filter((grn) => grn._id !== grnId));
  
      alert("GRN and stock updated successfully.");
    } catch (error) {
      console.error("Error deleting GRN:", error);
      alert("Failed to delete GRN.");
    }
  };
  

  const handleDeleteItem = async (grnId, itemNo) => {
    

    if (userRole !== 'admin') {
      toast.error("You do not have permission to delete items.");
      return;
    }
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
      toast.error("Failed to delete item. Check for single Item !!");
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
    if (toastVisible) {
      setToastVisible(true);
    } else {
      setToastVisible(false);
    }
  }, [toastVisible]);


  // useEffect(() => {
  //   // Poll for updated data every 10 seconds
  //   const interval = setInterval(() => {
  //     axios.get('/api/grn')  // Replace with your API endpoint
  //       .then((response) => {
  //         setGrns(response.data);
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching GRNs:', error);
  //       });
  //   }, 10000);

  //   // Cleanup polling interval when component unmounts
  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   // Function to fetch GRNs data from the API
  //   const fetchGrns = async () => {
  //     try {
  //       const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn`); // Your API endpoint to fetch GRNs
  //       setGrns(response.data); // Set the fetched data into the state
  //     } catch (error) {
  //       console.error('Error fetching GRNs:', error);
  //     }
  //   };

  //   // Fetch data initially when the component mounts
  //   fetchGrns();

  //   // Poll for updated data every 10 seconds
  //   const interval = setInterval(() => {
  //     fetchGrns(); // Call the fetch function to get the updated GRNs
  //   }, 10000); // Update every 10 seconds

  //   // Cleanup polling interval when component unmounts
  //   return () => clearInterval(interval);
  // }, []); // Empty dependency array ensures this only runs once when the component mounts




  return (
    <Box sx={{ padding: 4 }}>
      {toastVisible && (
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
      )}
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>Goods Receipt Note (GRN)</Typography>
      {isScannerOpen && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300, }}>
          <Box sx={{ backgroundColor: '#fff', padding: 3, borderRadius: 2, width: '80%', maxWidth: 500, position: 'relative', overflow: 'hidden', }}>
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
                      value={item.docklocation || ""}
                      onChange={(e) => handleLocationBeforeCreation(grnIndex, itemIndex, e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select Location</MenuItem>
                      {locationList.map((location) => (
                        <MenuItem key={location.dockCode} value={location.dockCode}>
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
            <TableRow style={{ width: '100%' }}>
              <TableCell align="center" style={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 2 }}><strong>P.O. Number</strong></TableCell>
              <TableCell align="center" style={{ position: 'sticky', left: '90px', backgroundColor: 'white', zIndex: 2 }}><strong>Receiving No.</strong></TableCell>
              <TableCell align="center" style={{ position: 'sticky', left: '180px', backgroundColor: 'white', zIndex: 2 }}><strong>Item No.</strong></TableCell>
              <TableCell align="center"><strong>Description</strong></TableCell>
              <TableCell align="center"><strong>Quantity</strong></TableCell>
              <TableCell align="center"><strong>Supplier</strong></TableCell>
              <TableCell align="center"><strong>Serial Number</strong></TableCell>
              <TableCell align="center"><strong>Invoice No.</strong></TableCell>
              <TableCell align="center"><strong>DockLocation/ PutawayLocation</strong></TableCell>
              <TableCell align="center"><strong>Set PutawayLocation</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
              <TableCell align="center"><strong>Status </strong></TableCell>
              <TableCell align="left" className="w-full text-nowrap"><strong>Actions and Putaway</strong></TableCell>
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
                      <TableCell align="center" rowSpan={grn.items?.length + 1} style={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 2 }}>
                        {grn.poNumber}
                      </TableCell>
                      <TableCell align="center" rowSpan={grn.items?.length + 1} style={{ position: 'sticky', left: '90px', backgroundColor: 'white', zIndex: 2 }}>
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
                          Delete GRN
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Item Rows */}
                    {grn.items.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell align="center" style={{ position: 'sticky', left: '180px', backgroundColor: 'white', zIndex: 2 }}>{item.itemNo}</TableCell>
                        <TableCell align="center">{item.description}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="center">{grn.supplier}</TableCell>
                        <TableCell align="center">{item.serialNumber}</TableCell>
                        <TableCell align="center">{item.invoiceNo}</TableCell>
                        <TableCell align="center">{item.dockCode || "No Dock Code"}</TableCell>


                        {/* Dock Location Dropdown */}
                        <TableCell align="center">
                          <Select
                            value={item.dockLocation || item.dockCode || ""}
                            onChange={async (e) => {
                              const selectedLocation = liveLocations.find(
                                (location) => location.locationCode === e.target.value
                              );
                              const previousLocation = liveLocations.find(
                                (location) => location.locationCode === (item.dockLocation || item.dockCode)
                              );

                              if (selectedLocation) {
                                try {
                                  // Subtract quantity from previous location's stock
                                  if (previousLocation) {
                                    await axios.patch(`${import.meta.env.VITE_API_URL}/api/locations/${previousLocation._id}/stock`, {
                                      stock: previousLocation.currentLoad - item.quantity,
                                    });
                                  }

                                  // Add quantity to new location's stock
                                  await axios.patch(`${import.meta.env.VITE_API_URL}/api/locations/${selectedLocation._id}/stock`, {
                                    stock: selectedLocation.currentLoad + item.quantity,
                                  });

                                  // Backend call to update the item's dockLocation
                                  await handleLocationChange(grn._id, item._id, selectedLocation);

                                  // Update UI (optimistic update)
                                  setGrnData((prevGrns) => {
                                    const updatedGrns = Array.isArray(prevGrns) ? prevGrns : [];
                                    return updatedGrns.map((g) =>
                                      g._id === grn._id
                                        ? {
                                          ...g,
                                          items: g.items.map((i) =>
                                            i._id === item._id
                                              ? { ...i, dockLocation: selectedLocation.locationCode }
                                              : i
                                          ),
                                        }
                                        : g
                                    );
                                  });

                                  // Update liveLocations to reflect new currentLoad
                                  setLiveLocations((prevLocations) =>
                                    prevLocations.map((loc) => {
                                      if (loc._id === selectedLocation._id) {
                                        return { ...loc, currentLoad: loc.currentLoad + item.quantity };
                                      } else if (previousLocation && loc._id === previousLocation._id) {
                                        return { ...loc, currentLoad: loc.currentLoad - item.quantity };
                                      }
                                      return loc;
                                    })
                                  );

                                  toast.success("Dock location updated successfully!");
                                } catch (error) {
                                  console.error("Error updating location:", error);
                                  toast.error("Failed to update dock location.");
                                }
                              } else {
                                toast.warning("Invalid location selection or no change made.");
                              }
                            }}
                          >
                            {liveLocations.map((location) => (
                              <MenuItem key={location._id} value={location.locationCode}>
                                {location.locationCode} - ({location.stock} / {location.capacity})
                                {/* Total: {location.stock} */}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>

                        {/* Table Cell showing Status */}
                        {/* <TableCell align="center">{item.status}</TableCell> */}
                        <TableCell align="left" sx={{ fontStyle: 'italic' }}>
                          <Box
                            sx={{
                              ...getStatusColor(item.status),
                              padding: '4px 10px',
                              borderRadius: '4px',
                              display: 'inline-block',
                            }}
                          >
                            {item.status}
                          </Box>
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="left">
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