<template>
  <div class="min-h-screen bg-gray-50">
    <app-header />

    <!-- Tax Wizard for first-time users -->
    <tax-wizard v-if="showWizard" @complete="completeWizard" @skip="skipWizard"
      class="transition-all duration-300 ease-in-out" />

    <div class="py-4 sm:py-6">
      <header>
        <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <h1 class="text-xl sm:text-2xl font-bold leading-tight text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <!-- Loading state -->
          <div v-if="loading" class="py-8 flex justify-center">
            <svg class="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </div>

          <div v-else class="mt-4 space-y-4">
            <!-- Welcome message with tax summary -->
            <div class="bg-white overflow-hidden shadow-sm rounded-lg transition-all duration-300 hover:shadow-md">
              <div class="px-4 py-3 sm:p-4">
                <h2 class="text-base leading-6 font-semibold text-gray-900">Welcome back, {{ authStore.user?.name }}!
                </h2>
                <p class="mt-1 text-xs text-gray-600">
                  Here's an overview of your tax situation for the current tax year.
                </p>
                <div class="mt-2 flex flex-wrap items-center">
                  <span class="px-2 py-1 text-xs font-medium rounded-full mb-1 sm:mb-0"
                    :class="taxData.taxStatus === 'Up to date' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                    {{ taxData.taxStatus }}
                  </span>
                  <span class="ml-0 sm:ml-2 text-xs text-gray-500 w-full sm:w-auto">Tax filing status</span>
                </div>
              </div>
            </div>

            <!-- File Taxes with CPA Section -->
            <div class="bg-white overflow-hidden shadow-sm rounded-lg">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-semibold text-gray-900">File your taxes with a CPA</h3>
                    <!-- <p class="mt-1 text-xs text-gray-600">You're 80% done with your tax preparation</p> -->

                    <!-- Progress bar -->
                    <!-- <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2 max-w-xs">
                      <div class="bg-indigo-600 h-2.5 rounded-full" style="width: 80%"></div>
                    </div> -->
                  </div>

                  <div class="flex-shrink-0">
                    <div class="bg-indigo-100 p-3 rounded-full">
                      <DocumentCheckIcon class="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                </div>

                <div class="mt-4">
                  <button
                    class="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out">
                    File Taxes
                  </button>
                </div>
              </div>
            </div>

            <!-- Stats cards - now just 2 cards side by side -->
            <div class="grid grid-cols-2 gap-4">
              <stats-card title="Annual Income" :value="formatCurrency(taxData.annualIncome)"
                description="Total income for current tax year" :icon="DollarIcon" color="bg-blue-500" />

              <stats-card title="Tax Deductions" :value="formatCurrency(taxData.deductions)"
                description="Total deductions claimed" :icon="DocumentIcon" color="bg-green-500" />
            </div>

            <!-- Expenses Summary -->
            <div class="bg-white overflow-hidden shadow-sm rounded-lg">
              <div class="px-4 py-3 border-b border-gray-100">
                <h3 class="text-sm font-semibold text-gray-900">
                  Expenses Summary
                </h3>
              </div>
              <div class="px-4 py-3">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <!-- Chart -->
                  <div class="bg-white rounded-lg p-3 h-64">
                    <canvas ref="expensesChart"></canvas>
                  </div>

                  <!-- Expense Categories -->
                  <div class="grid grid-cols-1 gap-3">
                    <!-- Deductions -->
                    <div class="bg-green-50 rounded-lg p-3">
                      <div class="flex items-center mb-2">
                        <div class="bg-green-500 text-white p-1.5 rounded-md">
                          <CheckCircleIcon class="h-4 w-4" />
                        </div>
                        <h4 class="ml-2 text-xs font-medium text-gray-900">Deductions</h4>
                      </div>
                      <p class="text-base font-semibold text-gray-900">{{
                        formatCurrency(taxData.expensesSummary.deductions) }}</p>
                      <p class="mt-1 text-xs text-gray-600">Expenses that qualify as tax deductions</p>
                    </div>

                    <!-- Possible Deductions -->
                    <div class="bg-yellow-50 rounded-lg p-3">
                      <div class="flex items-center mb-2">
                        <div class="bg-yellow-500 text-white p-1.5 rounded-md">
                          <QuestionMarkCircleIcon class="h-4 w-4" />
                        </div>
                        <h4 class="ml-2 text-xs font-medium text-gray-900">Possible</h4>
                      </div>
                      <p class="text-base font-semibold text-gray-900">{{
                        formatCurrency(taxData.expensesSummary.possible) }}</p>
                      <p class="mt-1 text-xs text-gray-600">Expenses that may qualify with documentation</p>
                    </div>

                    <!-- Non-Deductions -->
                    <div class="bg-red-50 rounded-lg p-3">
                      <div class="flex items-center mb-2">
                        <div class="bg-red-500 text-white p-1.5 rounded-md">
                          <XCircleIcon class="h-4 w-4" />
                        </div>
                        <h4 class="ml-2 text-xs font-medium text-gray-900">Non-Deductions</h4>
                      </div>
                      <p class="text-base font-semibold text-gray-900">{{
                        formatCurrency(taxData.expensesSummary.nonDeductions) }}</p>
                      <p class="mt-1 text-xs text-gray-600">Expenses that don't qualify for tax deductions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tax filing deadlines -->
            <div class="bg-white overflow-hidden shadow-sm rounded-lg">
              <div class="px-4 py-3 border-b border-gray-100">
                <h3 class="text-sm font-semibold text-gray-900">
                  Upcoming Tax Deadlines
                </h3>
              </div>
              <ul class="divide-y divide-gray-100">
                <li v-for="(deadline, index) in taxData.upcomingDeadlines" :key="index"
                  class="transition-colors duration-200 hover:bg-gray-50">
                  <div class="px-4 py-3">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <div class="flex-shrink-0">
                          <CalendarIcon class="h-4 w-4 text-indigo-500" />
                        </div>
                        <div class="ml-3">
                          <p class="text-xs font-medium text-indigo-600 truncate">
                            {{ deadline.name }}
                          </p>
                          <p class="text-xs text-gray-500">
                            Due: {{ deadline.date }}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span class="px-2 py-1 text-xs font-medium rounded-full"
                          :class="deadline.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                          {{ deadline.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Recent transactions -->
            <div class="bg-white overflow-hidden shadow-sm rounded-lg">
              <div class="px-4 py-3 border-b border-gray-100">
                <h3 class="text-sm font-semibold text-gray-900">
                  Recent Income Transactions
                </h3>
              </div>
              <div class="overflow-x-auto">
                <ul class="divide-y divide-gray-100">
                  <li v-for="(transaction, index) in taxData.recentTransactions" :key="index"
                    class="transition-colors duration-200 hover:bg-gray-50">
                    <div class="px-4 py-3">
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="text-xs font-medium text-gray-900 truncate">
                            {{ transaction.client }}
                          </p>
                          <p class="text-xs text-gray-500">
                            {{ transaction.date }} - {{ transaction.category }}
                          </p>
                        </div>
                        <div class="text-xs font-semibold text-green-600">
                          {{ formatCurrency(transaction.amount) }}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Tax Savings Opportunities -->
            <div class="bg-white overflow-hidden shadow-sm rounded-lg">
              <div class="px-4 py-3 border-b border-gray-100">
                <h3 class="text-sm font-semibold text-gray-900">
                  Tax Savings Opportunities
                </h3>
              </div>
              <div class="px-4 py-3">
                <div class="space-y-3">
                  <div v-for="(tip, index) in taxData.taxSavingsTips" :key="index"
                    class="flex p-2 rounded-lg bg-yellow-50">
                    <div class="flex-shrink-0">
                      <LightbulbIcon class="h-4 w-4 text-yellow-500" />
                    </div>
                    <div class="ml-3">
                      <h4 class="text-xs font-medium text-gray-900">{{ tip.title }}</h4>
                      <p class="mt-0.5 text-xs text-gray-600">{{ tip.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- User profile -->
            <div>
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
import TaxWizard from '@/components/onboarding/TaxWizard.vue';
import Chart from 'chart.js/auto';

const authStore = useAuthStore();
const loading = ref(true);
const showWizard = ref(true);
const expensesChart = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const checkFirstTimeUser = () => {
  // In a real app, you might check a flag in the user's profile
  // For now, we'll use localStorage to simulate this
  const hasCompletedWizard = localStorage.getItem('hasCompletedWizard');
  showWizard.value = !hasCompletedWizard;
};

const completeWizard = (formData) => {
  console.log('Wizard completed with data:', formData);
  // Save the data or send it to your backend
  showWizard.value = false;
  console.log('showWizard after completion:', showWizard.value);

  // You might want to refresh the dashboard data based on the user's selections
  // For example:
  // fetchPersonalizedTaxData(formData);
};

const skipWizard = () => {
  console.log('Wizard skipped');
  // Hide the wizard when skipped
  showWizard.value = false;
  console.log('showWizard after skip:', showWizard.value);
};

// Define icons
const DollarIcon = defineComponent({
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
      d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    })
  ])
});

