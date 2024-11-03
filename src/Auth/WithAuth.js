import React from 'react';
import { useAuth } from './AuthWrapper';

const withAuthorization = (WrappedComponent) => {
  return (props) => {
    const { user } = useAuth();

    // Redirect if user is not authenticated or does not have role_id equal to '1'
    if (!user || user.role_id !== 1) {
      // Handle unauthorized access
      return <div>Unauthorized Access</div>; // You can redirect to a login page or show a message
    }

    // Render the component if user is authenticated and has role_id equal to '1'
    return <WrappedComponent {...props} />;
  };
};

export default withAuthorization;