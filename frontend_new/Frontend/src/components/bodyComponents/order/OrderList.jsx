import React, { Component } from "react";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import OrderModal from "./OrderModal";
import orders from "./listOrders";

export default class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: {},
      open: false,
      orders: orders,  // Storing the orders in state
    };
  }

  // To handle adding new orders (this is just a simulation for now)
  handleAddOrder = () => {
    const newOrder = {
      id: this.state.orders.length + 1,
      customer: {
        firstName: "New",
        lastName: "Customer",
        mobile: "123456789",
      },
      products: [
        {
          product: { name: "Product 1", stock: 10 },
          quantity: 2,
        },
        {
          product: { name: "Product 2", stock: 5 },
          quantity: 1,
        },
      ],
      totalAmount: 300,
    };

    this.setState((prevState) => ({
      orders: [...prevState.orders, newOrder],
    }));
  };

  handleDeleteOrder = (id) => {
    this.setState({
      orders: this.state.orders.filter((order) => order.id !== id),
    });
  };

  handlOrderDetail = (order) => {
    this.setState({ order: order, open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const columns = [
      {
        field: "id",
        headerName: "ID",
        width: 60,
        description: "id of the product",
      },
      {
        field: "fullname",
        headerName: "Full Name",
        width: 300,
        description: "customer full name",
        renderCell: (params) => {
          return (
            <>
              <Avatar alt="name" sx={{ width: 30, height: 30 }} />
              <Typography variant="subtitle2" sx={{ mx: 3 }}>
                {`${params.row.customer.firstName || ""} ${
                  params.row.customer.lastName || ""
                } `}
              </Typography>
            </>
          );
        },
      },
      {
        field: "mobile",
        headerName: "Mobile",
        width: 300,
        description: "customer phone number ",
        valueGetter: (params) => params.row.customer.mobile,
      },
      {
        field: "total",
        headerName: "Total Amount",
        width: 200,
        description: "total amount of the order",
        valueGetter: (params) => params.row.totalAmount,
      },
      {
        field: "details",
        headerName: "Order Details",
        width: 200,
        description: "the details of the order",
        renderCell: (params) => {
          const order = params.row;
          return (
            <Button
              variant="contained"
              sx={{ bgcolor: "#504099" }}
              onClick={() => this.handlOrderDetail(order)}
            >
              Order Details
            </Button>
          );
        },
      },
      {
        field: "delete",
        headerName: "Delete",
        width: 100,
        renderCell: (params) => {
          return (
            <Button
              variant="contained"
              color="error"
              onClick={() => this.handleDeleteOrder(params.row.id)}
            >
              Delete
            </Button>
          );
        },
      },
    ];

    return (
      <Box
        sx={{
          margin: 3,
          bgcolor: "white",
          borderRadius: 2,
          padding: 3,
          height: "100%",
        }}
      >
        <Button variant="contained" color="primary" onClick={this.handleAddOrder}>
          Add Order
        </Button>
        <DataGrid
          sx={{
            borderLeft: 0,
            borderRight: 0,
            borderRadius: 0,
          }}
          rows={this.state.orders}
          columns={columns}
          pageSizeOptions={[15, 20, 30]}
          rowSelection={false}
        />
        <Modal open={this.state.open} onClose={this.handleClose}>
          <Box>
            <OrderModal order={this.state.order} />
          </Box>
        </Modal>
      </Box>
    );
  }
}
