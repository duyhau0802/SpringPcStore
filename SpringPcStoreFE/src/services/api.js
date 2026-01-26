import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Check if token is expired before making request
      try {
        // Decode JWT payload (without verification for basic expiry check)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp < currentTime) {
          console.log('Token expired during request, clearing...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Cancel the request and trigger 401 handling
          return Promise.reject({
            response: {
              status: 401,
              data: {
                error: 'Token expired',
                message: 'Your session has expired. Please login again.'
              }
            }
          });
        }
        
        config.headers.Authorization = `Bearer ${token}`;
        console.log('API Request:', {
          url: config.url,
          method: config.method,
          hasToken: true,
          tokenLength: token.length,
          tokenExpiresAt: new Date(payload.exp * 1000).toISOString(),
          headers: config.headers
        });
      } catch (error) {
        console.error('Error parsing token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return Promise.reject({
          response: {
            status: 401,
            data: {
              error: 'Invalid token',
              message: 'Authentication token is invalid.'
            }
          }
        });
      }
    } else {
      console.log('API Request - No token found:', {
        url: config.url,
        method: config.method,
        hasToken: false
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText
    });
    return response;
  },
  (error) => {
    console.log('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || 'Session expired';
      const errorType = error.response?.data?.error || 'authentication_error';
      
      console.log('Authentication error detected:', {
        errorType,
        message: errorMessage,
        url: error.config?.url
      });
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Note: Redux state will be cleared by AuthInitializer on next page load
      // or components will detect localStorage is empty and update accordingly
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/account/signin')) {
        // Show user-friendly message
        if (errorType === 'Token expired') {
          alert('Your session has expired. Please login again.');
        } else {
          alert('Authentication failed. Please login again.');
        }
        
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/account/signin${returnUrl ? '?returnUrl=' + returnUrl : ''}`;
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user'); // Clean up invalid data
      return null;
    }
  },
  getToken: () => localStorage.getItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
  
  // Check if token is expired (basic check)
  isTokenExpired: () => {
    const token = localStorage.getItem('token');
    if (!token) return true;
    
    try {
      // Decode JWT payload (without verification for basic expiry check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true; // Assume expired if can't parse
    }
  },
  
  // Auto logout if token is expired
  checkAndLogout: () => {
    if (authAPI.isTokenExpired()) {
      console.log('Token expired, logging out...');
      authAPI.logout();
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/account/signin')) {
        alert('Your session has expired. Please login again.');
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/account/signin${returnUrl ? '?returnUrl=' + returnUrl : ''}`;
      }
      return true;
    }
    return false;
  }
};

export default api;
