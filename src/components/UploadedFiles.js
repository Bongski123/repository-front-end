import React from 'react';

const UserUploadedFiles = ({ files }) => {
  return (
    <div>
      <h2>User Uploaded Files</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Date</th>
            <th>Description</th>
            <th>File</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>{file.title}</td>
              <td>{file.author}</td>
              <td>{file.date}</td>
              <td>{file.description}</td>
              <td>
                {/* Assuming the file is stored on the server */}
                <a href={`http://localhost:3001/files/${file.fileName}`} target="_blank" rel="noopener noreferrer">Download</a>
                {/* You can also use a button to open the file in a modal */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserUploadedFiles;
