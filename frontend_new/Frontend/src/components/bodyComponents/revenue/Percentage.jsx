import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React from "react";

export default function Percentage({ percentage, upOrDown, color }) {
  const roundedPercentage = percentage ? parseFloat(percentage).toFixed(2) : null;

  const percentageColor = color === "red" ? "error" : "success";
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {roundedPercentage !== null && (
        <>
          <Typography fontWeight={"bold"} variant="h6" color={color}>
            {roundedPercentage}%
          </Typography>
          {upOrDown === "up" ? (
            <ArrowDropUp color={percentageColor} />
          ) : (
            <ArrowDropDown color={percentageColor} />
          )}
        </>
      )}
    </Box>
  );
}
