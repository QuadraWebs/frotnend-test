import axios from 'axios';

export async function loginWithoutCsrf(email: string, password: string) {
  console.log('Attempting login without CSRF...');
  
  try {
    // Make login request without CSRF token
    // Note: This will only work if the backend allows it
    const response = await axios.post('http://47.250.14.113/api/login', 
      { email, password },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}
