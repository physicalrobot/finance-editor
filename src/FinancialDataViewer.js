import React, { useState } from 'react';

function FinancialDataViewer({ taxId, year }) {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = 'https://apim-test.arkra.com';

  // Function to fetch financial data
const fetchFinancialData = () => {
  if (!taxId || !year) {
    setError('Tax ID or Year is missing');
    return;
  }
  setLoading(true);
  setError(null);
  fetch(`${BASE_URL}/api/v1/accounting/${taxId}/${year}/financials`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', // It's good practice to define the expected content type
      'X-Version': '1.0' 
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch data'); // Throw error if response not OK
      }
      return response.json();
    })
    .then(data => {
      setFinancialData(data); // Set fetched data to state
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching financial data:', error);
      setError('Failed to load data');
      setLoading(false);
    });
};


  return (
    <div>
      <button onClick={fetchFinancialData} disabled={loading}>
        {loading ? 'Loading...' : 'Load Financial Data'}
      </button>
      {error && <p>{error}</p>}
      {financialData && (
        <div>
          <h2>Financial Data</h2>
          <pre>{JSON.stringify(financialData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default FinancialDataViewer;
