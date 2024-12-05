import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import axios from "axios";

export default function TotalSales() {
  const [chartData, setChartData] = useState({
    series: [],
    categories: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn`);
        const grnData = response.data.grns; // Extract 'grns' array

        // Group GRN data by receiving date
        const groupedData = grnData.reduce((acc, grn) => {
          const date = new Date(grn.receivingDate).toLocaleDateString();
          acc[date] = acc[date] || [];
          acc[date].push(...grn.items);
          return acc;
        }, {});

        // Get the current week's data
        const currentWeekDates = Object.keys(groupedData);
        const currentWeekData = currentWeekDates.map((date) =>
          groupedData[date].reduce((sum, item) => sum + item.quantity, 0)
        );

        // Calculate previous week dates (assuming 7 days back from each current week date)
        const previousWeekDates = currentWeekDates.map((date) =>
          new Date(new Date(date).getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
        );

        // Map previous week dates to data
        const previousWeekData = previousWeekDates.map((date) =>
          groupedData[date]
            ? groupedData[date].reduce((sum, item) => sum + item.quantity, 0)
            : null // Mark missing data as null
        );

        // Prepare series data
        const series = [
          { name: "Current Week", data: currentWeekData },
        ];

        if (previousWeekData.some((data) => data !== null)) {
          series.push({
            name: "Previous Week",
            data: previousWeekData.map((data) => (data !== null ? data : 0)), // Replace null with 0 for chart
          });
        }

        setChartData({ categories: currentWeekDates, series });
      } catch (error) {
        console.error("Error fetching GRN data:", error);
      }
    };

    fetchData();
  }, []);

  // Chart configuration
  const options = {
    title: {
      text: "Total Sales",
      align: "left",
      style: {
        fontSize: "16px",
        color: "#666",
      },
    },
    subtitle: {
      text: "Sales over time",
      align: "left",
      style: {
        fontSize: "16px",
        color: "#666",
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#008FFB", "#FF4560"], // Colors for current and previous week lines
    legend: {
      position: "top",
      horizontalAlign: "center",
      fontSize: "14px",
      fontFamily: "Helvetica, Arial",
      offsetY: -20,
    },
    markers: {
      size: 4,
      strokeWidth: 2,
      hover: {
        size: 9,
      },
    },
    theme: {
      mode: "light",
    },
    chart: {
      height: 328,
      type: "line",
      zoom: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 2,
        blur: 4,
        opacity: 0.2,
      },
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Receiving Dates",
      },
    },
    noData: {
      text: "No data Available...",
    },
  };

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
      <ApexCharts
        options={options}
        series={chartData.series}
        height={300}
        type="line"
        width="100%"
      />
    </Box>
  );
}