const DocumentIcon = defineComponent({
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
      d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    })
  ])
});

const CalendarIcon = defineComponent({
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
      d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    })
  ])
});

const LightbulbIcon = defineComponent({
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
      d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
    })
  ])
});

// New icons for expense summary
const CheckCircleIcon = defineComponent({
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

const QuestionMarkCircleIcon = defineComponent({
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
      d: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    })
  ])
});

const XCircleIcon = defineComponent({
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
      d: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
    })
  ])
});

const DocumentCheckIcon = defineComponent({
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
      d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
    })
  ])
});

// Dummy tax data in JSON format
const taxData = ref({
  taxStatus: "Up to date",
  annualIncome: 85000,
  estimatedTax: 17000,
  deductions: 12500,
  // New expense summary data
  expensesSummary: {
    deductions: 12500,
    possible: 3800,
    nonDeductions: 5200
  },
  upcomingDeadlines: [
    {
      name: "Quarterly Estimated Tax Payment (Q2)",
      date: "June 15, 2023",
      status: "Completed"
    },
    {
      name: "Quarterly Estimated Tax Payment (Q3)",
      date: "September 15, 2023",
      status: "Pending"
    },
    {
      name: "Annual Tax Return Filing",
      date: "April 15, 2024",
      status: "Pending"
    }
  ],
  recentTransactions: [
    {
      client: "TechCorp Inc.",
      date: "July 15, 2023",
      amount: 4500,
      category: "Web Development"
    },
    {
      client: "Design Studio LLC",
      date: "July 3, 2023",
      amount: 2800,
      category: "UI/UX Design"
    },
    {
      client: "Marketing Solutions",
      date: "June 28, 2023",
      amount: 3200,
      category: "Content Creation"
    },
    {
      client: "Startup Ventures",
      date: "June 15, 2023",
      amount: 5000,
      category: "Consulting"
    }
  ],
  taxSavingsTips: [
    {
      title: "Home Office Deduction",
      description: "You may qualify for a home office deduction if you use part of your home exclusively for business."
    },
    {
      title: "Retirement Contributions",
      description: "Contributing to a SEP IRA or Solo 401(k) can reduce your taxable income significantly."
    },
    {
      title: "Business Expenses Tracking",
      description: "Keep detailed records of all business expenses to maximize your deductions."
    }
  ],
});

