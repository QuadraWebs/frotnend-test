<template>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </router-link>
        </p>
      </div>
  
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <app-alert
            v-if="error"
            type="error"
            :message="error"
            @close="error = ''"
          />
  
          <form class="space-y-6" @submit.prevent="handleLogin">
            <div>
              <app-input
                v-model="email"
                label="Email address"
                type="email"
                required
                :error="emailError"
              />
            </div>
  
            <div>
              <app-input
                v-model="password"
                label="Password"
                type="password"
                required
                :error="passwordError"
              />
            </div>
  
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
  
              <div class="text-sm">
                <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>
  
            <div>
              <app-button
                type="submit"
                :loading="loading"
                fullWidth
              >
                Sign in
              </app-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { directLogin } from '@/services/direct-login';
  import AppInput from '@/components/common/AppInput.vue';
  import AppButton from '@/components/common/AppButton.vue';
  import AppAlert from '@/components/common/AppAlert.vue';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const email = ref('');
  const password = ref('');
  const error = ref('');
  const emailError = ref('');
  const passwordError = ref('');
  const loading = ref(false);
  
  const validateForm = () => {
    let isValid = true;
    emailError.value = '';
    passwordError.value = '';
  
    if (!email.value) {
      emailError.value = 'Email is required';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
      emailError.value = 'Please enter a valid email address';
      isValid = false;
    }
  
    if (!password.value) {
      passwordError.value = 'Password is required';
      isValid = false;
    }
  
    return isValid;
  };
  
  async function handleLogin() {
    try {
      loading.value = true;
      error.value = null;
      
      // Try the store method first
      try {
        await authStore.login(credentials);
        router.push('/dashboard');
      } catch (storeError) {
        console.error('Store login failed, trying direct login:', storeError);
        
        // Fall back to direct login
        const response = await directLogin(credentials.email, credentials.password);
        
        // Manually update the store
        authStore.user = response.user;
        authStore.token = response.token;
        authStore.isAuthenticated = true;
        localStorage.setItem('token', response.token);
        
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Login failed completely:', error);
      error.value = error.response?.data?.message || 'Login failed. Please check your credentials.';
    } finally {
      loading.value = false;
    }
  }
  </script>
  