import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Services
export const getServices = () => API.get('/services');
export const getServicesAdmin = () => API.get('/services/admin/all');
export const createService = (data) => API.post('/services', data);
export const updateService = (id, data) => API.put(`/services/${id}`, data);
export const deleteService = (id) => API.delete(`/services/${id}`);

// Bookings
export const getBookings = () => API.get('/bookings');
export const getAllBookings = () => API.get('/bookings/all');
export const createBooking = (data) => API.post('/bookings', data);
export const updateBooking = (id, data) => API.put(`/bookings/${id}`, data);

// Providers
export const getProviders = () => API.get('/providers');
export const createProvider = (data) => API.post('/providers', data);
export const updateProvider = (id, data) => API.put(`/providers/${id}`, data);
export const deleteProvider = (id) => API.delete(`/providers/${id}`);

// Dashboard
export const getUserDashboard = () => API.get('/dashboard/user');
export const getAdminDashboard = () => API.get('/dashboard/admin');

export default API;
