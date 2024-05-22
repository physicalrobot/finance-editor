import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function FileUpload({ taxId, year, onFileUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const BASE_URL = 'https://apim-test.arkra.com';

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    console.log('File selected:', file);
    setSelectedFile(file);
    const reader = new FileReader();

    reader.onabort = () => console.log('File reading was aborted');
    reader.onerror = () => console.log('File reading has failed');
    reader.onload = () => {
      const binaryStr = reader.result;
      setPreviewUrl(binaryStr);
    };
    reader.readAsDataURL(file); // Converts the file to a data URL and triggers `onload`
  }, []);


const onUploadClick = () => {
  if (!selectedFile) {
    console.error('No file selected for upload.');
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile);

  fetch(`${BASE_URL}/api/v1/accounting/${taxId}/${year}/financials`, {
    method: 'POST',
    body: formData,
  })
  .then(response => {
    console.log(`Status: ${response.status}`); // Log the response status
    console.log(`Headers: ${response.headers.get('Content-Type')}`); // Log the content type

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return response.text(); // Get the response as text regardless of its type
  })
  .then(text => {
    console.log('Received text:', text); // Log the raw text of the response

    let data = {}; // Initialize as empty object to handle cases where no JSON data is returned
    try {
      if (text) {
        data = JSON.parse(text); // Parse only if there's content
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }

    console.log('Upload response data:', data); // Log the parsed data or empty object
    onFileUploadSuccess(data); // Pass data to the success handler, even if it's empty
  })
  .catch(error => {
    console.error('Error uploading file:', error);
  });
};
    

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true // Disable opening the file dialog on click
  });

  return (
    <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click below to select files</p>
      <button type="button" onClick={() => document.querySelector('input[type="file"]').click()}>
        Select File
      </button>
      {selectedFile && (
        <div>
          <p>Selected File: {selectedFile.name}</p>
          <button onClick={onUploadClick}>Upload File</button>
        </div>
      )}
      {previewUrl && (
        <div>
          <p>Preview:</p>
          <embed src={previewUrl} type="application/pdf" width="500" height="600" />
        </div>
      )}
    </div>
  );
}

export default FileUpload;

