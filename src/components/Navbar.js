import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect ,navigate} from "react";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setUserRole] = useState(null);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    if (form.checkValidity()) {
      try {
        const response = await axios.post('http://localhost:9000/login', {
          email: email,
          password: password,
        });

        const { token, role } = response.data;

       localStorage.setItem('token', JSON.stringify(token));
        // Assuming role is needed for further logic
        setUserRole(role);

        handleClose(); // Close the login modal after successful login
      } catch (error) {
        console.error('Login failed', error);
        // Display notification for wrong username or password
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Incorrect username or password!',
        });
      }
    }
  };

  useEffect(() => {
    // Fetch user role when component mounts
    const token = localStorage.getItem('token');
    if (token) {
      const { role } = JSON.parse(token).data; // Assuming role is stored in token data
      setUserRole(role);
    }
  }, []);

  // Function to handle navigation to admin page
  const navigateToAdmin = () => {
    navigate('/admin');
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
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          role_id: 2, // Assuming role_id is required
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

  const handleSetFirstName = (event) => {
    setFirstName(event.target.value);
  };

  const handleSetLastName = (event) => {
    setLastName(event.target.value);
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
              <Nav.Link onClick={navigateToAdmin} style={{ display: role === 'admin' ? 'block' : 'none' }}>Admin</Nav.Link>
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
                Please enter a valid Email.
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
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your First Name:"
                value={firstName}
                onChange={handleSetFirstName}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter your name.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="lastNames">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your Last Name:"
                value={lastName}
                onChange={handleSetLastName}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter your name.
              </Form.Control.Feedback>
            </Form.Group>


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
                Please enter a valid Email.
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
