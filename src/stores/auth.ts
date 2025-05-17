import { defineStore } from 'pinia';
import directApi, { getDirectCsrfCookie } from '@/services/api-direct';
import axios from 'axios';
interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface LoginData {
  email: string;
  password: string;
}

const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  }
  return undefined;
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') as string | null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null as string | null
  }),
  
  actions: {
    async register(data: RegisterData) {
      this.loading = true;
      this.error = null;
      
      try {
        // Get CSRF cookie using direct function
        await getDirectCsrfCookie();

        // Use direct axios call with hardcoded URL
        const response = await axios.post('http://47.250.14.113/api/register', data, {
          headers: {
            'Accept': 'application/json',
            'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
          },
          withCredentials: true,
        });
        
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Registration failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async login(credentials: LoginData) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('Starting login process...');
        
        // Skip CSRF for now since we're having CORS issues
        // await getDirectCsrfCookie();
        
        console.log('Attempting login...');
        
        // Try using the proxy first
        try {
          const response = await axios.post('/api/login', credentials, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            withCredentials: true,
          });
          
          console.log('Login successful via proxy');
          
          this.user = response.data.user;
          this.token = response.data.token;
          this.isAuthenticated = true;
          
          localStorage.setItem('token', response.data.token);
          
          return response.data;
        } catch (proxyError) {
          console.error('Login via proxy failed:', proxyError);
          
          // Fall back to direct URL
          console.log('Trying direct URL for login...');
          const response = await axios.post('http://47.250.14.113/api/login', credentials, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            withCredentials: true,
          });
          
          console.log('Login successful via direct URL');
          
          this.user = response.data.user;
          this.token = response.data.token;
          this.isAuthenticated = true;
          
          localStorage.setItem('token', response.data.token);
          
          return response.data;
        }
      } catch (error: any) {
        console.error('Login failed completely:', error);
        this.error = error.response?.data?.message || 'Login failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    
    
    async logout() {
      this.loading = true;
      
      try {
        await api.post('/logout');
        // No need to add headers here as the API service already adds them
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem('token');
        this.loading = false;
      }
    },
    
    async fetchUser() {
      if (!this.token) return;
      
      this.loading = true;
      
      try {
        const response = await api.get('/user');
        this.user = response.data;
        this.isAuthenticated = true;
      } catch (error) {
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem('token');
      } finally {
        this.loading = false;
      }
    }
  }
});
