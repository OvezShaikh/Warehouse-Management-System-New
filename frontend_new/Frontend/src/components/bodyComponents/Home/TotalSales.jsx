import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import axios from "axios";
import { startOfWeek, endOfWeek, subWeeks, parseISO, format, addDays } from "date-fns";

export default function TotalSales() {
  const [chartData, setChartData] = useState({
    series: [],
    categories: [],
  });

  const generateDateRange = (start, end) => {
    const dates = [];
    let current = start;
    while (current <= end) {
      dates.push(format(current, "yyyy-MM-dd"));
      current = addDays(current, 1);
    }
    return dates;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn`);
        const grnData = response.data.grns;

        const now = new Date();
        const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
        const currentWeekEnd = endOfWeek(now, { weekStartsOn: 1 });

        const previousWeekStart = subWeeks(currentWeekStart, 1);
        const previousWeekEnd = subWeeks(currentWeekEnd, 1);

        const allItems = grnData.flatMap((grn) =>
          grn.items.map((item) => ({
            ...item,
            receivingDate: item.receivingDate,
          }))
        );

        // Generate full date ranges for the current and previous weeks
        const currentWeekRange = generateDateRange(currentWeekStart, currentWeekEnd);
        const previousWeekRange = generateDateRange(previousWeekStart, previousWeekEnd);

        // Initialize data objects with 0 values for all dates
        const currentWeekData = currentWeekRange.reduce((acc, date) => {
          acc[date] = 0;
          return acc;
        }, {});

        const previousWeekData = previousWeekRange.reduce((acc, date) => {
          acc[date] = 0;
          return acc;
        }, {});

        // Sum quantities for the current week
        allItems.forEach((item) => {
          const itemDate = format(parseISO(item.receivingDate), "yyyy-MM-dd");
          if (itemDate in currentWeekData) {
            currentWeekData[itemDate] += item.quantity;
          }
          if (itemDate in previousWeekData) {
            previousWeekData[itemDate] += item.quantity;
          }
        });

        // Prepare categories and series
        const currentWeekSeriesData = currentWeekRange.map((date) => currentWeekData[date]);
        const previousWeekSeriesData = previousWeekRange.map((date) => previousWeekData[date]);

        const series = [
          { name: "Current Week", data: currentWeekSeriesData },
          { name: "Previous Week", data: previousWeekSeriesData },
        ];

        setChartData({ categories: currentWeekRange, series });
      } catch (error) {
        console.error("Error fetching GRN data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    title: {
      text: "Total Sales",
      align: "left",
      style: { fontSize: "16px", color: "#666" },
    },
    subtitle: {
      text: "Sales over time",
      align: "left",
      style: { fontSize: "16px", color: "#666" },
    },
    stroke: { curve: "smooth", width: 3 },
    colors: ["#008FFB", "#FF4560"],
    legend: {
      position: "top",
      horizontalAlign: "center",
      fontSize: "14px",
      offsetY: -20,
    },
    markers: {
      size: 4,
      strokeWidth: 2,
      hover: { size: 9 },
    },
    chart: {
      height: 328,
      type: "line",
      zoom: { enabled: true },
      dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 0.2 },
    },
    xaxis: {
      categories: chartData.categories,
      title: { text: "Receiving Dates" },
    },
    noData: { text: "No data Available..." },
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
