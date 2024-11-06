import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './CSS/ForgotPassword.css'; // Import the CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // Step to manage form flow
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:9000/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire('Success', 'Verification code sent to your email!', 'success');
        setStep(2); // Proceed to enter the code and new password
      } else {
        Swal.fire('Error', data.error || 'Failed to send code', 'error');
      }
    } catch (error) {
      console.error('Error sending code:', error);
      Swal.fire('Error', 'An unexpected error occurred. Please try again later.', 'error');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:9000/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire('Error', data.error || 'Failed to verify code', 'error');
        return; // Exit if response is not OK
      }

      Swal.fire('Success', 'Your verification code is correct!', 'success');
      setStep(3); // Proceed to enter a new password
    } catch (error) {
      console.error('Error verifying code:', error);
      Swal.fire('Error', 'An unexpected error occurred. Please try again later.', 'error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://ccsrepo.onrender.com/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire('Success', 'Your password has been reset successfully!', 'success');
        // Clear local storage or session (auto logout)
        localStorage.removeItem('token'); // Adjust based on your token storage
        localStorage.removeItem('userId'); // Adjust based on your user storage

        // Redirect to the login page after a short delay
        setTimeout(() => {
          navigate('/login'); // Redirect to login
        }, 1500); // Optional: Wait 1.5 seconds before redirecting
      } else {
        Swal.fire('Error', data.error || 'Failed to reset password', 'error');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      Swal.fire('Error', 'An unexpected error occurred. Please try again later.', 'error');
    }
  };

  return (
    <div className="forgot-password">
      <h2>Password Reset</h2>
      {step === 1 ? (
        <Form onSubmit={handleSendCode}>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Send Verification Code
          </Button>
        </Form>
      ) : step === 2 ? (
        <Form onSubmit={handleVerifyCode}>
          <Form.Group controlId="code">
            <Form.Label>Verification Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the code sent to your email"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Verify Code
          </Button>
        </Form>
      ) : (
        <Form onSubmit={handleResetPassword}>
          <Form.Group controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Reset Password
          </Button>
        </Form>
      )}
    </div>
  );
};

export default ForgotPassword;
