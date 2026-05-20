import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';
import './index.css';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User
import UserDashboard from './pages/user/Dashboard';
import Services from './pages/user/Services';
import MyBookings from './pages/user/MyBookings';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageServices from './pages/admin/ManageServices';
import ManageProviders from './pages/admin/ManageProviders';
import AdminBookings from './pages/admin/AdminBookings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* User */}
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><AdminBookings /></ProtectedRoute>} />
          <Route path="/admin/services" element={<ProtectedRoute adminOnly><ManageServices /></ProtectedRoute>} />
          <Route path="/admin/providers" element={<ProtectedRoute adminOnly><ManageProviders /></ProtectedRoute>} />

          {/* Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
