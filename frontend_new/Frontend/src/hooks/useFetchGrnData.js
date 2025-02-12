import { useState, useEffect } from "react";

const useFetchGrnData = (token) => {
  const [grnData, setGrnData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchGrnData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/grn`);
        if (!response.ok) throw new Error("Failed to fetch GRN data");

        const result = await response.json();
        setGrnData(result.grns);
      } catch (err) {
        console.error("Error fetching GRN data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGrnData();
  }, [token]);

  return { grnData, setGrnData, loading, error };
};

export default useFetchGrnData;