// Format currency helper function
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

// Initialize the expenses chart
const initExpensesChart = () => {
  if (!expensesChart.value) return;

  const ctx = expensesChart.value.getContext('2d');
  if (!ctx) return;

  // Destroy existing chart if it exists
  if (chart) {
    chart.destroy();
  }

  const data = {
    labels: ['Deductions', 'Possible', 'Non-Deductions'],
    datasets: [{
      data: [
        taxData.value.expensesSummary.deductions,
        taxData.value.expensesSummary.possible,
        taxData.value.expensesSummary.nonDeductions
      ],
      backgroundColor: [
        'rgba(22, 163, 74, 0.2)',  // Green bg color matching bg-green-50
        'rgba(202, 138, 4, 0.2)',   // Yellow bg color matching bg-yellow-50
        'rgba(220, 38, 38, 0.2)'    // Red bg color matching bg-red-50
      ],
      borderColor: [
        'rgba(22, 163, 74, 1)',     // Green border matching bg-green-500
        'rgba(202, 138, 4, 1)',     // Yellow border matching bg-yellow-500
        'rgba(220, 38, 38, 1)'      // Red border matching bg-red-500
      ],
      borderWidth: 2
    }]
  };

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 12
            },
            padding: 10,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = context.raw as number;
              return `${label}: ${formatCurrency(value)}`;
            }
          }
        }
      },
      cutout: '60%'
    }
  });
};


onMounted(async () => {
  try {
    await authStore.fetchUser();
    showWizard.value = true;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  } finally {
    loading.value = false;
    // Initialize chart after data is loaded
    setTimeout(() => {
      initExpensesChart();
    }, 100);
  }
});
</script>
