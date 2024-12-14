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

import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const SignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, first_name, middle_name, last_name, suffix, roleId, institutionId } = location.state || {};  // Extract from location.state

  const backgroundImages = [bg1, bg2, bg3, bg4, bg5];
  const [bgImageIndex, setBgImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    firstName: first_name || '',  // Prefill first name
    middleName: middle_name || '',  // Prefill middle name
    lastName: last_name || '',  // Prefill last name
    suffix: suffix || '',  // Prefill suffix
    emailInput: email || '',  // Prefill email
    password: '',  // Keep password blank initially
    confirmPassword: '',  // Keep confirm password blank
    programId: '',
    institutionId: institutionId || '',  // Prefill institution if available
    roleId: roleId || '',  // Prefill role ID if available
    newInstitution: '',
    newProgram: ''
  });
  const [formValidation, setFormValidation] = useState({
    passwordValid: false,
    confirmPasswordValid: false
  });
  const [roles, setRoles] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [institutions, setInstitutions] = useState([]);

  const passwordRegex = /^(?=.*[A-Z])(?=.*\W).{8,}$/;

  useEffect(() => {
    // Change background image every 5 seconds
    const interval = setInterval(() => {
      setBgImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Set role and institution defaults based on email domain
    const checkEmailDomain = () => {
      if (formData.emailInput.endsWith('@gbox.ncf.edu.ph')) {
        setFormData((prev) => ({ ...prev, roleId: '2', institutionId: '16' }));
      } else if (formData.emailInput.endsWith('@ncf.edu.ph')) {
        setFormData((prev) => ({ ...prev, roleId: '3', institutionId: '16' }));
      }else {
        setFormData((prev) => ({ ...prev, roleId: '4', institutionId: '', userType: 'non-ncf-user' })); // Defaults for non-NCF users
      }
    };
    checkEmailDomain();

    // Fetch roles, programs, and institutions
    const fetchRoles = async () => {
      try {
        const response = await axios.get('https://ccsrepo.onrender.com/roles/all');
        setRoles(filterRoles(response.data.roles));
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    const fetchPrograms = async () => {
      try {
        const response = await axios.get('https://ccsrepo.onrender.com/programs/all');
        setPrograms(response.data.programs || []);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };

    const fetchInstitutions = async () => {
      try {
        const response = await axios.get('https://ccsrepo.onrender.com/institutions/all');
        setInstitutions(response.data.institutions || []);
      } catch (error) {
        console.error('Error fetching institutions:', error);
      }
    };

    fetchRoles();
    fetchPrograms();
    fetchInstitutions();
  }, [formData.emailInput]);

  const filterRoles = (rolesData) => {
    const currentUserRoleId = localStorage.getItem('roleId');
    return currentUserRoleId === '1'
      ? rolesData
      : rolesData.filter(role => role.role_id !== 1 && role.role_id !== 5);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData((prev) => ({ ...prev, password }));
  
    setFormValidation((prev) => ({
      ...prev,
      passwordValid: passwordRegex.test(password),
      confirmPasswordValid: password === formData.confirmPassword, // Ensure this updates when the password changes
    }));
  };
  
  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setFormData((prev) => ({ ...prev, confirmPassword }));
  
    setFormValidation((prev) => ({
      ...prev,
      confirmPasswordValid: confirmPassword === formData.password, // Ensure this updates when confirmPassword changes
    }));
  };
  
  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      roleId,
      programId: roleId === '2' ? prev.programId : '',
      newProgram: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        text: 'Please make sure your passwords match.'
      });
      return;
    }

    const dataToSend = {
      first_name: formData.firstName,
      middle_name: formData.middleName || null,
      last_name: formData.lastName,
      suffix: formData.suffix || null,
      email: formData.emailInput,
      password: formData.password || null,
      program_id: formData.programId || null,
      institution_id: formData.institutionId,
      role_id: formData.roleId,
     
      new_institution_name: formData.institutionId === 'new' ? formData.newInstitution : undefined,
      new_program_name: formData.programId === 'new' ? formData.newProgram : undefined,
    };

    try {
      const response = await axios.post('https://ccsrepo.onrender.com/register', dataToSend);
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: response.data.message || 'You have been registered successfully.'
        });
        navigate('/login');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: response.data.error || 'An error occurred during registration.'
        });
      }
    } catch (error) {
      console.error('Error registering user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'An unexpected error occurred. Please try again later.'
      });
    }
  };

  const isGboxEmail = formData.emailInput.endsWith('@gbox.ncf.edu.ph');

  // ValidationMessage Component
