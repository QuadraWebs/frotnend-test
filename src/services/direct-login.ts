import axios from 'axios';

export async function directLogin(email: string, password: string) {
  console.log('Attempting direct login without CSRF...');
  
  try {
    const response = await axios.post('http://47.250.14.113/api/login', 
      { email, password },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Direct login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Direct login failed:', error);
    throw error;
  }
}
