// frontend/src/components/AppNavbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming AuthContext is in src/context/
import { Navbar as BootstrapNavbar, Nav, Button, Container } from 'react-bootstrap'; // Alias Navbar to BootstrapNavbar

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-3 app-main-navbar">
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to={user ? "/app/tasks" : "/"}>
          TaskMaster Pro
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <BootstrapNavbar.Text className="me-3">
                  Signed in as: <span className="fw-bold">{user.username}</span>
                </BootstrapNavbar.Text>
                <Button variant="outline-light" onClick={handleLogout} size="sm">Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default AppNavbar;