// src/App.js
import './App.css';
import React from 'react';
import Home from './Components/Home';
import NavBar from './Components/NavBar';
import Login from './Components/Login'; 
import Signup from './Components/Signup'; 
import JobSeekerDashboard from './Components/JobSeekerDashboard';
import EmployerDashboard from './Components/EmployerDashboard';
import JobSeekerProfile from './Components/JobSeekerProfile'; 
import EmployerProfile from './Components/EmployerProfile.js'; 
import CreateJob from './Components/CreateJobListing';  
import JobSeekerJobListings from './Components/JobSeekerJobListings.js';
import ResetPassword from './Components/ResetPassword.js';
import Footer from './Components/Footer';
import AdminDashboard from './Components/AdminDashboard'; // New Admin Dashboard
import ViewApplications from './Components/ViewApplications'; // Import the ViewApplications page
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

const UserTypeRoute = ({ children, allowedTypes }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!allowedTypes.includes(user.userType)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <div className="content-wrap">
        <Routes>
          <Route path="/" element={<Navigate replace to="/Home" />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/job-seeker-dashboard" element={
            <UserTypeRoute allowedTypes={['jobSeeker']}>
              <JobSeekerDashboard />
            </UserTypeRoute>
          } />

          <Route path="/employer-dashboard" element={
            <UserTypeRoute allowedTypes={['employer']}>
              <EmployerDashboard />
            </UserTypeRoute>
          } />

          <Route path="/update-profile" element={
            <UserTypeRoute allowedTypes={['jobSeeker']}>
              <JobSeekerProfile />
            </UserTypeRoute>
          } />

          <Route path="/manage-employer-profile" element={
            <UserTypeRoute allowedTypes={['employer']}>
              <EmployerProfile />
            </UserTypeRoute>
          } />

          <Route path="/create-job" element={
            <UserTypeRoute allowedTypes={['employer']}>
              <CreateJob />
            </UserTypeRoute>
          } />

          <Route path="/job-listings" element={
            <ProtectedRoute>
              <JobSeekerJobListings />
            </ProtectedRoute>
          } />

          {/* New View Applications Route */}
          <Route path="/view-applications" element={
            <UserTypeRoute allowedTypes={['employer']}>
              <ViewApplications />
            </UserTypeRoute>
          } />

          {/* New Admin Dashboard Route */}
          <Route path="/admin" element={
            <UserTypeRoute allowedTypes={['admin']}>
              <AdminDashboard />
            </UserTypeRoute>
          } />

          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
