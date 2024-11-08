import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import axios from 'axios';  // Import axios for API requests
import './CSS/signup.css'; 

import bg1 from './../assets/bg1.jpg';
import bg2 from './../assets/bg2.jpg';
import bg3 from './../assets/bg3.jpg';
import bg4 from './../assets/bg4.jpg';
import bg5 from './../assets/bg5.jpg';
import logo from './../assets/CCS LOGO.png'; // Import your logo image here


const SignUp = () => {
  const location = useLocation();
  const { email, name } = location.state || {}; 

  const [nameInput, setName] = useState(name || ''); 
  const [emailInput, setEmail] = useState(email || ''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [programId, setProgramId] = useState('');
  const [institution, setInstitution] = useState('');
  const [roleId, setRoleId] = useState('');  // State for user type (role)
  const [roles, setRoles] = useState([]);  // State to store roles fetched from API
  const [programs, setPrograms] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);  
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);  
  const [bgImageIndex, setBgImageIndex] = useState(0); // For background switching

  const navigate = useNavigate();


  
const backgroundImages = [bg1, bg2, bg3, bg4, bg5];

useEffect(() => {
  const interval = setInterval(() => {
    setBgImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
  }, 5000); // Change every 5 seconds

  return () => clearInterval(interval); // Clean up the interval on unmount
}, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('https://ccsrepo.onrender.com/roles/all');
        const filteredRoles = response.data.roles.filter(role => role.role_id !== 1);
        setRoles(filteredRoles);  // Assuming the response contains an array of roles
      } catch (error) {
        console.error('Error fetching roles:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error Fetching Roles',
          text: 'An error occurred while fetching user roles.',
        });
      }
    };

    const fetchPrograms = async () => {
      try {
        const response = await fetch('https://ccsrepo.onrender.com/programs/all');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (Array.isArray(data.programs)) {
          setPrograms(data.programs);
        } else {
          console.error('Fetched programs data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };

    fetchRoles();
    fetchPrograms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        text: 'Please make sure your passwords match.',
      });
      return;
    }

    try {
      const response = await fetch('https://ccsrepo.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nameInput,
          email: emailInput,
          password,
          program_id: programId,
          institution,
          role_id: roleId  // Add role_name to the request payload
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You have been registered successfully.',
        });

        // After successful registration, redirect to login or dashboard page
        navigate('/login'); 
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: data.error || 'An error occurred during registration.',
        });
      }
    } catch (error) {
      console.error('Error registering user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred. Please try again later.',
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
    <div className="sign-up-container">
   
      <Form onSubmit={handleSubmit} className="sign-up-form">
        <Form.Group controlId="name">

          <Form.Control
            type="text"
            placeholder="Enter full name"
            value={nameInput}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="email">
  
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={emailInput}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!!email}  // Disable email input if it's passed in the state (i.e., from Google login)
          />
        </Form.Group>

        <Form.Group controlId="password">
       
          <div className="password-input-container">
            <Form.Control
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </Form.Group>

        <Form.Group controlId="confirmPassword">
        
          <div className="password-input-container">
            <Form.Control
              type={confirmPasswordVisible ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </Form.Group>

        <Form.Group controlId="programId">
    
          <Form.Control
            as="select"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            required
          >
            <option value="">Select a Program</option>
            {programs.map((program) => (
              <option key={program.program_id} value={program.program_id}>
                {program.program_name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="institution">
         
          <Form.Control
            type="text"
            placeholder="Enter Institution"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            required
          />
        </Form.Group>

        {/* User Type Selection from fetched roles */}
        <Form.Group controlId="roleName">
  
          <Form.Control
            as="select"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            required
          >
            <option value="">Select a User Type</option>
            {roles.map((role) => (
              <option key={role.role_id} value={role.role_id}>{role.role_name}</option>  // Assuming the role object has 'id' and 'name' fields
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" className="sign-up-btn">
          Sign Up
        </Button>
      </Form>

      <p className="sign-up-footer">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
    </div>
  );
};

export default SignUp;
