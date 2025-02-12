import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import ApexCharts from "react-apexcharts";
import axios from "axios";

const SalesGrowthCharts = () => {
  const [chartData, setChartData] = useState({
    series: [{ name: "Quantity", type: "column", data: [] }],
    categories: [],
  });

  useEffect(() => {
    const fetchGRNData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn`);
        const grns = response.data.grns;

        // Initialize an array to hold the total quantities per month
        const monthlyQuantities = Array(12).fill(0);

        // Populate the monthly quantities based on the receivingDate of the items
        grns.forEach((grn) => {
          grn.items.forEach((item) => {
            const month = new Date(item.receivingDate).getMonth(); // Get month (0-based index)
            monthlyQuantities[month] += item.quantity;
          });
        });

        // Update the chart data with the calculated quantities
        setChartData({
          series: [{ name: "Quantity", type: "column", data: monthlyQuantities }],
          categories: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
          ],
        });
      } catch (error) {
        console.error("Error fetching GRN data:", error);
      }
    };

    fetchGRNData();
  }, []);

  const options = {
    chart: {
      id: "sales-growth",
      type: "bar",
      stacked: true,
    },
    dataLabels: {
      enabled: true,
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        horizontal: false,
      },
    },
    fill: {
      opacity: 1,
    },
    xaxis: {
      categories: chartData.categories,
    },
    tooltip: {
      fixed: {
        enabled: true,
        position: "topLeft",
        offsetY: 30,
        offsetX: 60,
      },
    },
  };

  return (
    <Box
      sx={{
        marginX: 4,
        borderRadius: 2,
        padding: 3,
        height: "100%",
      }}
    >
      <ApexCharts
        options={options}
        series={chartData.series}
        height={300}
        type="bar"
        width="100%"
      />
    </Box>
  );
};

export default SalesGrowthCharts;
