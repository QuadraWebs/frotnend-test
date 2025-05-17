import axios from 'axios';

// Create a new axios instance with direct URLs
const directApi = axios.create({
  baseURL: 'http://47.250.14.113/api',
  headers: {
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Direct CSRF cookie function
export const getDirectCsrfCookie = async (): Promise<void> => {
  try {
    await axios.get('http://47.250.14.113/sanctum/csrf-cookie', {
      withCredentials: true
    });
  } catch (error) {
    console.error('Failed to fetch CSRF cookie:', error);
  }
};

// Add auth token to requests
directApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token if available
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to get cookies
const getCookie = (name: string): string => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop();
    if (cookieValue) {
      return cookieValue.split(';').shift() || '';
    }
  }
  return '';
};

export default directApi;
