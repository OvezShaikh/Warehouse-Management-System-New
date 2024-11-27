import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Box, useMediaQuery } from "@mui/material";

export default function ProductsGrowthCharts({ grnData }) {
  const [channelData, setChannelData] = useState([]);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    if (grnData && grnData.grns && Array.isArray(grnData.grns)) {
      // Initialize data for each day of the week
      const currentWeekData = Array(7).fill(0); // [Mon, Tue, ..., Sun]
      const previousWeekData = Array(7).fill(0);

      const today = new Date();
      const currentWeekStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay()
      );
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

      const previousWeekStart = new Date(currentWeekStart);
      previousWeekStart.setDate(currentWeekStart.getDate() - 7);
      const previousWeekEnd = new Date(previousWeekStart);
      previousWeekEnd.setDate(previousWeekStart.getDate() + 6);

      // Process the GRN data
      grnData.grns.forEach((grn) => {
        grn.items.forEach((item) => {
          const itemDate = new Date(item.receivingDate);
          const dayIndex = itemDate.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat

          if (itemDate >= currentWeekStart && itemDate <= currentWeekEnd) {
            currentWeekData[dayIndex] += item.quantity;
          } else if (itemDate >= previousWeekStart && itemDate <= previousWeekEnd) {
            previousWeekData[dayIndex] += item.quantity;
          }
        });
      });

      // Update the chart data
      setChannelData([
        {
          name: "Current Week",
          data: currentWeekData.slice(1).concat(currentWeekData[0]), // Start from Monday
        },
        {
          name: "Previous Week",
          data: previousWeekData.slice(1).concat(previousWeekData[0]), // Start from Monday
        },
      ]);
    }
  }, [grnData]);

  const options3 = {
    colors: ["#BF181D", "#FFBF00"],
    chart: {
      id: "basic-bar",
      type: "bar",
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: isSmallScreen ? "bottom" : "top",
      horizontalAlign: "left",
      offsetY: 0,
    },
    stroke: {
      width: 3,
      curve: "smooth",
    },
    markers: {
      size: 5,
      strokeWidth: 0,
      hover: {
        size: 7,
      },
    },
    fill: {
      opacity: 1,
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // Days of the week
    },
    tooltip: {
      fixed: {
        enabled: true,
        position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
        offsetY: 30,
        offsetX: 60,
      },
    },
  };

  return (
    <Box
      sx={{
        margin: 4,
        borderRadius: 2,
        padding: 3,
        height: "95%",
      }}
    >
      <ApexCharts
        options={options3}
        series={channelData}
        type="line"
        width="100%"
        height="320"
      />
    </Box>
  );
}
