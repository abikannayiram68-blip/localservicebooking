import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/api';
import { useAuth } from '../../utils/AuthContext';

export default function Register() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Invalid phone (10 digits, starting 6-9)';
    if (!form.address.trim()) errs.address = 'Address is required'; // Address validation
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await register(form);
      loginUser(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      if (err.response) {
        // The server responded with a status code outside the 2xx range
        const serverMessage = err.response.data?.message;
        const serverSqlCode = err.response.data?.code; // If backend forwards mysql error codes

        if (serverSqlCode === 'ER_DUP_ENTRY' || err.response.status === 409) {
          setApiError('This email address is already registered in our system.');
        } else if (err.response.status === 403) {
          setApiError('Access Forbidden (403): Check your server CORS configurations or route permissions.');
        } else {
          setApiError(serverMessage || `Server Error (${err.response.status}). Check backend terminal logs.`);
        }
      } else if (err.request) {
        // The request was made but no response was received (Backend server is offline)
        setApiError('Network Error: Cannot connect to the registration server. Ensure your Node.js app is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setApiError(err.message || 'Registration failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"> ServiceBook</div>
        <p className="auth-subtitle">Create your account</p>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <input name="address" placeholder="Madurai, Tamil Nadu" value={form.address} onChange={handleChange} />
            {errors.address && <p className="form-error">{errors.address}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
            <div className="form-group">
              <label>Phone (optional)</label>
              <input name="phone" placeholder="9876543210" value={form.phone} onChange={handleChange} />
              {errors.phone && <p className="form-error">{errors.phone}</p>}
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider">
          Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
