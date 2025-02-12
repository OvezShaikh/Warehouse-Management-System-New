import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Box, Typography } from "@mui/material";

export default function Channels({ grnData }) {
  const [channelData, setChannelData] = useState([]);

  useEffect(() => {
    if (grnData && grnData.length > 0) {
      const processedData = {};
      grnData.forEach((grn) => {
        const supplier = grn.supplier || "Unknown Supplier";

        if (!processedData[supplier]) {
          processedData[supplier] = Array(7).fill(0); // Initialize with zeros for 7 days
        }

        grn.items.forEach((item) => {
          // Assuming receivingDate is used to group data by the day of the week
          const dayIndex = new Date(item.receivingDate).getDay(); // 0 = Sunday, 6 = Saturday
          processedData[supplier][dayIndex] += item.quantity;
        });
      });

      // Transform processed data into chart format
      const transformedData = Object.keys(processedData).map((supplier) => ({
        name: supplier,
        data: processedData[supplier],
      }));

      setChannelData(transformedData);
    } else {
      setChannelData([]); // Clear data if grnData is empty
    }
  }, [grnData]); // Re-run when grnData changes

  const options3 = {
    chart: {
      id: "basic-bar",
      type: "bar",
      stacked: true,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "right",
      horizontalAlign: "center",
      offsetY: 0,
    },
    title: {
      text: "Quantity by Supplier (Grouped by Day of the Week)",
    },
    plotOptions: {
      bar: {
        columnWidth: "10%",
        horizontal: false,
      },
    },
    fill: {
      opacity: 1,
    },
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // Days of the week
    },
  };

  return (
    <Box
      sx={{
        margin: 3,
        bgcolor: "white",
        borderRadius: 2,
        padding: 3,
        height: "95%",
      }}
    >
      {channelData.length > 0 ? (
        <ApexCharts
          options={options3}
          series={channelData}
          type="bar"
          width="100%"
          height="320"
        />
      ) : (
        <Typography
          variant="h6"
          sx={{ textAlign: "center", color: "gray", marginTop: "100px" }}
        >
          No Data Available
        </Typography>
      )}
    </Box>
  );
}
