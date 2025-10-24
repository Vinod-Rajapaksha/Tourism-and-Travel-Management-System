// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import GuideFeedback from './pages/GuideFeedback';
import CustomerFeedback from './pages/CustomerFeedback';
import CustomerDashboard from './pages/CustomerDashboard';
import CreateFeedback from './pages/CreateFeedback';
import EditFeedback from './pages/EditFeedback';
import NavBar from './components/NavBar';

// Protected route wrapper for guides
const GuideRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token || role !== 'ROLE_TOUR_GUIDE') {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

// Protected route wrapper for customers
const CustomerRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token || role !== 'ROLE_CUSTOMER') {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Guide Routes */}
        <Route path="/dashboard" element={
          <GuideRoute>
            <Dashboard />
          </GuideRoute>
        } />
        <Route path="/profile" element={
          <GuideRoute>
            <Profile />
          </GuideRoute>
        } />
        <Route path="/feedback" element={
          <GuideRoute>
            <Feedback />
          </GuideRoute>
        } />
        <Route path="/guide-feedback" element={
          <GuideRoute>
            <GuideFeedback />
          </GuideRoute>
        } />
        
        {/* Customer Routes */}
        <Route path="/customer-dashboard" element={
          <CustomerRoute>
            <CustomerDashboard />
          </CustomerRoute>
        } />
        <Route path="/feedback/create" element={
          <CustomerRoute>
            <CreateFeedback />
          </CustomerRoute>
        } />
        <Route path="/feedback/edit/:feedbackId" element={
          <CustomerRoute>
            <EditFeedback />
          </CustomerRoute>
        } />
        <Route path="/customer-feedback" element={
          <CustomerRoute>
            <CustomerFeedback />
          </CustomerRoute>
        } />
        <Route path="/customer-profile" element={
          <CustomerRoute>
            <Profile />
          </CustomerRoute>
        } />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;