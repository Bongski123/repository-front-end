import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import "./CSS/Login.css";

const GOOGLE_CLIENT_ID = '968089167315-ch1eu1t6l1g8m2uuhrdc5s75gk9pn03d.apps.googleusercontent.com'; // Hardcoded Client ID

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:9000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error);
      }

      const responseData = await response.json();
      const { token } = responseData;

      // Decode the token to extract roleId and other info
      const decodedToken = jwtDecode(token);
      const { roleId } = decodedToken;
      const { userId } = decodedToken;

      // Store token and roleId in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('roleId', roleId);

      // Navigate based on roleId
      if (roleId === 1) {
        navigate('/admin/dashboard'); // Admin dashboard
      } else {
        navigate('/user/dashboard'); // User dashboard
      }

    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Login Failed', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const res = await fetch('http://localhost:9000/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: response.credential }) // Use id_token
      });
  
      if (!res.ok) {
        const errorMessage = await res.json();
        throw new Error(errorMessage.error);
      }
  
      const data = await res.json();
      const { token } = data;
      
      // Decode the token to extract roleId and other info
      const decodedToken = jwtDecode(token);
      const { roleId } = decodedToken;
      const { userId } = decodedToken;
     
      // Store token and roleId in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('roleId', roleId);
      localStorage.setItem('userId', userId);
  
      // Navigate based on roleId
      if (roleId === 1) {
        navigate('/admin/dashboard'); // Admin dashboard
      } else {
        navigate('/user/dashboard'); // User dashboard
      }

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: error.message
      });
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="secondary" type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>

      <div className="google-login">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => Swal.fire({ icon: 'error', title: 'Google Login Failed', text: 'An error occurred during Google login. Please try again.' })}
          />
        </GoogleOAuthProvider>
      </div>

      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      <p><Link to="/forgot-password">Forgot Password?</Link></p> {/* Forgot Password Link */}
    </div>
  );
};

export default Login;
