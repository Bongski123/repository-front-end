import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import "./CSS/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:9000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error);
      }

      Swal.fire({ icon: 'success', title: 'Password Reset', text: 'A password reset link has been sent to your email address.' });
      navigate('/login'); // Redirect to login page after successful password reset request

    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Reset Failed', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <Form onSubmit={handleResetPassword}>
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

        <Button variant="primary" type="submit" className="reset-password-btn" disabled={loading}>
          {loading ? 'Sending...' : 'Reset Password'}
        </Button>
      </Form>
    </div>
  );
};

export default ForgotPassword;
