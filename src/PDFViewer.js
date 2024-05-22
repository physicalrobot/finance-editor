import React, { useEffect, useRef } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFViewer({ pdfUrl }) {
  const numPages = useRef(null);
  const pageNumber = 1; // You can make this dynamic to allow users to navigate pages

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    numPages.current = nextNumPages;
  }

  return (
    <div>
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        options={{ workerSrc: "/pdf.worker.min.js" }}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>Page {pageNumber} of {numPages.current}</p>
    </div>
  );
}

export default PDFViewer;
