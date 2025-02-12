import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid, Select, MenuItem, InputLabel, FormControl, Paper, Divider, TextField } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { DeleteOutline } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";
// import RobotoBold from './Roboto-Regular-bold';
import fontData from './Roboto-Regular.ttf';

export default function OrderModal({ order }) {
  const [products, setProducts] = useState(order.products);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerFirstName, setCustomerFirstName] = useState(order.customer.firstName);
  const [customerLastName, setCustomerLastName] = useState(order.customer.lastName);
  const invoiceRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = await response.json();
        setAvailableProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setProducts([...products, { product: { id: "", name: "", stock: 0, amount: 0 }, quantity: 0 }]);
  };

  const handleRemoveProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    if (field === "name") {
      updatedProducts[index].product.name = value;
      const selectedProduct = availableProducts.find((p) => p.name === value);
      updatedProducts[index].product.id = selectedProduct ? selectedProduct.id : "";
      updatedProducts[index].product.amount = selectedProduct ? selectedProduct.amount : 0;
    } else if (field === "quantity") {
      updatedProducts[index].quantity = value;
    } else if (field === "amount") {
      updatedProducts[index].product.amount = value;
    }
    setProducts(updatedProducts);
  };

  const calculateTotalAmount = () => {
    return products.reduce((total, product) => total + product.product.amount * product.quantity, 0);
  };

  const downloadInvoice = () => {
    const doc = new jsPDF();
    doc.addFont(fontData, 'RobotoRegular', 'normal');

    doc.setFont('RobotoRegular');
    doc.setFontSize(16);
    doc.text(`Order Invoice - ${order.id}`, 10, 10);

    doc.setFontSize(12);
    doc.text(`Customer: ${customerFirstName} ${customerLastName}`, 10, 20);
    doc.text(`Mobile: ${order.customer.mobile}`, 10, 30);
    doc.text(`Total Products: ${products.length}`, 10, 40);

    doc.autoTable({
      startY: 50,
      head: [["Product Name", "Quantity", "Stock", "Amount"]],
      body: products.map((product) => [
        product.product.name,
        product.quantity,
        product.product.stock,
        `${product.product.amount}`,
      ]),
    });

    doc.text(`Total Amount: ${"\u20B9"}${calculateTotalAmount()}`, 10, doc.lastAutoTable.finalY + 10);
    doc.setFont('RobotoRegular');
    doc.save(`Order_${order.id}_Invoice.pdf`);
  };

  if (loading) return <Typography>Loading products...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80vw",
        maxWidth: "800px",
        height: "80vh",
        maxHeight: "90vh",
        bgcolor: "white",
        borderRadius: 2,
        overflow: "auto",
        padding: 4,
        zIndex: 1300,
      }}
    >
      <Typography variant="h5">Order List</Typography>
      <Divider sx={{ my: 2 }} />

      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Product Name</InputLabel>
                    <Select
                      value={product.product.name}
                      onChange={(e) => handleProductChange(index, "name", e.target.value)}
                    >
                      {availableProducts.map((availableProduct) => (
                        <MenuItem key={availableProduct.id} value={availableProduct.name}>
                          {availableProduct.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                    placeholder="Quantity"
                    fullWidth
                  />
                </TableCell>
                <TableCell>{product.product.stock}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={product.product.amount}
                    onChange={(e) => handleProductChange(index, "amount", e.target.value)}
                    placeholder="Amount"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRemoveProduct(index)}>
                    <DeleteOutline color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={handleAddProduct} sx={{ mb: 2 }}>
        Add Product
      </Button>

      <Typography variant="h5">Invoice</Typography>
      <Divider sx={{ my: 2 }} />

      <Box sx={{ marginBottom: 4 }} ref={invoiceRef}>
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              value={customerFirstName}
              onChange={(e) => setCustomerFirstName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              value={customerLastName}
              onChange={(e) => setCustomerLastName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Order ID:</strong> {order.id}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Mobile:</strong> {order.customer.mobile}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Total Products:</strong> {products.length}</Typography>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Stock Availability</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.product.stock}</TableCell>
                  <TableCell>{`${"\u20B9"}${product.product.amount}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="subtitle1"><strong>Total Amount: {`${"\u20B9"}${calculateTotalAmount()}`}</strong></Typography>
      </Box>
      <Button variant="contained" onClick={downloadInvoice} sx={{ mt: 2 }}>
        Download Invoice
      </Button>
    </Box>
  );
}
