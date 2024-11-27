import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Box } from "@mui/material";
import axios from "axios";

export default function VisitorsGrowthCharts({ recordVisitor }) {
  const [visitorData, setVisitorData] = useState([]);
  const [loading, setLoading] = useState(true);

  const hasRecordedVisitor = sessionStorage.getItem('hasRecordedVisitor'); // Store flag in session storage


  // Fetch active and bounce visitor data
  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const activeResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/visitors/active`);
        const bounceResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/visitors/bounce`);

        setVisitorData([
          {
            name: "Active Visitors",
            type: "column",
            data: [activeResponse.data.activeVisitors],
          },
          {
            name: "Bounce Visitors",
            type: "column",
            data: [bounceResponse.data.bounceVisitors],
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching visitor data:", error);
        setLoading(false);
      }
    };

    fetchVisitorData();

    // Record the visitor as "active" when the component is mounted
    if (!hasRecordedVisitor) {
      recordVisitor("active");
      sessionStorage.setItem('hasRecordedVisitor', 'true'); // Set flag to prevent re-recording
    }

    // Record the visitor as "bounce" when they leave the page
    const handleBeforeUnload = () => {
      if (!hasRecordedVisitor) {
        recordVisitor("bounce");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [recordVisitor, hasRecordedVisitor]);

  const options3 = {
    colors: ["#A020F0", "#FA6800"],
    chart: {
      id: "basic-bar",
      type: "bar",
      stacked: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetY: 0,
    },
    plotOptions: {
      bar: {
        columnWidth: "20%",
      },
    },
    xaxis: {
      categories: ["Visitors Growth"],
    },
  };

  return (
    <Box sx={{ margin: 3, height: "350px" }}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ApexCharts
          options={options3}
          series={visitorData}
          type="bar"
          height="350"
        />
      )}
    </Box>
  );
}
