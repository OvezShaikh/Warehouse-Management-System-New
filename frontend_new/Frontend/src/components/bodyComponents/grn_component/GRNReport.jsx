    import React, { useState, useEffect } from 'react';
    import MenuIcon from '@mui/icons-material/Menu';
    import CloseIcon from '@mui/icons-material/Close';
    import {
        Box,
        AppBar,
        Toolbar,
        Typography,
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableHead,
        TableRow,
        Paper,
        Button,
        Select,
        MenuItem,
        Grid,
        TextField,
        Drawer,
        useMediaQuery,
        IconButton,
    } from '@mui/material';
    import axios from 'axios';
    import '../../../index.css';
    import images from '../../../constants/images';
    import SideBarComponent from '../../SideBarComponent';
    import jsPDF from 'jspdf';
    import html2canvas from 'html2canvas';
    import { QRCodeSVG } from 'qrcode.react';

    const GRNReport = () => {
        const [drawerOpen, setDrawerOpen] = useState(false);
        const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));
        const [poNumbers, setPoNumbers] = useState([]);
        const [selectedPo, setSelectedPo] = useState('');
        const [grnData, setGrnData] = useState(null);
        const [isPrintMode, setIsPrintMode] = useState(false);
        const [loading, setLoading] = useState(false);
        const [isFormValid, setIsFormValid] = useState(false);
        const [preparedBy, setPreparedBy] = useState('');
        const [checkedBy, setCheckedBy] = useState('');
        const [qrCodeData, setQrCodeData] = useState('');
        const [putawayLocations, setPutawayLocations] = useState([]);
        const [selectedLocation, setSelectedLocation] = useState('');


        useEffect(() => {
            const fetchPoNumbers = async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn`);
                    const uniquePoNumbers = [...new Set(response.data.grns.map((grn) => grn.poNumber))];
                    setPoNumbers(uniquePoNumbers);
                } catch (error) {
                    console.error('Error fetching GRNs:', error);
                }
            };
            fetchPoNumbers();
        }, []);

        const handlePoChange = async (poNo) => {
            setSelectedPo(poNo);
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn`);
                const filteredGrn = response.data.grns.find((grn) => grn.poNumber === poNo);
                setGrnData(filteredGrn);
            } catch (error) {
                console.error('Error fetching GRN:', error);
            } finally {
                setLoading(false);
            }
        };

        const generateQRCode = (item) => {
            const qrData = `ItemNo:${item.itemNo}|Serial:${item.serialNumber || 'N/A'}|Name:${item.description || 'Unknown'}|Price:${item.price || '0.00'}|Status:${item.status || 'Pending'}`;
            return <QRCodeSVG value={qrData} size={150} />;
        };

        const handleReceivedQtyChange = (index, value) => {
            const updatedItems = [...grnData.items];
            updatedItems[index].receivedQty = value;
            setGrnData({ ...grnData, items: updatedItems });
            checkFormValidity();
        };

        const handleRemarksChange = (index, value) => {
            const updatedItems = [...grnData.items];
            updatedItems[index].remarks = value;
            setGrnData({ ...grnData, items: updatedItems });
            checkFormValidity();
        };

        const handlePreparedByChange = (e) => {
            const value = e.target.value;
            setPreparedBy(value);
            checkFormValidity();
        };

        const handleCheckedByChange = (e) => {
            const value = e.target.value;
            setCheckedBy(value);
            checkFormValidity();
        };


        const handleDownloadGRNPDF = async () => {
            const grnElement = document.querySelector('.printable-grn');
            if (!grnElement) return;

            // Temporarily hide the "Download GRN" button or any elements you want to exclude
            const downloadButton = document.querySelector('.download-grn-button'); // Adjust selector as needed
            if (downloadButton) {
                downloadButton.style.display = 'none';
            }

            // Apply styles to increase input size and center-align text
            const inputElements = grnElement.querySelectorAll('input'); // Adjust to select specific inputs if needed
            inputElements.forEach(input => {
                input.style.fontSize = '18px'; // Increase font size
                input.style.textAlign = 'top'; // Center align text
                input.style.paddingTop = '5px'; // Move text to the top
                input.style.lineHeight = '1.5';
            });

            const pdf = new jsPDF();
            const canvas = await html2canvas(grnElement, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`GRN_Report_${selectedPo || 'default'}.pdf`);

            // Restore the visibility of the "Download GRN" button
            if (downloadButton) {
                downloadButton.style.display = '';
            }

            // Revert input styles to their original state
            inputElements.forEach(input => {
                input.style.fontSize = ''; // Revert to original font size
                input.style.textAlign = ''; // Revert to original text alignment
            });
        };



        const handleDownloadStickersPDF = async () => {
            const stickersElement = document.querySelector('.printable-stickers');
            if (!stickersElement) return;

            // Temporarily hide the "Download Stickers" button or any elements you want to exclude
            const downloadButton = document.querySelector('.download-stickers-button'); // Adjust selector as needed
            if (downloadButton) {
                downloadButton.style.display = 'none';
            }

            // Apply styles to increase input size and center-align text
            const inputElements = stickersElement.querySelectorAll('input'); // Adjust to select specific inputs if needed
            inputElements.forEach(input => {
                input.style.fontSize = '18px'; // Increase font size
                input.style.textAlign = 'center'; // Center align text horizontally
                input.style.paddingTop = '5px'; // Move text downward
                input.style.lineHeight = '1.5'; // Adjust line spacing
            });

            const pdf = new jsPDF();
            const canvas = await html2canvas(stickersElement, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Stickers_Report_${selectedPo || 'default'}.pdf`);

            // Restore the visibility of the "Download Stickers" button
            if (downloadButton) {
                downloadButton.style.display = '';
            }

            // Revert input styles to their original state
            inputElements.forEach(input => {
                input.style.fontSize = ''; // Revert to original font size
                input.style.textAlign = ''; // Revert to original text alignment
                input.style.paddingTop = ''; // Revert padding
                input.style.lineHeight = ''; // Revert line height
            });
        };

        const checkFormValidity = () => {
            const isValid = grnData.items.every(
                (item) =>
                    item.receivedQty !== '' &&
                    !isNaN(item.receivedQty) &&
                    (item.receivedQty >= 0 || item.receivedQty === 0) &&
                    (item.remarks || '').trim() !== ''
            ) && preparedBy.trim() !== '' && checkedBy.trim() !== '';
            setIsFormValid(isValid);
        };

        useEffect(() => {
            const fetchLocations = async () => {
              try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/locations`);
                setPutawayLocations(response.data.locations); // assuming response contains a locations array
                set
              } catch (error) {
                console.error('Error fetching locations:', error);
              }
            };
            fetchLocations();
          }, []);

        return (
            <Box sx={{ padding: '20px', fontFamily: 'Arial' }}>
                {isSmallScreen && (
                    <AppBar position="fixed">
                        <Toolbar sx={{ height: '80px' }}>
                            <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
                                <MenuIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                )}

                <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                    <Box sx={{ width: 250 }}>
                        <IconButton onClick={() => setDrawerOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                        <SideBarComponent />
                    </Box>
                </Drawer>

                <Grid container sx={{ mx: 3, p: 3 }}>
                    {!isSmallScreen && (
                        <Grid item md={2} sx={{ flexShrink: 0 }}>
                            <SideBarComponent />
                        </Grid>
                    )}
                    <Grid item xs={isSmallScreen ? 12 : 10} sx={{ backgroundColor: 'white' }}>
                        <Grid container sx={{ mx: 3 }}>
                            <Grid item xs={12} sx={{ backgroundColor: 'white' }}>
                                <Box sx={{ marginBottom: '20px' }}>
                                    <Typography variant="h6">Select PO Number:</Typography>
                                    <Select
                                        value={selectedPo}
                                        onChange={(e) => handlePoChange(e.target.value)}
                                        displayEmpty
                                        sx={{ minWidth: '200px' }}
                                    >
                                        <MenuItem value="" disabled>
                                            Select PO Number
                                        </MenuItem>
                                        {poNumbers.map((po) => (
                                            <MenuItem key={po} value={po}>
                                                {po}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>

                                {loading && <Typography>Loading...</Typography>}

                                {grnData && (
                                    <Box sx={{ border: '1px solid black', padding: '16px', marginBottom: '10px' }} className="printable-grn">
                                        <img
                                            src={images.UnostarLogo}
                                            alt="Unostar Logo"
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                maxWidth: '250px',
                                                maxHeight: '60px',
                                                objectFit: 'contain',
                                            }}
                                        />
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography variant="subtitle2">
                                                    <strong>Company Name:</strong>{grnData.supplier}
                                                </Typography>
                                                <Typography variant="body2">Address Line 1</Typography>
                                                <Typography variant="body2">Address Line 2</Typography>
                                                <Typography variant="body2">City - Pin</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                                <Typography variant="subtitle2">
                                                    <strong>PO No:</strong> {grnData.poNumber}
                                                </Typography>
                                                <Typography variant="subtitle2">
                                                    <strong>GRN No:</strong> {grnData.receivingNo}
                                                </Typography>
                                                <Typography variant="subtitle2">
                                                    <strong>Date:</strong> {new Date().toLocaleDateString()}
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Typography variant="h6" align="center" sx={{ margin: '20px 0' }}>
                                            Goods Receipt Note Cum Inspection Report
                                        </Typography>

                                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid black' }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ textAlign: 'center' }}><strong>Item No</strong></TableCell>
                                                        <TableCell sx={{ textAlign: 'center' }}><strong>Description</strong></TableCell>
                                                        <TableCell sx={{ textAlign: 'center' }}><strong>Location</strong></TableCell>
                                                        <TableCell sx={{ textAlign: 'center' }}><strong>Challan Qty</strong></TableCell>
                                                        <TableCell sx={{ textAlign: 'center' }}><strong>Received Qty</strong></TableCell>
                                                        <TableCell sx={{ textAlign: 'center' }}><strong>Item Status</strong></TableCell>
                                                        <TableCell sx={{ textAlign: 'center' }}><strong>Remarks</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {grnData.items.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell sx={{ textAlign: 'center' }}>{item.itemNo}</TableCell>
                                                            <TableCell sx={{ textAlign: 'center' }}>{item.description}</TableCell>
                                                            <TableCell sx={{ textAlign: 'center' }}>{item.dockCode}</TableCell>
                                                            <TableCell sx={{ textAlign: 'center' }}>{item.quantity}</TableCell>
                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                <TextField
                                                                    value={item.receivedQty || ''}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        const parsedValue = value === '' ? '' : isNaN(value) ? '' : parseFloat(value);
                                                                        handleReceivedQtyChange(index, parsedValue);
                                                                    }}
                                                                    type="number"
                                                                    size="small"
                                                                    required
                                                                    sx={{ width: '180px', textAlign: 'center' }}
                                                                    error={item.receivedQty === '' || isNaN(item.receivedQty)}
                                                                    helperText={item.receivedQty === '' || isNaN(item.receivedQty) ? 'Please enter a valid number' : ''}
                                                                    className={`print-mode ${isPrintMode ? 'hide-input' : ''}`}
                                                                />
                                                            </TableCell>
                                                            <TableCell sx={{ textAlign: 'center' }}>{item.status}</TableCell>
                                                            <TableCell sx={{ textAlign: 'center', alignItems: 'center' }}>
                                                                <TextField
                                                                    value={item.remarks || ''}
                                                                    onChange={(e) => handleRemarksChange(index, e.target.value)}
                                                                    size="small"
                                                                    sx={{
                                                                        width: '150px',
                                                                        textAlign: 'center',
                                                                    }}
                                                                    className={`print-mode ${isPrintMode ? 'hide-input' : ''}`}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        <Box sx={{ marginTop: '20px' }}>
                                            <Typography variant="body2"><strong>Prepared By:</strong></Typography>
                                            <TextField
                                                value={preparedBy}
                                                onChange={handlePreparedByChange}
                                                size="small"
                                                sx={{ width: '250px', textAlign: 'center' }}
                                                className={`print-mode ${isPrintMode ? 'hide-input' : ''}`}
                                            />
                                        </Box>

                                        <Box sx={{ marginTop: '20px' }}>
                                            <Typography variant="body2"><strong>Checked By:</strong></Typography>
                                            <TextField
                                                value={checkedBy}
                                                onChange={handleCheckedByChange}
                                                size="small"
                                                sx={{ width: '250px', textAlign: 'center' }}
                                                className={`print-mode ${isPrintMode ? 'hide-input' : ''}`}
                                            />
                                        </Box>

                                        <Button
                                            className='download-grn-button'
                                            variant="contained"
                                            onClick={handleDownloadGRNPDF}
                                            sx={{ marginTop: '20px' }}
                                            disabled={!isFormValid}
                                        >
                                            Download GRN
                                        </Button>

                                        <Typography variant="body2" align="right">
                                            Copyright © 2017 Unostar Value Chain Pvt Ltd. All Rights Reserved.
                                        </Typography>

                                    </Box>
                                )}

                                {grnData && (
                                    <Box sx={{ border: '1px solid black', padding: '16px' }} className="printable-stickers">
                                        <Typography variant="h6" align="center" sx={{ marginBottom: '20px' }}>
                                            Stickers
                                        </Typography>
                                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid black' }}>
                                            <Table>
                                                {/* <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ textAlign: 'center' }}><strong>Item No</strong></TableCell>
                                                        <TableCell sx={{ textAlign: 'center' }}><strong>Description</strong></TableCell>
                                                        <TableCell sx={{ textAlign: 'center' }}><strong>Challan Qty</strong></TableCell>
    c                                                    <TableCell sx={{ textAlign: 'center', wordWrap: 'break-word' }}><strong>Remarks</strong></TableCell>
                                                        <TableCell sx={{ textAlign: 'center' }}><strong>QR Code</strong></TableCell>
                                                    </TableRow>
                                                </TableHead> */}
                                                <TableBody sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'start', overflow: 'none' }}>
                                                {/* {grnData.map(() => (
                                                <TableCell sx={{ textAlign: 'center' }}>
                                                                <select
                                                                    value={selectedLocation}
                                                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                                                    style={{ width: '150px', textAlign: 'center' }}
                                                                >
                                                                    <option value="">Select Location</option>
                                                                    {putawayLocations.map((location) => (
                                                                        <option key={location.locationCode} value={location.locationCode}>
                                                                            {location.locationCode}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </TableCell>))} */}

                                                    {grnData.items.map((item, index) => (
                                                        <TableHead key={index} sx={{ display: 'flex', flexDirection: 'row' }}>
                                                            <TableHead sx={{ display: 'flex', flexDirection: 'row' }}>
                                                                <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'center' }}><strong>Item No: </strong>
                                                                    <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'center' }}>{item.itemNo}</TableCell></TableCell>
                                                                <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'center' }}><strong>Description: </strong>
                                                                    <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'center' }}>{item.description}</TableCell></TableCell>
                                                                <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'center' }}><strong>Serial No: </strong>
                                                                    <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'center' }}>{item.serialNumber}</TableCell></TableCell>
                                                                <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'center' }}><strong>Challan Qty: </strong>
                                                                    <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'center' }}>{item.quantity}</TableCell></TableCell>
                                                                <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'center' }}><strong>Received Qty: </strong>
                                                                    <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'center' }}>{item.receivedQty || ''}</TableCell></TableCell>
                                                                <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'center', wordWrap: 'break-word' }}><strong>Remarks: </strong>
                                                                    <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'center', wordWrap: 'break-word', width: '100px' }}>{item.remarks || ''}</TableCell></TableCell>
                                                                    <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'center', wordWrap: 'break-word' }}><strong>Item status: </strong>
                                                                    <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'center', wordWrap: 'break-word', width: '100px' }}>{item.status || ''}</TableCell></TableCell>
                                                            </TableHead>
                                                            
                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                {generateQRCode(item)} {/* Display QR code */}
                                                            </TableCell>
                                                        </TableHead>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        <Button
                                            className='download-stickers-button'
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleDownloadStickersPDF}
                                            sx={{ marginTop: '20px' }}
                                        >
                                            Download Stickers
                                        </Button>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    export default GRNReport;
