import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";

const PurchaseOrderComponent = () => {
  const [poNumber, setPoNumber] = useState("");
  const [supplier, setSupplier] = useState("UnoStar Value Chain Pvt Ltd"); // Assuming you're the supplier
  const [itemNo, setItemNo] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPO = {
      poNumber,
      supplier,
      itemNo,
      description,
      quantity,
      totalAmount: quantity * unitPrice, // Calculate total amount
    };

    try {
      const response = await fetch("https://your-backend-api.com/api/purchase-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPO),
      });

      if (!response.ok) {
        throw new Error("Failed to save Purchase Order");
      }

      // Optionally handle the response
      const result = await response.json();
      console.log("Purchase Order created:", result);

      // Reset form fields
      resetForm();
    } catch (error) {
      setError(error.message);
    }
  };

  const resetForm = () => {
    setPoNumber("");
    setSupplier("Your Company Name");
    setItemNo("");
    setDescription("");
    setQuantity(0);
    setUnitPrice(0);
    setError("");
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Create Purchase Order
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Paper sx={{ padding: 3, marginTop: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="P.O Number"
                variant="outlined"
                fullWidth
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Supplier"
                variant="outlined"
                fullWidth
                value={supplier}
                disabled // You are the supplier, so we disable this
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Item No."
                variant="outlined"
                fullWidth
                value={itemNo}
                onChange={(e) => setItemNo(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Quantity"
                variant="outlined"
                type="number"
                fullWidth
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Unit Price"
                variant="outlined"
                type="number"
                fullWidth
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                required
              />
            </Grid>
          </Grid>

          <Box sx={{ marginTop: 3 }}>
            <Button type="submit" variant="contained">
              Create Purchase Order
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default PurchaseOrderComponent;