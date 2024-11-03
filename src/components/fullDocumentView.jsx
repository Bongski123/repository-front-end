// FullDocumentPage.js
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";

function FullDocumentPage({ pdfBlobUrl }) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  return (
    <div className="full-document-page">
      <Document file={pdfBlobUrl}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}

export default FullDocumentPage;