const ValidationMessage = ({ isValid, message }) => (
  <p
    style={{
      display: 'flex',
      alignItems: 'center',
      margin: '5px 0',
      color: isValid ? 'green' : 'red',
      fontSize: '0.9rem',
    }}
  >
    {isValid ? (
      <FaCheckCircle style={{ marginRight: '5px', color: 'green' }} />
    ) : (
      <FaTimesCircle style={{ marginRight: '5px', color: 'red' }} />
    )}
    {message}
  </p>
);

  return (
    <div>
      <div className="login-background" style={{ backgroundImage: `url(${backgroundImages[bgImageIndex]})` }}></div>
      <div className="logo-container">
        <img src={logo} alt="CCS Logo" className="logo" />
      </div>
      <div className="sign-up-container">
        <Form onSubmit={handleSubmit} className="sign-up-form">
          {['firstName', 'middleName', 'lastName', 'suffix'].map((field) => (
            <Form.Group controlId={field} key={field}>
              <Form.Control
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}

                value={formData[field]}
                onChange={handleChange}
                name={field}
                required={field !== 'middleName' && field !== 'suffix'}
              />
            </Form.Group>
          ))}

          <Form.Group controlId="email">
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={formData.emailInput}
              onChange={(e) => setFormData((prev) => ({ ...prev, emailInput: e.target.value }))}
              required
              disabled={!!email || isGboxEmail} // Disable if email is already provided or is from gbox.ncf.edu.ph
            />
          </Form.Group>

          {!email && (
            <>
       <Form.Group controlId="password">
  <div style={{ position: 'relative' }}>
    <Form.Control
      type="password"
      placeholder="Password"
      value={formData.password}
      onChange={handlePasswordChange}
      required
      style={{
        borderColor: formData.password && !formValidation.passwordValid ? 'red' : '',
        borderWidth: '2px',
        paddingRight: '30px', // To make space for the icon
        borderColor: formData.confirmPassword
        ? formValidation.confirmPasswordValid
          ? 'green'
          : 'red'
        : '',
      borderWidth: '2px',
      }}
    />
    {formValidation.passwordValid && formData.password && (
      <FaCheckCircle
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'green',
        }}
        
      />
      
    )}
     {formData.password && !formValidation.passwordValid && (
    <ValidationMessage
      isValid={formValidation.passwordValid}
      message="Password must be at least 8 characters long, include a capital letter, and a special character."
    />
  )}
  </div>
</Form.Group>

<Form.Group controlId="confirmPassword">
  <Form.Control
    type="password"
    placeholder="Confirm Password"
    value={formData.confirmPassword}
    onChange={handleConfirmPasswordChange}
    required
    style={{
      borderColor: formData.confirmPassword
        ? formValidation.confirmPasswordValid
          ? 'green'
          : 'red'
        : '',
      borderWidth: '2px',
    }}
  />
  {formData.confirmPassword && (
    <ValidationMessage
      isValid={formValidation.confirmPasswordValid}
      message={
        formValidation.confirmPasswordValid
          ? 'Password is matched'
          : 'Passwords must match.'
      }
    />
  )}
</Form.Group>
            </>
          )}

          <Form.Group controlId="role">
       
            <Form.Control
              as="select"
              value={formData.roleId}
              onChange={handleRoleChange}
              disabled={isGboxEmail|| email} // Disable if email is from gbox.ncf.edu.ph
              required
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </option>
              ))}
              
            </Form.Control>
            
          </Form.Group>
          {formData.roleId === '2' && (
  <Form.Group controlId="program">
    <Form.Control
      as="select"
      value={formData.programId}
      onChange={handleChange}
      name="programId"
      required
    >
      <option value="">Select Program</option>
      {programs.map((program) => (
        <option key={program.program_id} value={program.program_id}>
          {program.program_name}
        </option>
      ))}
      <option value="new">Other (Add new program)</option>
    </Form.Control>
    {formData.programId === 'new' && (
      <Form.Control
        type="text"
        placeholder="New Program Name"
        value={formData.newProgram}
        onChange={handleChange}
        name="newProgram"
        required={formData.programId === 'new'} // New program name is required if "Other" is selected
      />
    )}
    {formData.programId === 'new' && !formData.newProgram && (
      <Form.Text className="text-danger">New program name is required.</Form.Text>
    )}
  </Form.Group>
)}

<Form.Group controlId="institution">
  <Form.Control
    as="select"
    value={formData.institutionId}
    onChange={handleChange}
    name="institutionId"
    disabled={isGboxEmail} // Disable if email is from gbox.ncf.edu.ph
    required
  >
    <option value="">Select Institution</option>
    {institutions.map((institution) => (
      <option key={institution.institution_id} value={institution.institution_id}>
        {institution.institution_name}
      </option>
    ))}
    <option value="new">Other (Add new institution)</option>
  </Form.Control>
  {formData.institutionId === 'new' && (
    <Form.Control
      type="text"
      placeholder="New Institution Name"
      value={formData.newInstitution}
      onChange={handleChange}
      name="newInstitution"
      required={formData.institutionId === 'new'} // New institution name is required if "Other" is selected
    />
  )}
  {formData.institutionId === 'new' && !formData.newInstitution && (
    <Form.Text className="text-danger">New institution name is required.</Form.Text>
  )}
</Form.Group>


          <Button className='sign-up-btn'  type="submit" >
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
};


const ValidationMessage = ({ isValid, message }) => (
  <p className={isValid ? 'text-success' : 'text-danger'}>
    {isValid ? <FaCheckCircle /> : <FaTimesCircle />} {message}
  </p>
);

export default SignUp;
