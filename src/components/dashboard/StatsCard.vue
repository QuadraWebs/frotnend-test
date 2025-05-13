v<template>
    <div class="h-full bg-white border-r border-gray-200">
      <div class="h-16 flex items-center px-6 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Dashboard</h2>
      </div>
      <nav class="mt-5 px-3 space-y-1">
        <router-link 
          v-for="item in navigation" 
          :key="item.name" 
          :to="item.href" 
          :class="[
            item.href === $route.path
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
            'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
          ]"
        >
          <component 
            :is="item.icon" 
            :class="[
              item.href === $route.path ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500',
              'mr-3 flex-shrink-0 h-6 w-6'
            ]" 
            aria-hidden="true" 
          />
          {{ item.name }}
        </router-link>
      </nav>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineComponent, h } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  
  // Define icons as render functions
  const HomeIcon = defineComponent({
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
        d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
      })
    ])
  });
  
  const UserIcon = defineComponent({
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
        d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' 
      })
    ])
  });
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
    // Add more navigation items as needed
  ];
  </script>
  