// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Container, Spinner } from 'react-bootstrap'; // For UI components

// Layouts and Components - We will verify these paths exist in later steps
import RouteBackgroundManager from './components/RouteBackgroundManager';
import AppLayout from './layouts/AppLayout';
// import AppNavbar from './components/AppNavbar'; // We'll handle AppNavbar specifically later

// Pages - We will verify these paths exist in later steps
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

import TasksPage from './pages/app/TasksPage';
import ProfilePage from './pages/app/ProfilePage';
import TodayPage from './pages/app/TodayPage';
import ImportantPage from './pages/app/ImportantPage';

// Your App.css or other global styles
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh'}}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <>
      {/* Navbar is typically handled by AppLayout or specific pages like LandingPage */}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/app/tasks" /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/app/tasks" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/app/tasks" /> : <RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
            <Route path="tasks" element={<TasksPage />} />
            <Route path="today" element={<TodayPage />} />
            <Route path="important" element={<ImportantPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route index element={<Navigate to="tasks" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}



// ...
function App() {
  return (
    <Router>
      <AuthProvider>
        <RouteBackgroundManager /> {/* PLACE IT HERE */}
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
// ...
export default App;