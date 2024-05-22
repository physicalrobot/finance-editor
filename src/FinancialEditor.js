import React, { useState, useEffect } from 'react';

function FinancialEditor({ taxId, year }) {
  const [financialData, setFinancialData] = useState(null);


  useEffect(() => {
    fetch(`/api/v1/accounting/${taxId}/${year}/financials`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => setFinancialData(data))
      .catch(error => console.error('Error fetching financial data:', error));
  }, [taxId, year]);

  const updateFinancialData = (key, value) => {
    setFinancialData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleInputChange = (key, event) => {
    updateFinancialData(key, event.target.value);
  };

  if (!financialData) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Financial Statements</h1>
      <form onSubmit={e => {
        e.preventDefault();
        saveFinancialData();
      }}>
        {financialData && Object.entries(financialData).map(([key, value]) => (
          <div key={key}>
            <label>{key}: </label>
            <input type="text" value={value} onChange={(e) => handleInputChange(key, e)} />
          </div>
        ))}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default FinancialEditor;

function saveFinancialData(taxId, year, financialData) {
  const BASE_URL = 'https://apim-test.arkra.com';

  // Assuming taxId, year, and financialData are available here through closure or passed as arguments
  fetch(`${BASE_URL}/api/v1/accounting/${taxId}/${year}/financials`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(financialData)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to update financial data');
  })
  .then(data => console.log('Successfully updated financial data', data))
  .catch(error => console.error('Error updating financial data:', error));
}

