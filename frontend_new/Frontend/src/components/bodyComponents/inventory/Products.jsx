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
import { QrReader } from 'react-qr-reader';
import axios from 'axios';
import Product from './Product';

export default function Products() {
  const [productList, setProductList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [newLocation, setNewLocation] = useState({
    locationCode: '',
    capacity: 0,
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    description: '',
    minStockLevel: 10,
    maxStockLevel: 100,
    totalStock: 0,
    amount: 0,
    location: '',
  });
  const [skuCount, setSkuCount] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openScanner, setOpenScanner] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
      valueGetter: (params) => params.row._id,
    },
    {
      field: 'product',
      headerName: 'Item',
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
      valueGetter: (params) => `${params.row.totalStock} pcs`,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 150,
      valueGetter: (params) => `$${params.row.amount}`,
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 200,
      renderCell: (params) => (
        <TextField
          select
          value={params.row.location?._id || ''}  // Ensure to display the selected location ID
          onChange={(e) => handleLocationChange(e, params.row._id)} // Handle the change
          fullWidth
          SelectProps={{
            native: true,
          }}
        >
          <option value="">Select Location</option>
          {locationList.map((location) => (
            <option key={location._id} value={location._id}>
              {location.locationCode}
            </option>
          ))}
        </TextField>
      ),
    },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProductList(response.data);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/locations`);
      setLocationList(response.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Failed to fetch locations');
    }
  };

  const addLocation = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/locations`, newLocation);
      setLocationList([...locationList, response.data]);
      setNewLocation({ locationCode: '', capacity: 0 });
      setOpenLocationModal(false);
      setSuccess('Location added successfully!');
    } catch (err) {
      console.error('Error adding location:', err);
      setError('Failed to add location');
    }
  };

  const fetchSkuCount = async (sku) => {
    if (sku) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/count?sku=${sku}`);
        setSkuCount(response.data.count);
      } catch (err) {
        console.error('Error fetching SKU count:', err);
        setError('Failed to fetch SKU count');
      }
    } else {
      setSkuCount(0);
    }
  };

  const addProduct = async () => {
    try {
      const { name, sku, description, minStockLevel, maxStockLevel, totalStock, amount, location } = newProduct;

      if (!name || !sku || !description || !minStockLevel || !maxStockLevel || !totalStock || amount === '') {
        setError('All fields are required');
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, newProduct);
      setProductList([...productList, response.data]);
      setNewProduct({
        name: '',
        sku: '',
        description: '',
        minStockLevel: 10,
        maxStockLevel: 100,
        totalStock: 0,
        amount: 0,
        location: '',
      });
      setSkuCount(0);
      setOpenModal(false);
      setSuccess('Product added successfully!');
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product');
    }
  };

  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setSelectedProducts([...selectedProducts, id]);
    } else {
      setSelectedProducts(selectedProducts.filter((productId) => productId !== id));
    }
  };

  const deleteSelectedProducts = async () => {
    try {
      if (selectedProducts.length === 0) {
        setError('No products selected for deletion.');
        return;
      }

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products`, {
        data: { ids: selectedProducts },
      });

      setProductList((prevList) =>
        prevList.filter((product) => !selectedProducts.includes(product._id))
      );

      setSelectedProducts([]);
      setSkuCount(0);
      setSuccess(`${selectedProducts.length} product(s) deleted successfully`);
    } catch (err) {
      console.error('Error deleting selected products:', err);
      setError('Failed to delete selected products');
    }
  };

  const handleScan = (data) => {
    if (data) {
      try {
        const productData = JSON.parse(data);
        setNewProduct((prev) => ({
          ...prev,
          ...productData,
        }));
        setSuccess('QR code scanned successfully!');
      } catch (error) {
        setError('Invalid QR code format');
      }
    }
  };

  const handleError = (err) => {
    // console.error('QR scanner error:', err);
  };

  const handleLocationChange = async (e, productId) => {
    const updatedLocationId = e.target.value;
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/products/${productId}/location`, { location: updatedLocationId });
      setProductList((prevList) =>
        prevList.map((product) =>
          product._id === productId ? { ...product, location: locationList.find(loc => loc._id === updatedLocationId) } : product
        )
      );
      setSuccess('Location updated successfully!');
    } catch (err) {
      console.error('Error updating location:', err);
      setError('Failed to update location');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchLocations();
  }, []);

  console.log(locationList); // Check if the list has items

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'end', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => setOpenModal(true)} sx={{ mr: 2 }}>
          Add New Item
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={deleteSelectedProducts}
          disabled={selectedProducts.length === 0}
        >
          Delete Selected Items
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpenLocationModal(true)}
          sx={{ mr: 2 }}
        >
          Add New Location
        </Button>
      </Box>

      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
        rows={productList}
        columns={columns}
        pageSize={10}
        getRowId={(row) => row._id}
      />

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

      <Dialog open={openScanner} onClose={() => setOpenScanner(false)}>
        <DialogTitle>Scan QR Code</DialogTitle>
        <DialogContent>
          <QrReader
            onResult={(result, error) => {
              if (!!result) handleScan(result.text);
              if (!!error) handleError(error);
            }}
            style={{ width: '100%' }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Button variant="outlined" onClick={() => setOpenScanner(true)}>
            Scan QR Code
          </Button>
          <TextField label="Item Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} fullWidth sx={{ mb: 2 }} />
          <TextField
            label="SKU"
            value={newProduct.sku}
            onChange={(e) => {
              setNewProduct({ ...newProduct, sku: e.target.value });
              fetchSkuCount(e.target.value); // Fetch SKU count on change
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
          {skuCount > 0 && (
            <Typography color="error" variant="caption" sx={{ mb: 6 }}>
              {skuCount} product(s) already exist with this SKU.
            </Typography>
          )}
          <TextField label="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} fullWidth sx={{ mb: 2 }} />
          <TextField label="Min Stock Level" type="number" value={newProduct.minStockLevel} onChange={(e) => setNewProduct({ ...newProduct, minStockLevel: Number(e.target.value) })} fullWidth sx={{ mb: 2 }} />
          <TextField label="Max Stock Level" type="number" value={newProduct.maxStockLevel} onChange={(e) => setNewProduct({ ...newProduct, maxStockLevel: Number(e.target.value) })} fullWidth sx={{ mb: 2 }} />
          <TextField label="Total Stock" type="number" value={newProduct.totalStock} onChange={(e) => setNewProduct({ ...newProduct, totalStock: Number(e.target.value) })} fullWidth sx={{ mb: 2 }} />
          <TextField label="Amount" type="number" value={newProduct.amount} onChange={(e) => setNewProduct({ ...newProduct, amount: Number(e.target.value) })} fullWidth sx={{ mb: 2 }} />
          <select
            value={newProduct.location}
            onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
          >
            <option value="">Select Location</option>
            {locationList.map((location) => (
              <option key={location._id} value={location._id}>
                {location.locationCode}
              </option>
            ))}
          </select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">Cancel</Button>
          <Button onClick={addProduct} color="primary" disabled={!newProduct.name || !newProduct.sku || !newProduct.description}>
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openLocationModal} onClose={() => setOpenLocationModal(false)}>
        <DialogTitle>Add New Location</DialogTitle>
        <DialogContent>
          <TextField
            label="Location Code"
            value={newLocation.locationCode}
            onChange={(e) => setNewLocation({ ...newLocation, locationCode: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Capacity"
            type="number"
            value={newLocation.capacity}
            onChange={(e) => setNewLocation({ ...newLocation, capacity: Number(e.target.value) })}
            fullWidth
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLocationModal(false)} color="secondary">Cancel</Button>
          <Button onClick={addLocation} color="primary">
            Add Location
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
