import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const bookingsAPI = {
  getBookings: () => api.get('/staff/bookings'),
  updateStatus: (bookingId, status) => api.put(`/staff/bookings/${bookingId}/status`, { status }),
  getInspections: (bookingId) => api.get(`/staff/inspections/${bookingId}`),
  createInspection: (data) => api.post('/staff/inspections', data),
  processPayment: async (data) => {
    try {
      const paymentData = {
        ...data,
        amount: Number(data.amount),
        bookingId: data.bookingId,
        paymentMethod: data.paymentMethod
      };
      const response = await api.post('/staff/payments', paymentData);
      return response;
    } catch (error) {
      console.error('Payment request failed:', error);
      throw error;
    }
  },
  getPaymentDetails: async (bookingId) => {
    try {
      const response = await api.get(`/staff/payments/${bookingId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch payment details:', error);
      throw error;
    }
  },
};

export default api; 