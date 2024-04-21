import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function FileContentPage() {
  const { documentID } = useParams();
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    // Fetch file content from backend
    fetch(`/api/pdf/${documentID}`)
      .then((response) => response.text())
      .then((data) => {
        setFileContent(data);
      })
      .catch((error) => console.error("Error fetching file content:", error));
  }, [documentID]);

  return (
    <div>
      {/* Display file content */}
      <embed src={`data:application/pdf;base64,${btoa(fileContent)}`} type="application/pdf" width="100%" height="600px" />
    </div>
  );
}

export default FileContentPage;
