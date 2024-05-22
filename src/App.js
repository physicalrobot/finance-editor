import React, { useState } from 'react';
import FileUpload from './FileUpload';
import FinancialEditor from './FinancialEditor';
import PDFViewer from './PDFViewer';  // Import the PDFViewer component
import FinancialDataViewer from './FinancialDataViewer.js'
import './main/resources/static/css/style.css'

function App() {
  const [taxId, setTaxId] = useState(1234567890);  // Initialized as empty
  const [year, setYear] = useState(2023);    // Initialized as empty
  const [pdfUrl, setPdfUrl] = useState('');  // State to hold the URL of the PDF

  const BASE_URL = 'https://apim-test.arkra.com';

  const handleFileUploadSuccess = (data) => {
    if (data && data.taxId && data.year) { // Check if data contains taxId and year
      // setTaxId(data.taxId);
      // setYear(data.year);
      console.log(`File uploaded for Tax ID: ${data.taxId} and Year: ${data.year}`);
      // Assume the PDF path is returned or can be constructed
      setPdfUrl(`/api/v1/accounting/${data.taxId}/${data.year}/financials/document.pdf`);
    } else {
      console.error('Invalid data received from upload:', data);
    }
  };

  const saveData = (updatedData) => {
    fetch(`${BASE_URL}/api/v1/accounting/${taxId}/${year}/financials`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Version': '1.0' 
      },
      body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Data updated:', data);
      // Update the PDF URL if needed, or handle other updates
      setPdfUrl(`/api/v1/accounting/${taxId}/${year}/financials/document.pdf`);
    })
    .catch(error => console.error('Error updating data:', error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="pagetitle">Financial Statement Editor</h1>
      </header>
      <FileUpload  taxId={taxId} year={year} onFileUploadSuccess={handleFileUploadSuccess} />
      {taxId && year && (
        <>
          <PDFViewer pdfUrl={pdfUrl} />
          <FinancialEditor taxId={taxId} year={year} onSave={saveData} />
        </>
      )}
    <FinancialDataViewer taxId = {taxId} year = {year} />
    </div>
  );
}

export default App;

