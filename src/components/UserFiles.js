import React from 'react';
import UserUploadedFiles from './UploadedFiles';

const UserFiles = () => {
  // Assuming you have a state or data containing the user-uploaded files
  const userFiles = [
    {
      title: 'Augmented Reality for Teaching Anatomy',
      author: 'Mj Estepanie Palo',
      date: '2025-01-01',
      description: 'Augmented Reality for Teaching Anatomy is a Lorem Ipsum',
      fileName: '1713196074456_430773967_743526791310826_9084489712811843036_n.jpg'
    },
    // Other user-uploaded files...
  ];

  return (
    <div>
      {/* Other components */}
      <UserUploadedFiles files={userFiles} />
    </div>
  );
};

export default UserFiles;
