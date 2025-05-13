<template>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-xl font-bold text-blue-600">MyApp</router-link>
            </div>
            <nav class="ml-6 flex space-x-8" v-if="authStore.isAuthenticated">
              <router-link to="/dashboard" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" :class="[$route.path === '/dashboard' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']">
                Dashboard
              </router-link>
              <!-- Add more navigation links as needed -->
            </nav>
          </div>
          <div class="flex items-center">
            <div v-if="authStore.isAuthenticated" class="ml-4 flex items-center md:ml-6">
              <div class="relative">
                <div>
                  <button @click="isProfileMenuOpen = !isProfileMenuOpen" class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" id="user-menu-button">
                    <span class="sr-only">Open user menu</span>
                    <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {{ authStore.user?.name.charAt(0).toUpperCase() }}
                    </div>
                  </button>
                </div>
                <div v-if="isProfileMenuOpen" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu">
                  <div class="px-4 py-2 text-sm text-gray-700 border-b">
                    <div class="font-medium">{{ authStore.user?.name }}</div>
                    <div class="text-gray-500">{{ authStore.user?.email }}</div>
                  </div>
                  <a href="#" @click.prevent="logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</a>
                </div>
              </div>
            </div>
            <div v-else class="flex space-x-4">
              <router-link to="/login" class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Login</router-link>
              <router-link to="/register" class="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Register</router-link>
            </div>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  
  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  const isProfileMenuOpen = ref(false);
  
  const logout = async () => {
    await authStore.logout();
    isProfileMenuOpen.value = false;
    router.push('/login');
  };
  </script>
  