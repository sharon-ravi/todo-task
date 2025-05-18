// frontend/src/layouts/AppLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar'; // Your existing Navbar, maybe renamed/refactored
import AppSidebar from '../components/AppSidebar'; // A new component
import { Container, Row, Col } from 'react-bootstrap'; // Or your preferred layout system
import './AppLayout.css'; // For styling the layout

const AppLayout = () => {
  return (
    <>
      <AppNavbar /> {/* Or a specific AppNavbar */}
      <Container fluid className="app-container"> {/* fluid for full width */}
        <Row className="app-row">
          <Col md={3} lg={2} className="app-sidebar-col bg-light"> {/* Adjust breakpoint and width */}
            <AppSidebar />
          </Col>
          <Col md={9} lg={10} className="app-main-content-col">
            <main className="py-3"> {/* Add some padding */}
               <Outlet /> {/* This is where the nested route components will render */}
            </main>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AppLayout;