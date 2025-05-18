import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import './LandingPage.css'; // For specific landing page styles
import AppNavbar from '../components/AppNavbar'; // Or a dedicated LandingNavbar

const LandingPage = () => {
  return (
    <>
    <AppNavbar /> {/* Or a simpler navbar for landing */}
    <Container fluid className="landing-page-container text-center d-flex flex-column justify-content-center">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="display-3 fw-bold landing-title">TaskMaster Pro</h1>
          <p className="lead landing-subtitle">
            Organize your life, one task at a time. Simple, powerful, and elegant.
          </p>
          <div className="mt-4">
            <Button as={Link} to="/register" variant="primary" size="lg" className="me-3">
              Get Started
            </Button>
            <Button as={Link} to="/login" variant="outline-light" size="lg">
              Login
            </Button>
          </div>
        </Col>
      </Row>
      {/* Optional: Feature cards section */}
      <Row className="mt-5 pt-5 justify-content-center feature-section">
          <Col md={4} className="mb-3">
              <Card className="feature-card">
                  <Card.Body>
                      <Card.Title>Easy Task Management</Card.Title>
                      <Card.Text>Quickly add, edit, and organize your tasks.</Card.Text>
                  </Card.Body>
              </Card>
          </Col>
           <Col md={4} className="mb-3">
              <Card className="feature-card">
                  <Card.Body>
                      <Card.Title>Stay Organized</Card.Title>
                      <Card.Text>Never miss a deadline with smart reminders (future feature!).</Card.Text>
                  </Card.Body>
              </Card>
          </Col>
           <Col md={4} className="mb-3">
              <Card className="feature-card">
                  <Card.Body>
                      <Card.Title>Accessible Anywhere</Card.Title>
                      <Card.Text>Your tasks sync across all your devices (future feature!).</Card.Text>
                  </Card.Body>
              </Card>
          </Col>
      </Row>
    </Container>
    </>
  );
};
export default LandingPage;