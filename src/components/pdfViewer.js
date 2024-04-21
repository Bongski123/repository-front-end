import React, { useState, useEffect } from "react";
import axios from "axios";

function PDFViewer({ documentID }) {
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await axios.get(`/api/pdf/${documentID}`, {
          responseType: "arraybuffer",
        });
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(pdfBlob);
        setFileData(url);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPDF();
  }, [documentID]);

  return (
    <div>
      {fileData ? (
        <embed src={fileData} type="application/pdf" width="100%" height="600px" />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default PDFViewer;
