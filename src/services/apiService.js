// src/services/apiService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';


// Get auth header for secured endpoints
const authHeader = () => ({ 
  Authorization: `Bearer ${localStorage.getItem('token')}` 
});

// Auth
export const login = async (email, password) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
  
  // Store auth data in localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('role', data.role);
  localStorage.setItem('email', data.email);
  
  // Store role-specific IDs
  if (data.role === 'ROLE_TOUR_GUIDE') {
    localStorage.setItem('guideId', data.guideId);
  } else if (data.role === 'ROLE_CUSTOMER') {
    localStorage.setItem('customerId', data.customerId);
  }
  
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('guideId');
  localStorage.removeItem('customerId');
  localStorage.removeItem('role');
  localStorage.removeItem('email');
  window.location.href = '/login';
};

// Guide Profile
export const getMyProfile = async () => {
  const { data } = await axios.get(`${API_URL}/guides/me`, { 
    headers: authHeader() 
  });
  return data;
};

export const updateMyProfile = async (guideId, payload) => {
  console.log('API: Updating profile for guide:', guideId);
  console.log('API: Payload:', payload);
  console.log('API: URL:', `${API_URL}/guides/${guideId}`);
  console.log('API: Headers:', authHeader());
  
  const { data } = await axios.put(`${API_URL}/guides/${guideId}`, payload, { 
    headers: authHeader() 
  });
  console.log('API: Update response:', data);
  return data;
};

// Customer Profile
export const getMyCustomerProfile = async () => {
  const { data } = await axios.get(`${API_URL}/clients/me`, { 
    headers: authHeader() 
  });
  return data;
};

export const updateMyCustomerProfile = async (customerId, payload) => {
  console.log('API: Updating profile for customer:', customerId);
  console.log('API: Payload:', payload);
  console.log('API: URL:', `${API_URL}/clients/${customerId}`);
  console.log('API: Headers:', authHeader());
  
  const { data } = await axios.put(`${API_URL}/clients/${customerId}`, payload, { 
    headers: authHeader() 
  });
  console.log('API: Update response:', data);
  return data;
};

// Reservations
export const getAssignedReservations = async (guideId, statuses = ['CONFIRMED','PENDING']) => {
  const params = new URLSearchParams();
  statuses.forEach(s => params.append('status', s));
  
  const { data } = await axios.get(
    `${API_URL}/guides/${guideId}/reservations?${params}`, 
    { headers: authHeader() }
  );
  return data;
};

export const markReservationComplete = async (reservationId) => {
  const { data } = await axios.put(
    `${API_URL}/reservations/${reservationId}/complete`, 
    {}, 
    { headers: authHeader() }
  );
  return data;
};

// Feedback
export const getGuideFeedback = async (guideId) => {
  const { data } = await axios.get(
    `${API_URL}/guides/${guideId}/feedback`, 
    { headers: authHeader() }
  );
  return data;
};

export const getReservationFeedback = async (reservationId) => {
  const { data } = await axios.get(
    `${API_URL}/reservations/${reservationId}/feedback`, 
    { headers: authHeader() }
  );
  return data;
};

// Customer Feedback
export const getCustomerFeedback = async (customerId) => {
  const { data } = await axios.get(
    `${API_URL}/customers/${customerId}/feedback`, 
    { headers: authHeader() }
  );
  return data;
};

export const createFeedback = async (customerId, feedbackData) => {
  const { data } = await axios.post(
    `${API_URL}/customers/${customerId}/feedback`, 
    feedbackData,
    { headers: authHeader() }
  );
  return data;
};

export const updateFeedback = async (customerId, feedbackId, feedbackData) => {
  const { data } = await axios.put(
    `${API_URL}/customers/${customerId}/feedback/${feedbackId}`, 
    feedbackData,
    { headers: authHeader() }
  );
  return data;
};

export const deleteFeedback = async (customerId, feedbackId) => {
  console.log('API: Deleting feedback', feedbackId, 'for customer', customerId);
  console.log('API: URL:', `${API_URL}/customers/${customerId}/feedback/${feedbackId}`);
  console.log('API: Headers:', authHeader());
  
  const { data } = await axios.delete(
    `${API_URL}/customers/${customerId}/feedback/${feedbackId}`, 
    { headers: authHeader() }
  );
  console.log('API: Delete response:', data);
  return data;
};

export const getCompletedReservations = async (customerId) => {
  const { data } = await axios.get(
    `${API_URL}/customers/${customerId}/completed-reservations`, 
    { headers: authHeader() }
  );
  return data;
};