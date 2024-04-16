import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import axios from "axios";
function NavigationBar({ changeTab }) {
  const redirectToNCF = () => {
    window.open('https://www.ncf.edu.ph/');
  };

  // Login Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // SignUp Modal
  const [showSignup, setShowSignup] = useState(false);
  const handleCloseSignup = () => setShowSignup(false);
  const handleShowSignup = () => setShowSignup(true);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState("");
  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    if (form.checkValidity()) {
      try {
        const response = await axios.post('http://localhost:9000/user/login', {
          email: email,
          password: password,
        });

        const { token, role } = response.data;

        localStorage.setItem('token', JSON.stringify(response));

        if (role === 1) {
          // Navigate to admin dashboard
          // You may need to handle this according to your routing setup
        } else {
          // Navigate to user dashboard
          // You may need to handle this according to your routing setup
        }

        handleClose(); // Close the login modal after successful login
      } catch (error) {
        console.error('login failed', error);
        // Display notification for wrong username or password
        Swal.fire({
          icon: 'error',
          title: 'Oopssyy...',
          text: 'Incorrect username or password!',
        });
      }
    }
  };

  const handleSubmitSignup = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);

    if (form.checkValidity()) {
      try {
        const response = await axios.post("http://localhost:9000/user/register", {
          firstName: "",
          lastName: "", // Adjust according to your schema
          email: "", // Assuming email is the same as student ID
          password: "",
          role_id: 2, // Assuming role_id for regular users
        });

        handleCloseSignup();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User registered successfully.",
        });
      } catch (error) {
        console.error("Registration failed", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Registration failed. Please try again.",
        });
      }
    }
  };


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSetName = (event) => {
    setName(event.target.value);
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
        <Container>
          <Navbar.Brand href="#home">
            <Image
              src={require('../assets/ncf-logo-green.png')}
              alt="NCF Logo"
              className="ncf-logo-navbar"
              onClick={redirectToNCF}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-3" variant="underline">
              <Nav.Link onClick={() => changeTab('search')}>Search</Nav.Link>
              <Nav.Link onClick={() => changeTab('categories')}>Categories</Nav.Link>
              <Nav.Link onClick={() => changeTab('upload')}>Upload</Nav.Link>
              {/* Add other Nav links */}
            </Nav>
            <Nav className="ms-auto">
              <div className="ms-auto">
                <Button variant="success" className="me-3 button-navbar" onClick={handleShow}>
                  Login
                </Button>
                <Button variant="success" className="button-navbar" onClick={handleShowSignup}>
                  Sign Up
                </Button>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Login Modal */}
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>Login Account</h3>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={handleEmailChange}
  
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid student ID in the format 00-0000.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={handlePasswordChange}
                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$"
                required
              />
              <Form.Control.Feedback type="invalid">
                Password must contain at least 8 characters including at least
                one uppercase letter, one lowercase letter, one digit, and one
                special character.
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="danger" onClick={handleClose} className="me-3">
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* SignUp Modal */}
      <Modal show={showSignup} onHide={handleCloseSignup} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>Sign Up Account</h3>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmitSignup}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your First Name:"
                value={name}
                onChange={handleSetName}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter your name.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your Name:"
                value={name}
                onChange={handleSetName}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter your name.
              </Form.Control.Feedback>
            </Form.Group>


            <Form.Group className="mb-3" controlId="studentId">
              <Form.Label>Student ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter student ID"
                value={email}
                onChange={handleEmailChange}
                pattern="[0-9]{2}-[0-9]{5}"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid student ID in the format 00-0000.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={handlePasswordChange}
                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$"
                required
              />
              <Form.Control.Feedback type="invalid">
                Password must contain at least 8 characters including at least
                one uppercase letter, one lowercase letter, one digit, and one
                special character.
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="danger" onClick={handleCloseSignup} className="me-3">
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NavigationBar;