<template>
    <div class="min-h-screen bg-gray-100">
      <app-header />
      
      <div class="py-10">
        <header>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <!-- Loading state -->
            <div v-if="loading" class="py-12 flex justify-center">
              <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            
            <div v-else class="mt-8">
              <!-- Welcome message -->
              <div class="bg-white overflow-hidden shadow rounded-lg mb-8">
                <div class="px-4 py-5 sm:p-6">
                  <h2 class="text-lg leading-6 font-medium text-gray-900">Welcome back, {{ authStore.user?.name }}!</h2>
                  <p class="mt-1 text-sm text-gray-500">
                    Here's an overview of your account and activity.
                  </p>
                </div>
              </div>
              
              <!-- Stats cards -->
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
               
              </div>
              
              <!-- User profile -->
              <div class="mt-8">
                <user-profile :user="authStore.user" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, defineComponent, h } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import AppHeader from '@/components/layout/AppHeader.vue';
  import StatsCard from '@/components/dashboard/StatsCard.vue';
  import UserProfile from '@/components/dashboard/UserProfile.vue';
  
  const authStore = useAuthStore();
  const loading = ref(true);
  
  // Define icons
  const FolderIcon = defineComponent({
    render: () => h('svg', { 
      xmlns: 'http://www.w3.org/2000/svg', 
      fill: 'none', 
      viewBox: '0 0 24 24', 
      stroke: 'currentColor' 
    }, [
      h('path', { 
        'stroke-linecap': 'round', 
        'stroke-linejoin': 'round', 
        'stroke-width': '2', 
        d: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' 
      })
    ])
  });
  
  const CheckIcon = defineComponent({
    render: () => h('svg', { 
      xmlns: 'http://www.w3.org/2000/svg', 
      fill: 'none', 
      viewBox: '0 0 24 24', 
      stroke: 'currentColor' 
    }, [
      h('path', { 
        'stroke-linecap': 'round', 
        'stroke-linejoin': 'round', 
        'stroke-width': '2', 
        d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' 
      })
    ])
  });
  
  const BellIcon = defineComponent({
    render: () => h('svg', { 
      xmlns: 'http://www.w3.org/2000/svg', 
      fill: 'none', 
      viewBox: '0 0 24 24', 
      stroke: 'currentColor' 
    }, [
      h('path', { 
        'stroke-linecap': 'round', 
        'stroke-linejoin': 'round', 
        'stroke-width': '2', 
        d: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' 
      })
    ])
  });
  
  onMounted(async () => {
    try {
      await authStore.fetchUser();
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      loading.value = false;
    }
  });
  </script>
  