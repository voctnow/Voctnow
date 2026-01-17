import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth APIs
export const sendOTP = (phone) => API.post('/auth/send-otp', { phone });
export const verifyOTP = (phone, otp) => API.post('/auth/verify-otp', { phone, otp });
export const signup = (userData) => API.post('/auth/signup', userData);
export const getUser = (userId) => API.get(`/auth/user/${userId}`);
export const updateUser = (userId, updates) => API.put(`/auth/user/${userId}`, updates);

// Services APIs
export const getServices = () => API.get('/services');
export const getService = (serviceId) => API.get(`/services/${serviceId}`);
export const getPricing = () => API.get('/pricing');

// Assessment APIs
export const createAssessment = (data) => API.post('/assessment', data);
export const getAssessment = (assessmentId) => API.get(`/assessment/${assessmentId}`);

// Booking APIs
export const createBooking = (data) => API.post('/booking', data);
export const getBooking = (bookingId) => API.get(`/booking/${bookingId}`);
export const getUserBookings = (userId) => API.get(`/bookings/user/${userId}`);

// Payment APIs
export const createPaymentOrder = (data) => API.post('/payment/create-order', data);
export const verifyPayment = (data) => API.post('/payment/verify', data);
export const mockPaymentSuccess = (bookingId) => API.post(`/payment/mock-success/${bookingId}`);

// Practitioner APIs
export const applyAsPractitioner = (data) => API.post('/practitioner/apply', data);
export const uploadCertificate = (practitionerId, file, certificateType) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('certificate_type', certificateType);
  return API.post(`/practitioner/${practitionerId}/upload-certificate`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Contact APIs
export const submitContact = (data) => API.post('/contact', data);

export default API;
