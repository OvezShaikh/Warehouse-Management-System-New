import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
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
  Drawer,
  useMediaQuery,
  IconButton,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Import the delete icon
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2pdf from "html2pdf.js";
import { QRCodeSVG } from "qrcode.react";
import SideBarComponent from "../../SideBarComponent";
import images from "../../../constants/images";
import jsPDF from "jspdf";

const Report2Component = () => {
  const [grnData, setGrnData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [selectedPoNumber, setSelectedPoNumber] = useState("");
  const [groupedItems, setGroupedItems] = useState({});
  const [stickers, setStickers] = useState([]);

  useEffect(() => {
    const fetchGrnData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/grn`
        );
        const data = response.data.grns || [];
        setGrnData(data);

        const grouped = data.reduce((acc, grn) => {
          grn.items.forEach((item, index) => {
            const key = `${grn.poNumber}-${item.itemNo}-${item.receivingDate}-${index}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push({ ...item, ...grn });
          });
          return acc;
        }, {});

        setGroupedItems(grouped);
      } catch (error) {
        console.error("Error fetching GRN data:", error);
        toast.error("Failed to fetch GRN data.");
      }
    };
    fetchGrnData();
  }, []);

  const filteredItems = selectedPoNumber
    ? Object.values(groupedItems)
      .flat()
      .filter((item) => item.poNumber === selectedPoNumber)
    : Object.values(groupedItems).flat();

  const handlePoNumberChange = (event) => {
    setSelectedPoNumber(event.target.value);
  };

  const generateSticker = (item) => {
    setStickers((prevStickers) => [...prevStickers, item]);
  };

  const deleteSticker = (index) => {
    setStickers((prevStickers) =>
      prevStickers.filter((_, stickerIndex) => stickerIndex !== index)
    );
  };

  const convertSVGToPNG = async (svgElement) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        const pngData = canvas.toDataURL("image/png");
        URL.revokeObjectURL(url);
        resolve(pngData);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Error converting SVG to PNG"));
      };

      img.src = url;
    });
  };

  const downloadAllStickersPDF = async () => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const qrSize = 50;
      const textFontSize = 10;
      let yOffset = margin;

      for (const [index, item] of stickers.entries()) {
        const canvas = document.querySelector(`#qr-code-${item.itemNo}-${index}`);
        if (!canvas) continue;

        const svg = canvas.querySelector("svg");
        if (!svg) continue;

        const pngDataUrl = await convertSVGToPNG(svg);

        // Add item details
        pdf.setFontSize(textFontSize);
        pdf.text(`Receiving No: ${item.receivingNo}`, margin, yOffset); // Add receivingNo for uniqueness
        pdf.text(`Supplier: ${item.supplier}`, margin, yOffset + 10); // Add receivingNo for uniqueness
        pdf.text(`Item No: ${item.itemNo}`, margin, yOffset + 20);
        pdf.text(`Description: ${item.description}`, margin, yOffset + 30);
        pdf.text(`Quantity: ${item.quantity}`, margin, yOffset + 40);
        pdf.text(`Receiving Date: ${item.receivingDate}`, margin, yOffset + 50);

        // Add QR code image
        pdf.addImage(pngDataUrl, "PNG", pageWidth - qrSize - margin, yOffset, qrSize, qrSize);

        yOffset += qrSize + 20;

        // Add a new page if the content exceeds the current page height
        if (yOffset + qrSize > pdf.internal.pageSize.getHeight()) {
          pdf.addPage();
          yOffset = margin;
        }
      }

      pdf.save("All_QR_Stickers.pdf");
      toast.success("All QR Stickers downloaded successfully!");
    } catch (error) {
      console.error("Error generating QR Stickers:", error);
      toast.error("Failed to generate QR Stickers.");
    }
  };



  const downloadPDF = () => {
    const element = document.getElementById("pdf-content");

    // Hide buttons before generating PDF
    const buttons = element.querySelectorAll("button");
    const actionColumns = element.querySelectorAll("td:nth-child(7), th:nth-child(7)"); // Select the 6th column (Actions)

    buttons.forEach((button) => (button.style.display = "none"));
    actionColumns.forEach((col) => (col.style.display = "none"));

    html2pdf()
      .from(element)
      .set({
        margin: 0.5,
        filename: "GRN_Report.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        // Get the width and height of the page
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Set text style for the copyright text
        const fontSize = 10;
        const margin = 0.5;
        const text = "Copyright © 2017 Unostar Value Chain Pvt Ltd. All Rights Reserved.";

        // Position the text at the bottom-right corner
        pdf.setFontSize(fontSize);
        pdf.text(text, pageWidth - margin - pdf.getTextWidth(text), pageHeight - margin);

        // Save the PDF
        pdf.save("GRN_Report.pdf");

        // Show buttons again after PDF generation
        buttons.forEach((button) => (button.style.display = ""));
        actionColumns.forEach((col) => (col.style.display = ""));
      });
  };




  return (
    <Box sx={{ padding: 6, minHeight: "100vh" }}>
      {isSmallScreen && (
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, padding: 2 }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
          <SideBarComponent />
        </Box>
      </Drawer>

      <Grid container spacing={2} sx={{ marginTop: isSmallScreen ? 8 : 0 }}>
        <Grid item md={2} sx={{ display: { xs: "none", md: "block" } }}>
          <SideBarComponent />
        </Grid>

        <Grid item xs={12} md={10}>
          <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', height: 'auto', minHeight: '60vh' }} id="pdf-content">
            <Box sx={{ marginBottom: 2 }}>
              <img
                src={images.UnostarLogo}
                alt="Unostar Logo"
                style={{ maxWidth: 350 }}
              />
            </Box>

            <Typography variant="h5" align="center" gutterBottom>
              Goods Receipt Note Cum Inspection Report
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>PO Number</InputLabel>
              <Select
                value={selectedPoNumber}
                onChange={handlePoNumberChange}
                label="PO Number"
              >
                {[...new Set(grnData.map((grn) => grn.poNumber))].map(
                  (poNumber, index) => (
                    <MenuItem key={index} value={poNumber}>
                      {poNumber}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Grn</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Item No</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.map((item, index) => (
                    <TableRow key={`${item.itemNo}-${index}`}>
                      <TableCell>{item.receivingNo}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>{item.itemNo}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => generateSticker(item)}
                        >
                          Generate Sticker
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h8" sx={{ marginTop: 8, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>Checked By : </Typography>

            <Button
              variant="contained"
              color="success"
              sx={{ marginTop: 3, width: "200px" }}
              onClick={downloadPDF}
            >
              Download Report
            </Button>

            {/* <Box
              sx={{
                position: 'absolute',
                bottom: 10, // Distance from the bottom
                right: 10,  // Distance from the right
                fontSize: '12px',  // Font size
                color: '#000',  // Text color
                textAlign: 'right', // Align text to the right
              }}
            >
              Copyright © 2017 Unostar Value Chain Pvt Ltd. All Rights Reserved.
            </Box> */}

          </Paper>

          {stickers.length > 0 && (
            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h6">Generated Stickers</Typography>
              <Grid container spacing={2}>
                {stickers.map((item, index) => (
                  <Grid item xs={6} md={3} key={`${item.itemNo}-${index}`}>

                    <Paper elevation={3} sx={{ padding: 2, textAlign: "center" , position: "relative"}}>

                      <IconButton
                        aria-label="delete"
                        size="small"
                        sx={{ position: "absolute", top: 5, right: 5 }}
                        onClick={() => deleteSticker(index)}
                      >
                        <DeleteIcon fontSize="small" sx={{ color: "error.main" }} />
                      </IconButton>

                      <Typography variant="body1">Item No: {item.itemNo}</Typography>
                      <Typography variant="body2">{item.description}</Typography>
                      <Typography variant="body2">Item quantity : {item.quantity}</Typography>

                      <Box id={`qr-code-${item.itemNo}-${index}`} sx={{ marginY: 2 }}>

                        <QRCodeSVG
                          value={JSON.stringify({
                            receivingNo: item.receivingNo, // Unique GRN identifier
                            supplier: item.supplier,
                            itemNo: item.itemNo,
                            description: item.description,
                            quantity: item.quantity,
                            receivingDate: item.receivingDate,
                          })}
                          size={100}
                        />

                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              <Button
                variant="contained"
                color="success"
                sx={{ marginTop: 3 }}
                onClick={downloadAllStickersPDF}
              >
                Download All Stickers
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
};

export default Report2Component;
