import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    useMediaQuery,
    Grid,
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    Alert,
    Button,
    Snackbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SideBarComponent from "../../SideBarComponent";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const Returntosupplier = () => {
    const [grnData, setGrnData] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [undoData, setUndoData] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

    const fetchGrnData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn`);
            setGrnData(response.data.grns);
        } catch (err) {
            console.error("Error fetching GRN data:", err);
        }
    };

    useEffect(() => {
        fetchGrnData();
    }, []);

    const handleSave = async (grnId, itemId) => {
        const { grnIndex, itemIndex, item } = findGrnAndItem(grnId, itemId);
    
        if (grnIndex === -1 || itemIndex === -1) return;
    
        const updatedItem = {
            ...item,
            currentQuantity: (item.quantity || 0) - (item.rejectedQuantity || 0), 
        };
    
        setUndoData({
            grnId,
            itemId,
            prevCurrentQuantity: item.currentQuantity || item.quantity,
            prevRejectedQuantity: item.rejectedQuantity,
        });
    
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/grn/${grnId}/item/${itemId}`, {
                currentQuantity: updatedItem.currentQuantity,
                rejectedQuantity: updatedItem.rejectedQuantity,
            });
    
            if (response.status === 200) {
                setGrnData((prevData) => {
                    const updatedGrnData = [...prevData];
                    updatedGrnData[grnIndex].items[itemIndex] = updatedItem;
                    return updatedGrnData;
                });
    
                setSnackbar({ open: true, message: "Data saved successfully!", severity: "success" });
            }
        } catch (err) {
            console.error("Error saving item:", err);
            setSnackbar({ open: true, message: "Failed to save data. Please try again.", severity: "error" });
        }
    };
    
    const findGrnAndItem = (grnId, itemId) => {
        const grnIndex = grnData.findIndex((grn) => grn._id === grnId);
        const itemIndex = grnData[grnIndex]?.items.findIndex((item) => item._id === itemId);

        return { grnIndex, itemIndex, item: grnData[grnIndex]?.items[itemIndex] };
    };

    const columns = [
        { field: "poNumber", headerName: "PO Number", width: 120 },
        { field: "receivingNo", headerName: "Receiving No", width: 120 },
        { field: "status", headerName: "Status", width: 110 },
        { field: "dockCode", headerName: "Location", width: 110 },
        { field: "supplier", headerName: "Supplier", width: 130 },
        { field: "itemNo", headerName: "Item", width: 140 },
        { field: "quantity", headerName: "Received Quantity", width: 130 },
        { field: "currentQuantity", headerName: "Current Quantity", width: 130 },
        { field: "okQuantity", headerName: "OK Quantity", width: 100 },
        { field: "rejectedQuantity", headerName: "Rejected Quantity", width: 100 },
        {
            field: "actions",
            headerName: "Actions",
            renderCell: ({ row }) => (
                <>
                    <Button variant="outlined" onClick={() => handleSave(row.grnId, row.itemId)} sx={{ mr: 1 }}>
                        Save
                    </Button>
                </>
            ),
            width: 100,
        },
    ];

    const rows = grnData.flatMap((grn) =>
        grn.items.map((item) => ({
            id: `${grn._id}-${item._id}`,
            grnId: grn._id,
            itemId: item._id,
            poNumber: grn.poNumber,
            receivingNo: grn.receivingNo,
            status: item.status,
            supplier: grn.supplier,
            dockCode: item.dockCode,
            itemNo: item.itemNo,
            quantity: item.quantity,
            currentQuantity: item.currentQuantity ?? item.quantity,
            okQuantity: item.okQuantity || 0,
            rejectedQuantity: item.rejectedQuantity || 0,
        }))
    );

    return (
        <Box sx={{ p: 4 }}>
            {isSmallScreen && (
                <AppBar position="fixed">
                    <Toolbar sx={{ height: "80px" }}>
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
            <Grid container sx={{ mx: 1, p: 1 }}>
                {!isSmallScreen && (
                    <Grid item md={2} sx={{ flexShrink: 0 }}>
                        <SideBarComponent />
                    </Grid>
                )}
                <Grid item md={isSmallScreen ? 12 : 10} xs={12}>
                    <Box sx={{ m: 3, bgcolor: "white", borderRadius: 2, p: 3, boxShadow: 3 }}>
                        <Typography variant="h5" sx={{ m: 3, fontWeight: "bold" }}>
                            Return To Supplier
                        </Typography>
                        <div style={{ height: 480, width: "100%" }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={20}
                                rowsPerPageOptions={[20, 50, 100]}
                                disableSelectionOnClick
                            />
                        </div>
                    </Box>
                </Grid>
            </Grid>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Returntosupplier;
