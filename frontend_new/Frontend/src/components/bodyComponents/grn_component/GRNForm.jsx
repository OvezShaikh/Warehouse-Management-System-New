import React, { useState, useEffect } from 'react';

function GRNForm() {
  const [grnData, setGrnData] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Initial loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/grn');
        const data = await response.json();
        setGrnData(data.grn);
        setIsLoading(false); // Set loading state to false after successful fetch
      } catch (error) {
        console.error('Error fetching GRN data:', error);
        setIsLoading(false); // Set loading state to false on error
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (event) => {
    setGrnData({ ...grnData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here (e.g., send data to server)
    console.log('Submitted data:', grnData);
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading GRN data...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Goods Receipt Note</h2>
          <div>
            <label htmlFor="poNumber">PO Number:</label>
            <input
              type="text"
              id="poNumber"
              name="poNumber"
              value={grnData.poNumber || ''}
              onChange={handleInputChange}
              disabled={!grnData.poNumber} // Disable if no data fetched
            />
          </div>
          {/* ... other input fields for receivingNo, receivingDate, supplier, etc. ... */}

          <h2>Items</h2>
          {grnData.items && (
            <table>
              <thead>
                <tr>
                  <th>Item No.</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Serial No.</th>
                  <th>Invoice No.</th>
                  <th>Location</th>
                  <th>Receiving Date</th>
                </tr>
              </thead>
              <tbody>
                {grnData.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.itemNo}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{item.serialNumber}</td>
                    <td>{item.invoiceNo}</td>
                    <td>{item.location}</td>
                    <td>{new Date(item.receivingDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default GRNForm;