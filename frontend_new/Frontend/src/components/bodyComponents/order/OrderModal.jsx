import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import React, { useState, useEffect } from "react";
import { DeleteOutline } from "@mui/icons-material";
import html2pdf from "html2pdf.js";  // Import html2pdf

export default function OrderModal({ order }) {
  const [products, setProducts] = useState(order.products);
  const [availableProducts, setAvailableProducts] = useState([]); // State for dynamic products
  const [loading, setLoading] = useState(true); // Loading state for fetching products
  const [error, setError] = useState(null); // Error state for fetching products

  // Fetch available products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`); 
        const data = await response.json();
        setAvailableProducts(data); // Assuming the API returns an array of products
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError('Failed to load products');
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
      const selectedProduct = availableProducts.find(p => p.name === value);
      updatedProducts[index].product.id = selectedProduct ? selectedProduct.id : "";
      updatedProducts[index].product.amount = selectedProduct ? selectedProduct.amount : 0;
    } else if (field === "quantity") {
      updatedProducts[index].quantity = value;
    } else if (field === "amount") {
      updatedProducts[index].product.amount = value;
    }
    setProducts(updatedProducts);
  };

  // Function to download the invoice as a PDF
  const downloadInvoice = () => {
    const element = document.getElementById("invoice"); // Get the invoice content
    html2pdf()
      .from(element) // Create PDF from the content
      .save(`Order_${order.id}_Invoice.pdf`); // Save the file
  };

  const calculateTotalAmount = () => {
    return products.reduce((total, product) => total + (product.product.amount * product.quantity), 0);
  };

  if (loading) {
    return <Typography>Loading products...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box
      sx={{
        position: 'fixed', // Fixed positioning on the screen
        top: '50%', // Center vertically
        left: '50%', // Center horizontally
        transform: 'translate(-50%, -50%)', // Adjust for exact centering
        width: '80vw', // Modal width (can adjust as necessary)
        maxWidth: '800px', // Maximum width of the modal
        height: '80vh', // Modal height (can adjust as necessary)
        maxHeight: '90vh', // Maximum height (to ensure the modal does not grow too large)
        bgcolor: 'white',
        borderRadius: 2,
        overflow: 'auto', // Makes content scrollable if it overflows
        padding: 4,
        zIndex: 1300, // Make sure the modal is on top of other elements
      }}
    >
      <Typography variant="h6">Order List</Typography>
      <TableContainer sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Stock Availability</TableCell>
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
                      {/* Loop through available products and display as options */}
                      {availableProducts.map((availableProduct) => (
                        <MenuItem key={availableProduct.id} value={availableProduct.name}>
                          {availableProduct.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                    placeholder="Quantity"
                  />
                </TableCell>
                <TableCell>{product.product.stock}</TableCell>
                <TableCell>
                  <input
                    type="number"
                    value={product.product.amount}
                    onChange={(e) => handleProductChange(index, "amount", e.target.value)}
                    placeholder="Amount"
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
      <Button variant="contained" onClick={handleAddProduct} sx={{ marginTop: 2 }}>
        Add Product
      </Button>

      {/* Section for Invoice */}
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h6">Invoice</Typography>
        <Box id="invoice" sx={{ padding: 2, marginTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item>
              <Typography variant="subtitle1"><strong>Order ID:</strong> {order.id}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1"><strong>Customer:</strong> {order.customer.firstName} {order.customer.lastName}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1"><strong>Mobile:</strong> {order.customer.mobile}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1"><strong>Total Products:</strong> {products.length}</Typography>
            </Grid>
          </Grid>

          <TableContainer sx={{ marginTop: 2 }}>
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
                    <TableCell>{product.product.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="subtitle1" sx={{ marginTop: 2 }}><strong>Total Amount: ₹{calculateTotalAmount()}</strong></Typography>
        </Box>
        <Button variant="contained" onClick={downloadInvoice} sx={{ marginTop: 2 }}>
          Download Invoice
        </Button>
      </Box>
    </Box>
  );
}
