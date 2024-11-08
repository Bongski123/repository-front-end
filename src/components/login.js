import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import "./CSS/Login.css";
import bg1 from './../assets/bg1.jpg';
import bg2 from './../assets/bg2.jpg';
import bg3 from './../assets/bg3.jpg';
import bg4 from './../assets/bg4.jpg';
import bg5 from './../assets/bg5.jpg';
import logo from './../assets/CCS LOGO.png';

const GOOGLE_CLIENT_ID = '968089167315-ch1eu1t6l1g8m2uuhrdc5s75gk9pn03d.apps.googleusercontent.com';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [bgImageIndex, setBgImageIndex] = useState(0);
  const navigate = useNavigate();

  const backgroundImages = [bg1, bg2, bg3, bg4, bg5];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://ccsrepo.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error || 'Login failed. Please try again.');
      }

      const { token } = await response.json();
      if (!token) throw new Error('Missing token from server response');

      const decodedToken = jwtDecode(token);
      const { roleId, userId } = decodedToken;

      localStorage.setItem('token', token);
      localStorage.setItem('roleId', roleId);
      localStorage.setItem('userId', userId);

      roleId === 1 ? navigate('/admin/dashboard') : navigate('/user/dashboard');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'An error occurred during login. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const res = await fetch('https://ccsrepo.onrender.com/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: response.credential })
      });

      if (!res.ok) {
        const errorMessage = await res.json();
        throw new Error(errorMessage.error || 'Google login failed');
      }

      const { token, userExists, email, name } = await res.json();
      if (!token) throw new Error('Missing token from server response');

      const decodedToken = jwtDecode(token);
      const { roleId, userId } = decodedToken;

      localStorage.setItem('token', token);
      localStorage.setItem('roleId', roleId);
      localStorage.setItem('userId', userId);

      userExists
        ? (roleId === 1 ? navigate('/admin/dashboard') : navigate('/user/dashboard'))
        : navigate('/signup', { state: { email, name } });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: error.message || 'An error occurred during Google login. Please try again.'
      });
    }
  };

  return (
    <div>
      <div
        className="login-background"
        style={{ backgroundImage: `url(${backgroundImages[bgImageIndex]})` }}
      ></div>
      
      <div className="logo-container">
        <img src={logo} alt="NCG Logo" className="logo" />
      </div>
      
      <div className="login-container">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email" style={{ marginBottom: '15px' }}>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="password" style={{ marginBottom: '15px' }}>
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

        <p>or</p>
        
        <div className="google-login">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              uxMode="redirect"  // Redirect mode to avoid COOP and CSP issues
              onSuccess={handleGoogleLogin}
              onError={() =>
                Swal.fire({
                  icon: 'error',
                  title: 'Google Login Failed',
                  text: 'An error occurred during Google login. Please try again.'
                })
              }
            />
          </GoogleOAuthProvider>
        </div>

        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        <p><Link to="/forgot-password">Forgot Password?</Link></p>
      </div>
    </div>
  );
};

export default Login;
