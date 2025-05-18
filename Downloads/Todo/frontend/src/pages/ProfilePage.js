// frontend/src/pages/app/ProfilePage.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, Container, Alert } from 'react-bootstrap';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Container className="text-center mt-5"><p>Loading profile...</p></Container>;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-3">My Profile</h2>
      <Card>
        <Card.Body>
          <Card.Title className="mb-3">User Information</Card.Title>
          <p><strong>Username:</strong> {user.username}</p>
          {/* Add placeholders for future fields */}
          <p><strong>Email:</strong> {user.email || 'Not set'}</p>
          <p><strong>Date of Birth:</strong> Not set</p>
          <p><strong>Profile Picture:</strong> Not set</p>
        </Card.Body>
      </Card>
      <Alert variant="info" className="mt-4">
        More profile editing features (like password change, DOB, profile picture) are coming soon!
      </Alert>
    </Container>
  );
};

export default ProfilePage;