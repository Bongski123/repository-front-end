import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import axios from 'axios';  
import './CSS/signup.css'; 

import bg1 from './../assets/bg1.jpg';
import bg2 from './../assets/bg2.jpg';
import bg3 from './../assets/bg3.jpg';
import bg4 from './../assets/bg4.jpg';
import bg5 from './../assets/bg5.jpg';
import logo from './../assets/CCS LOGO.png';

// Icon imports
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const SignUp = () => {
  const location = useLocation();
  const { email, name } = location.state || {}; 

  const [nameInput, setName] = useState(name || ''); 
  const [emailInput, setEmail] = useState(email || ''); 
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [programId, setProgramId] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [roleId, setRoleId] = useState(''); 
  const [roles, setRoles] = useState([]); 
  const [programs, setPrograms] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [newInstitution, setNewInstitution] = useState('');
  const [newProgram, setNewProgram] = useState('');
  const [bgImageIndex, setBgImageIndex] = useState(0); 

  const navigate = useNavigate();
  const backgroundImages = [bg1, bg2, bg3, bg4, bg5];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  const passwordRegex = /^(?=.*[A-Z])(?=.*\W).{8,}$/;

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (passwordRegex.test(newPassword)) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    // Validate confirm password matches the password
    if (newConfirmPassword === password) {
      setConfirmPasswordValid(true);
    } else {
      setConfirmPasswordValid(false);
    }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('https://ccsrepo.onrender.com/roles/all');
        const rolesData = response.data.roles;

        const currentUserRoleId = localStorage.getItem('roleId');

        if (currentUserRoleId === '1') {
          setRoles(rolesData);
        } else {
          const filteredRoles = rolesData.filter(role => role.role_id !== 1 && role.role_id !== 5);
          setRoles(filteredRoles);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    const fetchPrograms = async () => {
      try {
        const response = await fetch('https://ccsrepo.onrender.com/programs/all');
        const data = await response.json();
        if (Array.isArray(data.programs)) {
          setPrograms(data.programs);
        }
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };

    const fetchInstitutions = async () => {
      try {
        const response = await fetch('https://ccsrepo.onrender.com/institutions/all'); 
        const data = await response.json();
        if (Array.isArray(data.institutions)) {
          setInstitutions(data.institutions);
        }
      } catch (error) {
        console.error('Error fetching institutions:', error);
      }
    };

    fetchRoles();
    fetchPrograms();
    fetchInstitutions();
  }, []);

  const handleRoleChange = (e) => {
    const selectedRoleId = e.target.value;
    setRoleId(selectedRoleId);

    if (selectedRoleId !== '2') {
      setProgramId('');
      setNewProgram('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email && password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        text: 'Please make sure your passwords match.',
      });
      return;
    }

    try {
      const dataToSend = {
        name: nameInput,
        email: emailInput,
        password,
        program_id: programId || null, 
        institution_id: institutionId,
        role_id: roleId,
        new_institution_name: institutionId === 'new' ? newInstitution : undefined,
        new_program_name: programId === 'new' ? newProgram : undefined,
      };

      const response = await fetch('https://ccsrepo.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You have been registered successfully.',
        });
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
      <div className="login-background" style={{ backgroundImage: `url(${backgroundImages[bgImageIndex]})` }}></div>
      <div className="logo-container">
        <img src={logo} alt="CCS Logo" className="logo" />
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
              disabled={!!email}
            />
          </Form.Group>

          {!email && (
            <>
              <Form.Group controlId="password">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password || ''}
                  onChange={handlePasswordChange}
                  required
                  style={{
                    borderColor: password && !passwordValid ? 'red' : '',
                    borderWidth: '2px',
                  }}
                />
                {!passwordValid && password && (
                  <div style={{ color: 'red', fontSize: '12px' }}>
                    <FaTimesCircle /> Password must be at least 8 characters long, include a capital letter, and a special character.
                  </div>
                )}
                {passwordValid && password && (
                  <div style={{ color: 'green', fontSize: '12px' }}>
                    <FaCheckCircle /> Password is valid.
                  </div>
                )}
              </Form.Group>

              <Form.Group controlId="confirmPassword">
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword || ''}
                  onChange={handleConfirmPasswordChange}
                  required
                  style={{
                    borderColor: confirmPassword && !confirmPasswordValid ? 'red' : '',
                    borderWidth: '2px',
                  }}
                />
                {!confirmPasswordValid && confirmPassword && (
                  <div style={{ color: 'red', fontSize: '12px' }}>
                    <FaTimesCircle /> Passwords do not match.
                  </div>
                )}
                {confirmPasswordValid && confirmPassword && (
                  <div style={{ color: 'green', fontSize: '12px' }}>
                    <FaCheckCircle /> Passwords match.
                  </div>
                )}
              </Form.Group>
            </>
          )}

          <Form.Group controlId="role">
            <Form.Control
              as="select"
              value={roleId}
              onChange={handleRoleChange}
              required
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
              ))}
            </Form.Control>
          </Form.Group>

          {roleId === '2' && (
            <Form.Group controlId="program">
              <Form.Control
                as="select"
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                required
              >
                <option value="">Select Program</option>
                {programs.map(program => (
                  <option key={program.program_id} value={program.program_id}>{program.program_name}</option>
                ))}
                <option value="new">Other (Enter New Program)</option>
              </Form.Control>
              {programId === 'new' && (
                <Form.Control
                  type="text"
                  placeholder="Enter New Program"
                  value={newProgram}
                  onChange={(e) => setNewProgram(e.target.value)}
                  required
                />
              )}
            </Form.Group>
          )}

          <Form.Group controlId="institution">
            <Form.Control
              as="select"
              value={institutionId}
              onChange={(e) => setInstitutionId(e.target.value)}
              required
            >
              <option value="">Select Institution</option>
              {institutions.map(institution => (
                <option key={institution.institution_id} value={institution.institution_id}>{institution.institution_name}</option>
              ))}
              <option value="new">Other (Enter New Institution)</option>
            </Form.Control>
            {institutionId === 'new' && (
              <Form.Control
                type="text"
                placeholder="Enter New Institution"
                value={newInstitution}
                onChange={(e) => setNewInstitution(e.target.value)}
                required
              />
            )}
          </Form.Group>

          <Button variant="primary" type="submit">Register</Button>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
