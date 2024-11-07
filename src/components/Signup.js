import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import eye icons
import './CSS/signup.css'; // Import custom CSS file

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [programId, setProgramId] = useState('');
  const [institution, setInstitution] = useState('');
  const [programs, setPrograms] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);  // For showing/hiding password
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);  // For confirm password

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://ccsrepo.onrender.com/programs/all');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Received non-JSON response');
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

    fetchData();
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
          name,
          email,
          password,
          program_id: programId, // Default role_id
          institution,
          role_id: 3
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You have been registered successfully.',
        });

        // Clear form fields after successful registration
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setProgramId('');
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
    <div className="sign-up-container">
      <h2 className="sign-up-header">Sign Up</h2>
      <Form onSubmit={handleSubmit} className="sign-up-form">
        <Form.Group controlId="name">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

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
          <div className="password-input-container">
            <Form.Control
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              className="password-toggle-icon"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <div className="password-input-container">
            <Form.Control
              type={confirmPasswordVisible ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div
              className="password-toggle-icon"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId="programId">
          <Form.Label>Program ID</Form.Label>
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
          <Form.Label>Institution</Form.Label>
          <Form.Control
            type="institution"
            placeholder="Enter Institution"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="sign-up-btn">
          Sign Up
        </Button>
      </Form>

      <p className="sign-up-footer">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignUp;
