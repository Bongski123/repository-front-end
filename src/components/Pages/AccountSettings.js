import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../CSS/AccountSettings.css';

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/; // Password regex for validation

const AccountSettings = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypedPassword, setRetypedPassword] = useState('');
  const [step, setStep] = useState(1);
  const [profilePic, setProfilePic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);  
  const [showRetypedPassword, setShowRetypedPassword] = useState(false);  
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();
  const [editingInfo, setEditingInfo] = useState(false);



  const [userInfo, setUserInfo] = useState({
    first_name: '',
    middle_name: '' || null,
    last_name: '',
    suffix: '' || null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        if (userId) {
          fetchUserData(userId);
          fetchProfilePicture(userId); // Optionally, fetch profile picture as well
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);
  
  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`https://ccsrepo.onrender.com/users/${userId}`);
      if (response.status === 200) {
        const userData = response.data;
        console.log("Fetched User Data:", userData);  // Debugging line
        setUserInfo({
          first_name: userData.first_name || '',
          middle_name: userData.middle_name || '',
          last_name: userData.last_name || '',
          suffix: userData.suffix || '',
        });
      } else {
        console.error('Error fetching user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchProfilePicture = async (userId) => {
    try {
      const response = await axios.get(`https://ccsrepo.onrender.com/profile-picture/${userId}`, {
        responseType: 'blob',
      });

      if (response.status === 200) {
        const imageUrl = URL.createObjectURL(response.data);
        setProfilePic(imageUrl);
        localStorage.setItem('picture', imageUrl);
      } else {
        console.error('Profile picture not found');
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  const handleProfilePicChange = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
      Swal.fire('Error', 'User ID not found. Please log in again.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('profile_pic', profilePic);
    formData.append('userId', userId);

    try {
      const response = await fetch('https://ccsrepo.onrender.com/upload-profile-pic', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire('Success', 'Profile picture updated successfully!', 'success');
        fetchProfilePicture(userId);
      } else {
        Swal.fire('Error', data.error || 'Failed to update profile picture', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'An unexpected error occurred. Please try again later.', 'error');
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://ccsrepo.onrender.com/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        Swal.fire('Success', 'Verification code sent to your email!', 'success');
        setStep(2);
      } else {
        Swal.fire('Error', data.error || 'Failed to send code', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'An unexpected error occurred. Please try again later.', 'error');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://ccsrepo.onrender.com/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();

      if (response.ok) {
        Swal.fire('Success', 'Your verification code is correct!', 'success');
        setStep(3);
      } else {
        Swal.fire('Error', data.error || 'Failed to verify code', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'An unexpected error occurred. Please try again later.', 'error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!passwordRegex.test(newPassword)) {
      Swal.fire('Error', 'Password must be at least 8 characters long, contain a capital letter, and a special character.', 'error');
      return;
    }

    if (newPassword !== retypedPassword) {
      setPasswordMatch(false);
      return;
    }

    try {
      const response = await fetch('https://ccsrepo.onrender.com/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire('Success', 'Your password has been reset successfully!', 'success');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        Swal.fire('Error', data.error || 'Failed to reset password', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'An unexpected error occurred. Please try again later.', 'error');
    }
  };

  // Real-time validation for password
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordValid(passwordRegex.test(password)); // Check if password is valid
  };

  // Real-time validation for confirm password
  const handleRetypedPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setRetypedPassword(confirmPassword);
    setPasswordMatch(newPassword === confirmPassword); // Check if passwords match
  };


  const handleUpdateUserInfo = async (e) => {
    e.preventDefault();
    console.log('User Info:', userInfo); // Log userInfo to check its values
  
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.log('User ID not found');
      return;
    }
  
    try {
      const response = await axios.put(`https://ccsrepo.onrender.com/users/update/${userId}`, userInfo);
      const data = response.data;
      console.log('API Response:', data); // Check if response contains message
  
      if (response.status === 200) {
        Swal.fire('Success', 'Personal information updated successfully!', 'success');
        window.location.reload();
      } else {
        Swal.fire('Error', data.message || 'Failed to update personal information', 'error');
      }
    } catch (error) {
      console.error('Error during update:', error);
      Swal.fire('Error', 'An unexpected error occurred. Please try again later.', 'error');
    }
  };
  
  return (
    <Container className="account-settings-container mt-4">
      <Row className="justify-content-md-center bg-white">
        <Col md={8}>
          <Card className="shadow-lg rounded  ">
            <Card.Header as="h1" className="text-center text-white bg-dark py-3 rounded-top">Account Settings</Card.Header>
            <Card.Body>
              <div className="profile-section mb-4 text-center">
                {profilePic && (
                  <img
                    src={profilePic}
                    alt="Current Profile"
                    className="rounded-circle border border-4 border-light"
                    width="150"
                    height="150"
                  />
                )}
              </div>

              <div className="profile-pic-upload mb-4">
                <Form onSubmit={handleProfilePicChange}>
                  <Form.Group>
                    <Form.Label>Upload New Profile Picture</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => setProfilePic(e.target.files[0])}
                      required
                      className="form-control-file"
                    />
                  </Form.Group>
                  <Button variant="success" type="submit" className="mt-2 w-100 py-2">
                    Upload Profile Picture
                  </Button>
                </Form>
              </div>

         
              <Button
                variant="success"
                onClick={() => setEditingInfo(!editingInfo)}
                className="w-100 py-2 mb-4"
              >
                {editingInfo ? 'Cancel Editing' : 'Edit Personal Information'}
              </Button>

              {/* Form for Editing Information */}
              {editingInfo && (
                <Form onSubmit={handleUpdateUserInfo} className="mb-4">
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={userInfo.first_name || ''}  // Ensure this is binding properly
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, first_name: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Middle Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={userInfo.middle_name || ''}  // Ensure this is binding properly
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, middle_name: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={userInfo.last_name || ''}  // Ensure this is binding properly
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, last_name: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Suffix</Form.Label>
                    <Form.Control
                      type="text"
                      value={userInfo.suffix || ''}  // Ensure this is binding properly
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, suffix: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Button variant="success" type="submit" className="mt-2 w-100 py-2">
                    Update Personal Information
                  </Button>
                </Form>
              )}

              <div className="verification-section mb-4">
                {step === 1 && (
                  <Form onSubmit={handleSendCode}>
                    <Form.Group>
                      <Form.Control
                        type="hidden"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled
                        className="form-control-plaintext"
                      />
                    </Form.Group>
                    <Button variant="success" type="submit" className="mt-2 w-100 py-2">
                      Send Verification Code
                    </Button>
                  </Form>
                )}

                {step === 2 && (
                  <Form onSubmit={handleVerifyCode}>
                    <Form.Group>
                      <Form.Label>Verification Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter the code sent to your email"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        className="mb-2"
                      />
                    </Form.Group>
                    <Button variant="sucess" type="submit" className="w-100 py-2">
                      Verify Code
                    </Button>
                  </Form>
                )}

                {step === 3 && (
                  <Form onSubmit={handleResetPassword}>
                    <Form.Group>
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        required
                        isInvalid={!passwordValid}
                        isValid={passwordValid}
                        className="mb-2"
                        style={{
                          borderColor: passwordValid ? 'green' : 'red',
                        }}
                      />
                      <i
                        onClick={() => setShowPassword(!showPassword)}
                        className={`icon-toggle-password ${showPassword ? 'active' : ''}`}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </i>
                      {!passwordValid && (
                        <Form.Control.Feedback type="invalid">
                          Password must be at least 8 characters long, contain a capital letter, and a special character.
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Retype New Password</Form.Label>
                      <Form.Control
                        type={showRetypedPassword ? 'text' : 'password'}
                        placeholder="Retype your new password"
                        value={retypedPassword}
                        onChange={handleRetypedPasswordChange}
                        required
                        isInvalid={!passwordMatch}
                        isValid={passwordMatch}
                        style={{
                          borderColor: passwordMatch ? 'green' : 'red',
                        }}
                        className="mb-3"
                      />
                      <i
                        onClick={() => setShowRetypedPassword(!showRetypedPassword)}
                        className={`icon-toggle-password ${showRetypedPassword ? 'active' : ''}`}
                      >
                        {showRetypedPassword ? <FaEyeSlash /> : <FaEye />}
                      </i>
                      {!passwordMatch && (
                        <Form.Control.Feedback type="invalid">
                          Passwords do not match.
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>

                    <Button variant="success" type="submit" className="mt-2 w-100 py-2">
                      Reset Password
                    </Button>
                  </Form>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountSettings;
