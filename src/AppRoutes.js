import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import all your components from their correct locations
import HealthCareLogin from './components/Login/HealthCareLogin';
import DoctorRegister from './components/Doctor/DoctorRegister';
import PatientRegister from './components/Patient/PatientRegister';
import AdminRegister from './components/Admin/AdminRegister';
import AdminDashboard from './components/Admin/AdminDashboard';
import PatientDashboard from './components/Patient/PatientDashboard';
import DoctorDashboard from './components/Doctor/DoctorDashboard';

// This is a placeholder for your actual dashboard page
const DashboardPage = () => <h2>Welcome to the Dashboard!</h2>;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Registration Routes */}
      <Route path="/register/admin" element={<AdminRegister />} />
      <Route path="/register/doctor" element={<DoctorRegister />} />
      <Route path="/register/patient" element={<PatientRegister />} />
      
      {/* Main App Routes */}
      <Route path="/login" element={<HealthCareLogin />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/patient-dashboard" element={<PatientDashboard />} />
      <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      
      {/* Default route */}
      <Route path="/" element={<HealthCareLogin />} />
    </Routes>
  );
};

export default AppRoutes;