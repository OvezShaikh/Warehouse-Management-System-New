import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";

export default function TopSellingProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/grn");
        const grns = response.data.grns;

        // Flattening the 'items' array to extract product details and sorting by quantity
        const formattedProducts = grns
          .flatMap((grn) =>
            grn.items.map((item) => ({
              name: item.description,
              quantity: item.quantity,
              supplier: item.supplier,
            }))
          )
          .sort((a, b) => b.quantity - a.quantity); // Sorting by quantity in descending order

        // Limiting to the top 10 products
        const top5Products = formattedProducts.slice(0, 5);

        setProducts(top5Products);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ margin: 3, bgcolor: "white", borderRadius: 2, padding: 3 }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ margin: 3, bgcolor: "white", borderRadius: 2, padding: 3 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        margin: 3,
        bgcolor: "white",
        borderRadius: 2,
        padding: 3,
        height: "95%",
        overflow: "auto",
      }}
    >
      <Typography variant="h6" fontWeight={"bold"} sx={{ mx: 3 }}>
        Top Stored Items
      </Typography>
      {products.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bolder" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bolder" }}>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, id) => (
                <TableRow key={id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          variant="h6"
          sx={{ textAlign: "center", color: "gray", marginTop: "50px" }}
        >
          No Data Available
        </Typography>
      )}
    </Box>
  );
}
