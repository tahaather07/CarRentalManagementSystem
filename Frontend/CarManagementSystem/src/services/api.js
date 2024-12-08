import axios from 'axios';

const API_BASE_URL = 'https://carrentalmanagementsystem.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
  }
  return config;
});

export const bookingsAPI = {
  getBookings: () => api.get('/staff/bookings'),
  updateStatus: (bookingId, status) => api.put(`/staff/bookings/${bookingId}/status`, { status }),
  getInspections: (bookingId) => api.get(`/staff/inspections/${bookingId}`),
  createInspection: (data) => api.post('/staff/inspections', data),
  processPayment: async (data) => {
    console.log('API: Sending payment request with data:', data);
    try {
      // Ensure the data is properly formatted
      const paymentData = {
        ...data,
        amount: Number(data.amount),
        bookingId: data.bookingId,
        paymentMethod: data.paymentMethod
      };
      
      console.log('API: Formatted payment data:', paymentData);
      const response = await api.post('/staff/payments', paymentData);
      console.log('API: Payment response received:', response.data);
      return response;
    } catch (error) {
      console.error('API: Payment request failed:', error);
      console.error('API: Error response:', error.response?.data);
      throw error;
    }
  },
  getPaymentDetails: async (bookingId) => {
    console.log('API: Fetching payment details for booking:', bookingId);
    try {
      const response = await api.get(`/staff/payments/${bookingId}`);
      console.log('API: Payment details received:', response.data);
      return response;
    } catch (error) {
      console.error('API: Failed to fetch payment details:', error);
      throw error;
    }
  },
};

export default api; 