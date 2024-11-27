import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Box, useMediaQuery } from "@mui/material";
import axios from 'axios';

export default function CustomersGrowthCharts() {
  const [userData, setUserData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming the token is stored in localStorage
          },
        });
        setUserData(response.data); // Set the received data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData.length > 0) {
      // Get the data for the previous and current week
      const currentWeekData = userData.find(item => item.name === "Current Week")?.data || 0;
      const previousWeekData = userData.find(item => item.name === "Previous Week")?.data || 0;

      // Set the chart data
      setChartData([
        {
          name: "Current Week",
          data: [previousWeekData, currentWeekData], // Plot previous data point first
          yaxis: 0, // Use first y-axis for current week data
        },
      ]);
    }
  }, [userData]);

  const options3 = {
    colors: ["#E32227"], // Red color for the line
    chart: {
      id: "multi-axis-chart",
      type: "line", // Line chart for better visibility of multiple series
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
      curve: "smooth", // Smooth line curve for transition
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
      categories: ["Previous Week", "Current Week"], // Ensure previous week is shown before current week
      title: {
        text: "Weeks", // X-axis represents the weeks
      },
    },
    yaxis: [
      {
        title: {
          text: "User Count", // Both weeks share the same Y-axis
        },
        labels: {
          show: true,
        },
      },
    ],
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
        margin: 4,
        borderRadius: 2,
        padding: 3,
        height: "95%",
      }}
    >
      <ApexCharts
        options={options3}
        series={chartData}
        type="line" // 'line' chart for multi-axis comparison
        width="100%"
        height="320"
      />
    </Box>
  );
}
