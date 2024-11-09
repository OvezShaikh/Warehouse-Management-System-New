import React, { useState, useEffect } from "react";
import GRNComponent from "./components/bodyComponents/grn_component/GRNPage";
import QualityCheckComponent from "./components/bodyComponents/Qualitycomponent/QualityCheckComponent";
import axios from "axios";

const ParentComponent = () => {
  const [grnData, setGrnData] = useState([]); // State for GRN data

  useEffect(() => {
    const fetchGrns = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn`);
        console.log("This is grn data in parent component",grnData);
        if (Array.isArray(response.data.grns)) {
          setGrnData(response.data.grns);
        } else {
          console.error("Unexpected data format", response.data);
        }
      } catch (error) {
        console.error("Error fetching GRNs:", error);
      }
    };

    fetchGrns();
  }, []);

  return (
    <div>
      <GRNComponent grnData={grnData} setGrnData={setGrnData} />
      <QualityCheckComponent grnData={grnData} setGrnData={setGrnData} />
    </div>
  );
};

export default ParentComponent;
