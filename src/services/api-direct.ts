import axios from 'axios';

// Create a new axios instance with direct URLs
const directApi = axios.create({
  baseURL: 'http://47.250.14.113/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Direct CSRF cookie function with error handling
export const getDirectCsrfCookie = async (): Promise<void> => {
  try {
    console.log('Attempting to fetch CSRF cookie...');
    
    // Try using the proxy from vite.config.ts first
    await axios.get('/sanctum/csrf-cookie', {
      withCredentials: true
    });
    
    console.log('CSRF cookie fetched successfully via proxy');
  } catch (proxyError) {
    console.error('Failed to fetch CSRF cookie via proxy:', proxyError);
    
    try {
      // Fall back to direct URL if proxy fails
      console.log('Trying direct URL for CSRF cookie...');
      await axios.get('http://47.250.14.113/sanctum/csrf-cookie', {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
        }
      });
      console.log('CSRF cookie fetched successfully via direct URL');
    } catch (directError) {
      console.error('Failed to fetch CSRF cookie via direct URL:', directError);
      throw directError;
    }
  }
};

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

export default directApi;
