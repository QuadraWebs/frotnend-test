<template>
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Chat toggle button (now green) -->
    <button 
      @click="chatStore.toggleChat"
      class="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 flex items-center justify-center"
      :class="{ 'rotate-45': chatStore.isOpen }"
    >
      <ChatBubbleLeftRightIcon v-if="!chatStore.isOpen" class="h-6 w-6" />
      <XMarkIcon v-else class="h-6 w-6" />
    </button>

    <!-- Chat window -->
    <div 
      v-show="chatStore.isOpen" 
      class="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 transform origin-bottom-right"
      :class="{ 'scale-100 opacity-100': chatStore.isOpen, 'scale-95 opacity-0': !chatStore.isOpen }"
    >
      <!-- Chat header (now green) -->
      <div class="bg-green-600 text-white p-3 rounded-t-lg flex items-center justify-between">
        <div class="flex items-center">
          <div class="bg-white p-1 rounded-full mr-2">
            <ChatBubbleLeftRightIcon class="h-5 w-5 text-green-600" />
          </div>
          <h3 class="font-medium text-sm">Tax Assistant</h3>
        </div>
        <div class="flex">
          <button @click="chatStore.minimizeChat" class="text-white hover:text-green-200">
            <MinusSmallIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Chat messages -->
      <div class="h-80 overflow-y-auto p-3 bg-gray-50" ref="messagesContainer">
        <div v-for="(message, index) in chatStore.messages" :key="index" class="mb-3">
          <div 
            :class="[
              'max-w-[80%] rounded-lg p-2 text-sm', 
              message.isBot 
                ? 'bg-gray-200 text-gray-800 mr-auto' 
                : 'bg-green-600 text-white ml-auto'
            ]"
          >
            {{ message.text }}
          </div>
          <div 
            :class="[
              'text-xs mt-1', 
              message.isBot ? 'text-left' : 'text-right'
            ]"
          >
            {{ message.time }}
          </div>
        </div>
      </div>

      <!-- Chat input -->
      <div class="p-3 border-t border-gray-200">
        <div class="flex">
          <input 
            v-model="newMessage" 
            @keyup.enter="sendMessage"
            type="text" 
            placeholder="Type your message..." 
            class="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button 
            @click="sendMessage"
            class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-r-lg transition-colors duration-150"
          >
            <PaperAirplaneIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


  <script setup lang="ts">
  import { ref, onMounted, nextTick, defineComponent, h, watch } from 'vue';
  import { useChatStore } from '@/stores/chat';
  
  // Icons
  const ChatBubbleLeftRightIcon = defineComponent({
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
        d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
      })
    ])
  });
  
  const XMarkIcon = defineComponent({
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
        d: 'M6 18L18 6M6 6l12 12'
      })
    ])
  });
  
  const MinusSmallIcon = defineComponent({
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
        d: 'M18 12H6'
      })
    ])
  });
  
  const PaperAirplaneIcon = defineComponent({
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
        d: 'M14 5l7 7m0 0l-7 7m7-7H3'
      })
    ])
  });
  
  // State
  const chatStore = useChatStore();
  const newMessage = ref('');
  const messagesContainer = ref<HTMLElement | null>(null);
  
  // Methods
  function sendMessage() {
    if (!newMessage.value.trim()) return;
    
    // Add user message
    chatStore.addMessage({
      text: newMessage.value,
      isBot: false,
      time: chatStore.formatTime(new Date())
    });
    
    const userQuestion = newMessage.value;
    newMessage.value = '';
    
    // Scroll to bottom after sending message
    nextTick(() => {
      scrollToBottom();
    });
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponses = {
        'hello': "Hi there! How can I assist with your taxes today?",
        'tax': "I can help with tax-related questions. What specific information do you need?",
        'deduction': "There are several deductions you might qualify for. Would you like to know about home office, business expenses, or retirement contributions?",
        'deadline': "The next tax deadline is September 15, 2023 for Q3 estimated tax payments. Annual tax returns are due April 15, 2024.",
        'help': "I can help with tax deadlines, deductions, filing status, and general tax advice. What do you need help with?"
      };
      
      // Simple keyword matching for demo purposes
      let botReply = "I'm not sure how to help with that specific question. Would you like to know about tax deadlines, deductions, or filing status?";
      
      for (const [keyword, response] of Object.entries(botResponses)) {
        if (userQuestion.toLowerCase().includes(keyword)) {
          botReply = response;
          break;
        }
      }
      
      chatStore.addMessage({
        text: botReply,
        isBot: true,
        time: chatStore.formatTime(new Date())
      });
      
      // Scroll to bottom after receiving response
      nextTick(() => {
        scrollToBottom();
      });
    }, 1000);
  }
  
  function scrollToBottom() {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  }
  
  // Watch for changes in the chat state to scroll to bottom when opened
  watch(() => chatStore.isOpen, (isOpen) => {
    if (isOpen) {
      nextTick(() => {
        scrollToBottom();
      });
    }
  });
  
  // Watch for new messages to scroll to bottom
  watch(() => chatStore.messages.length, () => {
    nextTick(() => {
      scrollToBottom();
    });
  });
  
  onMounted(() => {
    // Initial scroll to bottom
    nextTick(() => {
      scrollToBottom();
    });
  });
  </script>
  