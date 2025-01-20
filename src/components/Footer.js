import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import './CSS/Footer.css';

import { BiChat } from "react-icons/bi";
import { BiHelpCircle } from "react-icons/bi";

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal"
    >
      <Modal.Header className="help-center" closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Help Center
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs
          defaultActiveKey="home"
          id="fill-tab-example"
          className="mb-2 equal-width-tabs"
          fill
        >
          <Tab eventKey="home" title="Tutorial">
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="1">
                <Accordion.Header className="accordion-header">
                  How to find for a document in Research Nexus?
                </Accordion.Header>
                <Accordion.Body className="accordion-body">
                1.Log in to your account: Use your credentials to access the Research Nexus system.<br></br>
                2.Navigate to the Search Section: Locate the search functionality on the dashboard.<br></br>
                3.Enter Keywords: Type in the title, author, keywords, or related terms of the document you're looking for.<br></br>
                4.Filter Options: Use filters (e.g., research field, publication year, or author) to refine your search results.<br></br>
                5.View Document: Select a result from the list to view the document details or download the file if available.<br></br>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  How to sign up for an account in Research Nexus?
                </Accordion.Header>
                <Accordion.Body className="accordion-body">
                1.Visit the Registration Page: Open the Research Nexus platform and go to the "Sign Up" section.<br></br>
                2.Fill Out the Registration Form:<br></br>
                3.Provide your personal details (e.g., full name, email address, and affiliation).<br></br>
                4.Create a secure password.<br></br>
                5.Submit and Verify:<br></br>
                6.Click "Sign Up" to submit your form.<br></br>
                7.Check your email for a verification link. Click the link to confirm your account.<br></br>
                8.Account Approval: Wait for the system admin to approve your registration if manual approval is required.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  How to login your account in Research Nexus?
                </Accordion.Header>
                <Accordion.Body className="accordion-body">
                 1.Access the Login Page: Open the Research Nexus system and go to the "Login" section.<br></br>
                 2.Enter Your Credentials:<br></br>
                 3.Input your registered email address.<br></br>
                 4.Enter your password.<br></br>
                 5.You can use Google or Gbox Directly.<br></br>
                 6.Click Log In: Press the "Login" button to proceed.
                 7.Access Your Dashboard: Upon successful login, you’ll be redirected to the system dashboard where you can explore and manage research documents.<br></br>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="4">
                <Accordion.Header>
                How to submit a new research document in Research Nexus?
                </Accordion.Header>
                <Accordion.Body className="accordion-body">
                1.Log in to Your Account: Access the Research Nexus system using your credentials.<br></br>
                2.Go to the "Submit Research" Section: From the dashboard, navigate to the "Submit Research" or "Upload Document" tab.<br></br>
                3.Fill Out the Submission Form: Provide the required details, including:<br></br>
                  *Title: Enter the title of your research.<br></br>
                  *Abstract: Add a brief summary of your research.<br></br>
                  *Keywords: Include relevant keywords for easier searchability.<br></br>
                  *Authors: List all contributing authors.<br></br>
                  *Category/Field: Select the appropriate research field or category.<br></br>
                4.Upload Your Document: Attach your research file (e.g., PDF, Word document) by clicking the "Upload File" button.<br></br>
                5.Review and Submit: Double-check the details and click "Submit" to finalize your submission.<br></br>
                6.Wait for Approval: If required, your document will be reviewed by an admin or moderator before being published in the system.<br></br>

                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Tab>

          <Tab eventKey="profile" title="Frequently Asked Questions">
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="1">
                <Accordion.Header className="accordion-header">
                How do I reset my password in Research Nexus?
                </Accordion.Header>
                <Accordion.Body className="accordion-body">
                If you’ve forgotten your password, follow these steps:<br></br><br></br>
               1. Go to the login page and click on “Forgot Password?”.<br></br>
               2.Enter your registered email address and submit the form.<br></br>
               3.Check your email for a password reset link.<br></br>
               4.Click the link and create a new password.<br></br>
               5.Log in using your new credentials.<br></br>

                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                Can I edit or delete a research document I submitted?
                </Accordion.Header>
                <Accordion.Body className="accordion-body">
                Yes, you can edit or delete your submitted research documents:<br></br><br></br>

               1.Log in to your account.<br></br>
               2.Navigate to the “My Submissions” or “My Documents” section.<br></br>
               3.Select the research document you want to edit or delete.<br></br>
               4.Use the “Edit” button to update details or upload a new file, or click “Delete” to remove the document permanently.<br></br>
               <br></br>Note: Changes may require admin approval before being reflected in the system.

                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>
                Who can access the documents in Research Nexus?
                </Accordion.Header>
                <Accordion.Body className="accordion-body">
                Access levels depend on your system's permissions:<br></br><br></br>

               1.Public Documents: Available to all registered users or visitors.<br></br>
               2.Restricted Documents: Accessible only to users with specific roles (e.g., faculty or students).<br></br>
               3.Private Documents: Visible only to the document owner and system administrators.<br></br>
               4.Check the document’s access level before submitting or sharing.<br></br>

                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="4">
                <Accordion.Header>
                How can I contact support for technical issues?
                </Accordion.Header>
                <Accordion.Body className="accordion-body">
                For technical assistance, follow these steps:<br></br><br></br>

               1.Click on the “Help” or “Support” tab in the system menu.<br></br>
               2.Fill out the contact form with your issue and details.<br></br>
               3.Submit the form or email the support team at ncfresearchnexus@gmail.com.<br></br>
               4.You’ll receive a response within 24-48 hours.<br></br>

                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ChatModal(props) {
  
  return (
    <Modal 
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Chat</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Chat with us</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>
              Close
            </Button>
          </Modal.Footer>
    </Modal>
  )
}

function Footer() {
  const [showHelp, setShowHelp] = useState(false);

  const handleCloseHelp = () => setShowHelp(false);
  const handleShowHelp = () => setShowHelp(true);

  const [showChat, setShowChat] = useState(false);
  const handleCloseChat = () => setShowChat(false);
  const handleShowChat = () => setShowChat(true);

  return (
<div>
  <Container fluid className="footer-container footer-fixed-right">
  <Button
  size="lg"
  className="me-3 custom-button"
  id="footer-icons"
  onClick={handleShowHelp}
>
  <BiHelpCircle />
</Button>
<Button
  size="lg"
  className="me-3 custom-button"
  id="footer-icons"
  onClick={handleShowChat}
>
  <BiChat />
</Button>

  </Container>

  <MyVerticallyCenteredModal
    show={showHelp}
    onHide={() => handleCloseHelp(true)}
  />

  <ChatModal
    show={showChat}
    onHide={() => handleCloseChat(true)}
  />
</div>



  );
}

export default Footer;
