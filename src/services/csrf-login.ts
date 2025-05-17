import axios from 'axios';

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

export async function csrfLogin(email: string, password: string) {
  console.log('Starting CSRF-aware login process...');
  
  try {
    // Step 1: Get CSRF cookie
    console.log('Fetching CSRF cookie...');
    await axios.get('http://47.250.14.113/sanctum/csrf-cookie', {
      withCredentials: true
    });
    
    // Step 2: Get the CSRF token from cookies
    const csrfToken = getCookie('XSRF-TOKEN');
    console.log('CSRF Token:', csrfToken);
    
    if (!csrfToken) {
      console.warn('No CSRF token found in cookies');
    }
    
    // Step 3: Make login request with CSRF token
    console.log('Sending login request with CSRF token...');
    const response = await axios.post('http://47.250.14.113/api/login', 
      { email, password },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken
        },
        withCredentials: true
      }
    );
    
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('CSRF-aware login failed:', error);
    throw error;
  }
}
