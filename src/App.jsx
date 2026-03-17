import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { ROLES } from './utils/roleHelpers';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Unauthorized from './pages/errors/Unauthorized';

// Main Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import MyPrescriptions from './pages/patient/MyPrescriptions';
import PatientProfile from './pages/patient/PatientProfile';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';


const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Patient Routes */}
          <Route path="/patient" element={<ProtectedRoute allowedRoles={[ROLES.PATIENT]}><Layout /></ProtectedRoute>}>
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="book" element={<BookAppointment />} />
            <Route path="appointments" element={<MyAppointments />} />
            <Route path="prescriptions" element={<MyPrescriptions />} />
            <Route path="profile" element={<PatientProfile />} />
          </Route>

          {/* Doctor Routes */}
          <Route path="/doctor" element={<ProtectedRoute allowedRoles={[ROLES.DOCTOR]}><Layout /></ProtectedRoute>}>
            <Route path="dashboard" element={<DoctorDashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><Layout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
