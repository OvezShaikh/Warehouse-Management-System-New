import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Product from './Product';
import axios from 'axios';

export default function Products() {
  const [productList, setProductList] = useState([]); // State to store product list
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    description: '',
    minStockLevel: 10,
    maxStockLevel: 100,
    totalStock: 0,
    amount: 0,
  }); // New product form data
  const [error, setError] = useState(null); //  Error message state
  const [success, setSuccess] = useState(false); // Success message state
  const [openModal, setOpenModal] = useState(false); // Modal open/close state
  const [selectedProducts, setSelectedProducts] = useState([]); // Array to store selected products for deletion

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProductList(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  // Add new product
  const addProduct = async () => {
    try {
      const { name, sku, description, minStockLevel, maxStockLevel, totalStock, amount } = newProduct;

      if (!name || !sku || !description || !minStockLevel || !maxStockLevel || !totalStock || amount === '') {
        setError('All fields are required');
        return;
      }

      // API call to add product
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, {
        name,
        sku,
        description,
        minStockLevel,
        maxStockLevel,
        totalStock,
        amount,
      });

      // Update product list with new product
      setProductList([...productList, response.data]);
      setNewProduct({
        name: '',
        sku: '',
        description: '',
        minStockLevel: '',
        maxStockLevel: '',
        totalStock: 0,
        amount: 0,
      });
      setOpenModal(false);
      setSuccess('Product added successfully!');
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product');
    }
  };

  // Function to delete selected products
  const deleteSelectedProducts = async () => {
    try {
      if (selectedProducts.length === 0) {
        setError('No products selected for deletion.');
        return;
      }

      // Debug: Log selected product IDs
      console.log('Selected Product IDs:', selectedProducts);

      // API call to delete the selected products from the backend
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/products`, {
        data: { ids: selectedProducts }, // Sending the array of product IDs
      });

      // Debug: Log the response
      console.log('Delete Response:', response);

      // Update the product list by removing the deleted products from the frontend
      setProductList((prevList) =>
        prevList.filter((product) => !selectedProducts.includes(product._id))
      );

      setSelectedProducts([]); // Clear the selected products after deletion
      setSuccess(`${selectedProducts.length} product(s) deleted successfully`);
    } catch (err) {
      console.error('Error deleting selected products:', err);
      setError('Failed to delete selected products');
    }
  };


  // Columns for the DataGrid
  const columns = [
    {
      field: 'checkbox',
      headerName: 'Select',
      width: 90,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={selectedProducts.includes(params.row._id)}
          onChange={(e) => handleCheckboxChange(e, params.row._id)}
        />
      ),
    },
    {
      field: 'id',
      headerName: 'ID',
      width: 90,
      valueGetter: (params) => params.row._id, // Ensure this is your unique identifier
    },
    {
      field: 'product',
      headerName: 'Product',
      width: 400,
      renderCell: (cellData) => <Product productName={cellData.row.name} />,
    },
    {
      field: 'sku',
      headerName: 'SKU',
      width: 200,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
    },
    {
      field: 'minStockLevel',
      headerName: 'Min Stock',
      width: 150,
    },
    {
      field: 'maxStockLevel',
      headerName: 'Max Stock',
      width: 150,
    },
    {
      field: 'totalStock',
      headerName: 'Total Stock',
      width: 150,
      valueGetter: (params) => params.row.totalStock + ' pcs',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 150,
      valueGetter: (params) => `$${params.row.amount}`,  // Display amount in a formatted way
    },
  ];

  // Function to handle checkbox change
  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      // Add product ID to selected list
      setSelectedProducts([...selectedProducts, id]);
    } else {
      // Remove product ID from selected list
      setSelectedProducts(selectedProducts.filter((productId) => productId !== id));
    }
  };

  // Load products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box>
      {/* Add INVENTORY Text and Button to open modal side by side */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">INVENTORY</Typography>
        <Box>
          <Button variant="contained" color="primary" onClick={() => setOpenModal(true)} sx={{ mr: 2 }}>
            Add New Product
          </Button>
          {/* Add a button to delete selected products */}
          <Button
            variant="contained"
            color="secondary"
            onClick={deleteSelectedProducts}
            disabled={selectedProducts.length === 0}
          >
            Delete Selected Products
          </Button>
        </Box>
      </Box>

      {/* DataGrid for displaying products */}
      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
        rows={productList}
        columns={columns}
        pageSize={10}
        getRowId={(row) => row._id} // Use the correct unique identifier for rows
      />

      {/* Success and Error Snackbars */}
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}

      {success && (
        <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
          <Alert severity="success">{success}</Alert>
        </Snackbar>
      )}

      {/* Modal for adding new product */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="SKU"
            value={newProduct.sku}
            onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Min Stock Level"
            type="number"
            value={newProduct.minStockLevel}
            onChange={(e) => setNewProduct({ ...newProduct, minStockLevel: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Max Stock Level"
            type="number"
            value={newProduct.maxStockLevel}
            onChange={(e) => setNewProduct({ ...newProduct, maxStockLevel: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Total Stock"
            type="number"
            value={newProduct.totalStock}
            onChange={(e) => setNewProduct({ ...newProduct, totalStock: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Amount"
            type="number"
            value={newProduct.amount}
            onChange={(e) => setNewProduct({ ...newProduct, amount: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={addProduct} color="primary">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
