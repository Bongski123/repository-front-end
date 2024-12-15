import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [message, setMessage] = useState(null);  // To store verification message
  const [loading, setLoading] = useState(true);  // To show loading indicator
  const navigate = useNavigate();  // To handle redirection

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');  // Get the token value from the URL

  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          // Log the token for debugging purposes
          console.log('Token being sent for verification:', token);

          const response = await fetch('https://ccsrepo.onrender.com/verify-email?token=' + token, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          const data = await response.json();

          // Handle the response
          if (response.ok) {
            setMessage('Email successfully verified. You can now log in.');
            // Redirect to login page after a short delay
            setTimeout(() => {
              navigate('/login');
            }, 2000);  // Delay of 2 seconds for user to see the message
          } else {
            setMessage(data.message || 'Error during verification');
          }
        } catch (error) {
          console.error('Error during verification:', error);
          setMessage('Error verifying your email. Please try again later.');
        } finally {
          setLoading(false);  // Hide loading indicator after request completes
        }
      };

      verifyToken();
    } else {
      setLoading(false);  // Hide loading if no token is provided
      setMessage('No verification token found.');
    }
  }, [token, navigate]);

  return (
    <div>
      <h2>Email Verification</h2>
      {loading ? (
        <p>Verifying your email, please wait...</p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
};

export default VerifyEmail;
