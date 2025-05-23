import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Unable to connect to the server');
      return Promise.reject(new Error('Unable to connect to the server. Please check your internet connection.'));
    }
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject(new Error('No response from server. Please try again later.'));
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      return Promise.reject(error);
    }
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Product APIs
export const productAPI = {
  getAllProducts: () => api.get('/products'),
  getVendorProducts: () => api.get('/products/vendor'),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  addRating: (id, ratingData) => api.post(`/products/${id}/ratings`, ratingData),
};

// Order APIs
export const orderAPI = {
  getAllOrders: () => api.get('/orders'),
  getCustomerOrders: () => api.get('/orders/customer'),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  assignDelivery: (id, deliveryPersonId) => 
    api.patch(`/orders/${id}/assign-delivery`, { deliveryPersonId }),
};

// User APIs
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getDeliveryPersons: () => api.get('/users/delivery'),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deactivateUser: (id) => api.patch(`/users/${id}/deactivate`),
  reactivateUser: (id) => api.patch(`/users/${id}/reactivate`),
};

export default api; 