import axios from 'axios';

// Create a new axios instance with direct URLs
const directApi = axios.create({
  baseURL: 'http://47.250.14.113/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Direct CSRF cookie function with error handling
export const getDirectCsrfCookie = async (): Promise<void> => {
    try {
      console.log('Fetching CSRF cookie...');
      
      // Make a request to the CSRF endpoint
      const response = await axios.get('http://47.250.14.113/sanctum/csrf-cookie');
      
      console.log('CSRF cookie response:', response);
      console.log('Cookies after CSRF request:', document.cookie);
      
      // Check if we got the XSRF-TOKEN cookie
      const xsrfToken = getCookie('XSRF-TOKEN');
      console.log('XSRF-TOKEN cookie:', xsrfToken);
      
      if (!xsrfToken) {
        console.warn('No XSRF-TOKEN cookie found after request');
      }
    } catch (error) {
      console.error('Failed to fetch CSRF cookie:', error);
      throw error;
    }
  };

// Helper function to get cookies
const getCookie = (name: string): string => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop();
      if (cookieValue) {
        return decodeURIComponent(cookieValue.split(';').shift() || '');
      }
    }
    return '';
  };

// Add auth token to requests
directApi.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add CSRF token if available
      const csrfToken = getCookie('XSRF-TOKEN');
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      } else {
        console.warn('No XSRF-TOKEN cookie found when making request');
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default directApi;
