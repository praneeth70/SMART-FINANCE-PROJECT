import axios from 'axios';

// Create instance with your backend base URL
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// This automatically attaches your JWT token to every request for security
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth Endpoints
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

// Transaction Endpoints
export const fetchTransactions = () => API.get('/transactions');
export const addTransaction = (data) => API.post('/transactions', data);

// Analytics & Insights
export const fetchHealth = (range = 'month') => API.get(`/analytics/health?range=${range}`);

// Budget Management (The Rules Engine Interface)
export const fetchBudgets = () => API.get('/budgets');
export const setBudget = (data) => API.post('/budgets', data);