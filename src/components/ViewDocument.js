import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import './CSS//FullDocumentView.css'; // Import the CSS file for styling

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const FullDocumentView = () => {
  const location = useLocation();
  const [numPages, setNumPages] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  useEffect(() => {
    const pdfUrl = location.state?.pdfBlobUrl;
    if (pdfUrl) {
      setPdfBlobUrl(pdfUrl);
    }
  }, [location.state]);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (!pdfBlobUrl) {
    return <div className="no-document">No document found</div>;
  }

  return (
    <div className="full-document-container">
      <Document
        file={pdfBlobUrl}
        onLoadSuccess={onLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={index}
            pageNumber={index + 1}
            renderTextLayer={false}
            width={800}
            height={1200}
          />
        ))}
      </Document>
    </div>
  );
};

export default FullDocumentView;
