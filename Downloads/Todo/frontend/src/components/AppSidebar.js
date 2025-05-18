// frontend/src/components/AppSidebar.js
import React from 'react';
import { Nav } from 'react-bootstrap';
// import { LinkContainer } from 'react-router-bootstrap'; // Comment out for now
import { Link } from 'react-router-dom'; // Import Link directly
import { FaTasks, FaCalendarDay, FaStar, FaUserCircle } from 'react-icons/fa';

const AppSidebar = () => {
  return (
    <div className="app-sidebar sticky-top pt-3">
      <h5 className="mb-3 px-2">Menu</h5>
      <Nav className="flex-column">
        {/* Replace LinkContainer with Nav.Link and Link component */}
        <Nav.Link as={Link} to="/app/today" className="d-flex align-items-center">
          <FaCalendarDay className="me-2" /> My Day
        </Nav.Link>
        <Nav.Link as={Link} to="/app/important" className="d-flex align-items-center">
          <FaStar className="me-2" /> Important
        </Nav.Link>
        <Nav.Link as={Link} to="/app/tasks" className="d-flex align-items-center">
          <FaTasks className="me-2" /> All Tasks
        </Nav.Link>
        <hr />
        <Nav.Link as={Link} to="/app/profile" className="d-flex align-items-center">
          <FaUserCircle className="me-2" /> My Profile
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default AppSidebar;