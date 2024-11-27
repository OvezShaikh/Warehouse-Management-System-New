import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";

export default function Overview({ grnData }) {
  const totalProducts = grnData.reduce((sum, grn) => sum + grn.items.length, 0);
  const totalQuantity = grnData.reduce(
    (sum, grn) => sum + grn.items.reduce((s, item) => s + item.quantity, 0),
    0
  );
  const pendingItems = grnData.reduce(
    (sum, grn) => sum + grn.items.filter((item) => item.status === "Pending").length,
    0
  );
  const totalGrns = grnData.length;

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Overview</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Total Items</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  {totalProducts !== undefined ? totalProducts : "Calculating..."}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Quantity</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  {totalQuantity !== undefined ? totalQuantity : "Calculating..."}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Pending Items</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  {pendingItems !== undefined ? pendingItems : "Calculating..."}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total GRNs</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  {totalGrns !== undefined ? totalGrns : "Calculating..."}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
