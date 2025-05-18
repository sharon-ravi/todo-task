// frontend/src/pages/app/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api'; // Your axios instance for backend calls
import { Form, Button, Card, Alert, Container, Image, Spinner, Row, Col } from 'react-bootstrap';

// === IMPORTANT: Replace with your Cloudinary details ===
const CLOUDINARY_CLOUD_NAME = 'dboocbxrb'; // Your Cloud Name
const CLOUDINARY_UPLOAD_PRESET = 'userprofile'; // The preset name you just created
// ======================================================
const ProfilePage = () => {
  const { user: authUser, login: updateAuthUserContext } = useAuth();

  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    dob: '',
    profilePictureUrl: '', // This will hold the Cloudinary URL
  });
  const [profilePicFile, setProfilePicFile] = useState(null); // The actual file object
  const [previewImage, setPreviewImage] = useState('');    // For local preview or existing Cloudinary URL
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);            // For saving text data
  const [uploading, setUploading] = useState(false);      // For image upload to Cloudinary
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (authUser) {
        setLoading(true);
        setError('');
        try {
          const { data } = await api.get('/users/profile');
          setProfileData({
            username: data.username || '',
            email: data.email || '',
            dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
            profilePictureUrl: data.profilePictureUrl || '',
          });
          setPreviewImage(data.profilePictureUrl || '/default-avatar.png'); // Use your default
        } catch (err) {
          setError('Failed to fetch profile data.');
          console.error("Fetch profile error:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authUser]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Show local preview
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    let finalProfilePictureUrl = profileData.profilePictureUrl; // Start with existing or empty

    // 1. If a new file is selected, upload it to Cloudinary
    if (profilePicFile) {
      setUploading(true);
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', profilePicFile);
      cloudinaryFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      // Add other parameters like 'folder' if not set in preset

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: cloudinaryFormData,
        });
        const cloudinaryData = await response.json();

        if (cloudinaryData.secure_url) {
          finalProfilePictureUrl = cloudinaryData.secure_url; // Get the URL from Cloudinary
          setPreviewImage(finalProfilePictureUrl); // Update preview with Cloudinary URL
        } else {
          throw new Error(cloudinaryData.error?.message || 'Cloudinary upload failed');
        }
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
        setError('Failed to upload profile picture. ' + uploadErr.message);
        setUploading(false);
        setSaving(false);
        return; // Stop if image upload fails
      } finally {
        setUploading(false);
      }
    }

    // 2. Update profile with text data and the (potentially new) image URL
    try {
      const dataToSave = {
        username: profileData.username,
        email: profileData.email,
        dob: profileData.dob,
        profilePictureUrl: finalProfilePictureUrl, // Use the URL from Cloudinary or existing
      };

      const { data: savedUser } = await api.put('/users/profile', dataToSave);
      
      setMessage('Profile updated successfully!');
      setProfileData({ // Update local form state
        username: savedUser.username,
        email: savedUser.email || '',
        dob: savedUser.dob ? new Date(savedUser.dob).toISOString().split('T')[0] : '',
        profilePictureUrl: savedUser.profilePictureUrl || '',
      });
      setProfilePicFile(null); // Clear file input state after successful full save

      // Update AuthContext (simplified - consider a dedicated update function in AuthContext)
      const authContextUserToUpdate = {
          _id: savedUser._id,
          username: savedUser.username,
          profilePictureUrl: savedUser.profilePictureUrl, // For navbar display
          // Keep existing token, email, etc., or fetch full user again for AuthContext
      };
      const existingAuthUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...existingAuthUser, ...authContextUserToUpdate }));
      // A proper update function in AuthContext would call setUser directly.
      // For a quick update to reflect in navbar, a page reload might be needed if not using context properly.
      // updateAuthUserContext({ ...authUser, ...authContextUserToUpdate }); // If your login/updateAuthUser can handle this

    } catch (saveErr) {
      setError(saveErr.response?.data?.message || 'Failed to save profile data.');
      console.error("Save profile error:", saveErr);
    } finally {
      setSaving(false);
    }
  };
  // ... (rest of the JSX from previous ProfilePage example, it should largely remain the same)
  // Make sure the loading, saving, uploading states are used to disable buttons / show spinners
  if (loading) { /* ... */ }
  if (!authUser) { /* ... */ }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Profile</h2>
      {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Row>
        <Col md={4} className="mb-4 text-center">
          <Card>
            <Card.Header as="h5">Profile Picture</Card.Header>
            <Card.Body>
              <Image
                src={previewImage || '/default-avatar.png'} // Provide a default avatar
                alt="Profile"
                roundedCircle
                style={{ width: '150px', height: '150px', objectFit: 'cover', marginBottom: '1rem', border: '2px solid #eee' }}
              />
              <Form.Group controlId="profilePicFile" className="mb-0">
                <Form.Label className="visually-hidden">Change profile picture</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} accept="image/*" size="sm" disabled={uploading || saving} />
                {uploading && <div className="mt-2"><Spinner animation="border" size="sm" /> Uploading to Cloud...</div>}
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header as="h5">User Information</Card.Header>
            <Card.Body>
              <Form onSubmit={handleProfileUpdate}>
                <Form.Group as={Row} controlId="username" className="mb-3">
                  <Form.Label column sm={3} lg={2}>Username</Form.Label>
                  <Col sm={9} lg={10}>
                    <Form.Control
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="email" className="mb-3">
                  <Form.Label column sm={3} lg={2}>Email</Form.Label>
                  <Col sm={9} lg={10}>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={profileData.email}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="dob" className="mb-3">
                  <Form.Label column sm={3} lg={2}>Date of Birth</Form.Label>
                  <Col sm={9} lg={10}>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={profileData.dob}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </Col>
                </Form.Group>
                
                <div className="text-end">
                  <Button variant="primary" type="submit" disabled={saving || uploading}>
                    {saving ? <><Spinner as="span" animation="border" size="sm" /> Saving...</> : 'Save Changes'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          {/* Password Change Card can remain here */}
        </Col>
      </Row>
    </Container>
  );
};
export default ProfilePage;