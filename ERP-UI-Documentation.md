# ERP UI Documentation - PrimeVue & Vue.js

## Table of Contents
1. [Overview](#overview)
2. [Project Setup](#project-setup)
3. [Layout System](#layout-system)
4. [Navigation Components](#navigation-components)
5. [Dashboard & Widgets](#dashboard--widgets)
6. [CRUD Operations](#crud-operations)
7. [Data Components](#data-components)
8. [Forms & Validation](#forms--validation)
9. [Advanced Components](#advanced-components)
10. [Best Practices](#best-practices)

## Overview

This documentation covers the implementation of a modern ERP UI using Vue 3 and PrimeVue components. The architecture focuses on modularity, reusability, and maintainability.

### Key Technologies
- **Vue 3** - Progressive JavaScript Framework
- **PrimeVue** - Rich UI Component Library
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **PrimeIcons** - Icon library
- **PrimeFlex** - CSS utility library

## Project Setup

### Installation

```bash
npm create vue@latest erp-ui
cd erp-ui
npm install primevue primeicons primeflex
npm install @primevue/themes
```

### Main Configuration

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// Import PrimeVue components globally (optional)
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark-mode'
        }
    }
})

// Register components globally
app.component('Button', Button)
app.component('DataTable', DataTable)
app.component('Column', Column)

app.mount('#app')
```

## Layout System

### Main Layout Structure

The ERP layout consists of a header, sidebar, and main content area with responsive behavior.

```vue
<!-- layouts/MainLayout.vue -->
<template>
  <div class="layout-wrapper">
    <!-- Top Bar -->
    <div class="layout-topbar">
      <Button 
        icon="pi pi-bars" 
        @click="toggleSidebar" 
        class="p-button-rounded p-button-text"
      />
      <div class="layout-topbar-logo">
        <img src="/logo.svg" alt="ERP Logo" />
        <span>ERP System</span>
      </div>
      <div class="layout-topbar-menu">
        <Button icon="pi pi-bell" badge="3" class="p-button-rounded p-button-text" />
        <Button icon="pi pi-user" @click="toggleUserMenu" class="p-button-rounded p-button-text" />
      </div>
    </div>

    <!-- Sidebar -->
    <div :class="sidebarClass">
      <ScrollPanel style="height: 100%">
        <AppMenu />
      </ScrollPanel>
    </div>

    <!-- Main Content -->
    <div class="layout-main">
      <router-view />
    </div>

    <!-- Footer -->
    <div class="layout-footer">
      <span>&copy; 2024 ERP System. All rights reserved.</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ScrollPanel from 'primevue/scrollpanel'
import AppMenu from '@/components/AppMenu.vue'

const sidebarVisible = ref(true)
const staticMenuInactive = ref(false)

const sidebarClass = computed(() => ({
  'layout-sidebar': true,
  'layout-sidebar-inactive': !sidebarVisible.value || staticMenuInactive.value
}))

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

const toggleUserMenu = (event) => {
  // User menu implementation
}
</script>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
}

.layout-topbar {
  position: fixed;
  height: 70px;
  z-index: 997;
  left: 0;
  top: 0;
  width: 100%;
  padding: 0 2rem;
  background-color: var(--surface-card);
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.layout-sidebar {
  position: fixed;
  width: 280px;
  height: calc(100vh - 70px);
  z-index: 996;
  overflow-y: auto;
  top: 70px;
  left: 0;
  background-color: var(--surface-ground);
  border-right: 1px solid var(--surface-border);
  transition: transform 0.3s;
}

.layout-sidebar-inactive {
  transform: translateX(-100%);
}

.layout-main {
  margin-left: 280px;
  padding-top: 70px;
  min-height: calc(100vh - 70px);
  transition: margin-left 0.3s;
}

.layout-sidebar-inactive ~ .layout-main {
  margin-left: 0;
}

@media (max-width: 991px) {
  .layout-sidebar {
    transform: translateX(-100%);
  }
  
  .layout-sidebar:not(.layout-sidebar-inactive) {
    transform: translateX(0);
  }
  
  .layout-main {
    margin-left: 0;
  }
}
</style>
```

## Navigation Components

### Sidebar Menu Component

```vue
<!-- components/AppMenu.vue -->
<template>
  <ul class="layout-menu">
    <li v-for="item in menu" :key="item.label" :class="{ 'active-menuitem': isActive(item) }">
      <div v-if="item.items" class="layout-menuitem-root-text" @click="toggleSubmenu(item)">
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
        <i class="pi pi-angle-down layout-submenu-toggler"></i>
      </div>
      <router-link v-else :to="item.to" class="layout-menuitem-link">
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </router-link>
      
      <Transition name="layout-submenu">
        <ul v-if="item.items && item.expanded" class="layout-submenu">
          <li v-for="subitem in item.items" :key="subitem.label">
            <router-link :to="subitem.to" class="layout-menuitem-link">
              <i :class="subitem.icon"></i>
              <span>{{ subitem.label }}</span>
            </router-link>
          </li>
        </ul>
      </Transition>
    </li>
  </ul>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menu = reactive([
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    to: '/dashboard'
  },
  {
    label: 'Inventory',
    icon: 'pi pi-box',
    expanded: false,
    items: [
      { label: 'Products', icon: 'pi pi-tag', to: '/inventory/products' },
      { label: 'Categories', icon: 'pi pi-folder', to: '/inventory/categories' },
      { label: 'Stock', icon: 'pi pi-chart-line', to: '/inventory/stock' },
      { label: 'Warehouses', icon: 'pi pi-building', to: '/inventory/warehouses' }
    ]
  },
  {
    label: 'Sales',
    icon: 'pi pi-shopping-cart',
    expanded: false,
    items: [
      { label: 'Orders', icon: 'pi pi-list', to: '/sales/orders' },
      { label: 'Invoices', icon: 'pi pi-file', to: '/sales/invoices' },
      { label: 'Customers', icon: 'pi pi-users', to: '/sales/customers' },
      { label: 'Reports', icon: 'pi pi-chart-bar', to: '/sales/reports' }
    ]
  },
  {
    label: 'Finance',
    icon: 'pi pi-wallet',
    expanded: false,
    items: [
      { label: 'Transactions', icon: 'pi pi-money-bill', to: '/finance/transactions' },
      { label: 'Accounts', icon: 'pi pi-credit-card', to: '/finance/accounts' },
      { label: 'Budgets', icon: 'pi pi-calculator', to: '/finance/budgets' }
    ]
  },
  {
    label: 'HR',
    icon: 'pi pi-users',
    expanded: false,
    items: [
      { label: 'Employees', icon: 'pi pi-user', to: '/hr/employees' },
      { label: 'Departments', icon: 'pi pi-sitemap', to: '/hr/departments' },
      { label: 'Payroll', icon: 'pi pi-dollar', to: '/hr/payroll' },
      { label: 'Leave Management', icon: 'pi pi-calendar', to: '/hr/leaves' }
    ]
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    to: '/settings'
  }
])

const toggleSubmenu = (item) => {
  item.expanded = !item.expanded
}

const isActive = (item) => {
  return route.path === item.to || (item.items && item.items.some(subitem => route.path === subitem.to))
}
</script>

<style scoped>
.layout-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.layout-menuitem-root-text {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 1rem;
  color: var(--text-color);
  transition: background-color 0.2s;
}

.layout-menuitem-root-text:hover {
  background-color: var(--surface-hover);
}

.layout-menuitem-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 1rem;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.2s;
}

.layout-menuitem-link:hover {
  background-color: var(--surface-hover);
}

.layout-menuitem-link i,
.layout-menuitem-root-text i {
  margin-right: 0.5rem;
  width: 1rem;
}

.layout-submenu-toggler {
  margin-left: auto;
  transition: transform 0.3s;
}

.layout-menuitem-root-text:has(+ .layout-submenu) .layout-submenu-toggler {
  transform: rotate(180deg);
}

.layout-submenu {
  list-style: none;
  margin: 0;
  padding: 0 0 0 1rem;
  overflow: hidden;
}

.layout-submenu-enter-active,
.layout-submenu-leave-active {
  transition: max-height 0.3s ease-in-out;
}

.layout-submenu-enter-from,
.layout-submenu-leave-to {
  max-height: 0;
}

.layout-submenu-enter-to,
.layout-submenu-leave-from {
  max-height: 500px;
}

.active-menuitem > .layout-menuitem-link,
.active-menuitem > .layout-menuitem-root-text {
  background-color: var(--primary-color);
  color: var(--primary-color-text);
}
</style>
```

## Dashboard & Widgets

### Dashboard Page

```vue
<!-- views/Dashboard.vue -->
<template>
  <div class="dashboard">
    <div class="grid">
      <!-- KPI Cards -->
      <div class="col-12 lg:col-6 xl:col-3">
        <StatsCard 
          title="Total Revenue" 
          :value="formatCurrency(2456789)" 
          icon="pi pi-dollar"
          :percentage="12.5"
          trend="up"
          color="blue"
        />
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <StatsCard 
          title="New Orders" 
          :value="345" 
          icon="pi pi-shopping-cart"
          :percentage="-2.3"
          trend="down"
          color="orange"
        />
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <StatsCard 
          title="Active Users" 
          :value="1234" 
          icon="pi pi-users"
          :percentage="8.7"
          trend="up"
          color="green"
        />
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <StatsCard 
          title="Pending Tasks" 
          :value="67" 
          icon="pi pi-clock"
          :percentage="0"
          trend="neutral"
          color="purple"
        />
      </div>

      <!-- Revenue Chart -->
      <div class="col-12 xl:col-8">
        <Card>
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <span>Revenue Overview</span>
              <SelectButton v-model="chartPeriod" :options="periods" optionLabel="label" />
            </div>
          </template>
          <template #content>
            <Chart type="line" :data="revenueData" :options="chartOptions" style="height: 400px" />
          </template>
        </Card>
      </div>

      <!-- Recent Activities -->
      <div class="col-12 xl:col-4">
        <Card>
          <template #title>Recent Activities</template>
          <template #content>
            <Timeline :value="activities">
              <template #content="slotProps">
                <div class="activity-item">
                  <span class="activity-time">{{ slotProps.item.time }}</span>
                  <p class="activity-text">{{ slotProps.item.text }}</p>
                </div>
              </template>
            </Timeline>
          </template>
        </Card>
      </div>

      <!-- Recent Orders Table -->
      <div class="col-12">
        <Card>
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <span>Recent Orders</span>
              <Button label="View All" icon="pi pi-arrow-right" class="p-button-text" />
            </div>
          </template>
          <template #content>
            <DataTable :value="recentOrders" responsiveLayout="scroll">
              <Column field="orderId" header="Order ID" :sortable="true"></Column>
              <Column field="customer" header="Customer" :sortable="true"></Column>
              <Column field="date" header="Date" :sortable="true">
                <template #body="slotProps">
                  {{ formatDate(slotProps.data.date) }}
                </template>
              </Column>
              <Column field="amount" header="Amount" :sortable="true">
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.amount) }}
                </template>
              </Column>
              <Column field="status" header="Status">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                </template>
              </Column>
              <Column :exportable="false" style="min-width:8rem">
                <template #body>
                  <Button icon="pi pi-eye" class="p-button-rounded p-button-text" />
                  <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-warning" />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import Timeline from 'primevue/timeline'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import SelectButton from 'primevue/selectbutton'
import Tag from 'primevue/tag'
import StatsCard from '@/components/widgets/StatsCard.vue'

// Chart data
const chartPeriod = ref({ label: 'Monthly', value: 'monthly' })
const periods = ref([
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' }
])

const revenueData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue',
      data: [65000, 59000, 80000, 81000, 56000, 95000, 120000, 110000, 95000, 105000, 125000, 135000],
      fill: true,
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      tension: 0.4
    }
  ]
})

const chartOptions = ref({
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return '$' + value.toLocaleString()
        }
      }
    }
  }
})

// Activities data
const activities = ref([
  { time: '2 mins ago', text: 'New order #12458 received' },
  { time: '15 mins ago', text: 'Product SKU-1234 stock updated' },
  { time: '1 hour ago', text: 'Customer John Doe registered' },
  { time: '3 hours ago', text: 'Monthly report generated' }
])

// Orders data
const recentOrders = ref([
  { orderId: '#12458', customer: 'John Doe', date: new Date(), amount: 1250.00, status: 'Completed' },
  { orderId: '#12457', customer: 'Jane Smith', date: new Date(), amount: 850.50, status: 'Processing' },
  { orderId: '#12456', customer: 'Bob Johnson', date: new Date(), amount: 2100.00, status: 'Pending' },
  { orderId: '#12455', customer: 'Alice Brown', date: new Date(), amount: 750.25, status: 'Completed' },
  { orderId: '#12454', customer: 'Charlie Wilson', date: new Date(), amount: 1800.00, status: 'Cancelled' }
])

// Utility functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const getStatusSeverity = (status) => {
  const severities = {
    'Completed': 'success',
    'Processing': 'warning',
    'Pending': 'info',
    'Cancelled': 'danger'
  }
  return severities[status]
}
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}

.activity-item {
  margin-bottom: 1rem;
}

.activity-time {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.activity-text {
  margin: 0.25rem 0 0;
}
</style>
```

### Stats Card Widget

```vue
<!-- components/widgets/StatsCard.vue -->
<template>
  <Card :class="cardClass">
    <template #content>
      <div class="flex align-items-center">
        <div class="flex-1">
          <span class="block text-500 font-medium mb-3">{{ title }}</span>
          <div class="text-900 font-medium text-3xl">{{ value }}</div>
          <div class="flex align-items-center mt-3" v-if="percentage !== null">
            <span :class="percentageClass">
              <i :class="trendIcon" class="text-xs mr-1"></i>
              {{ Math.abs(percentage) }}%
            </span>
            <span class="text-500 ml-2">vs last period</span>
          </div>
        </div>
        <div :class="iconClass">
          <i :class="icon"></i>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from 'primevue/card'

const props = defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  percentage: Number,
  trend: {
    type: String,
    default: 'neutral'
  },
  color: {
    type: String,
    default: 'blue'
  }
})

const cardClass = computed(() => `stats-card stats-card-${props.color}`)

const iconClass = computed(() => `flex align-items-center justify-content-center stats-icon bg-${props.color}-100 text-${props.color}-500`)

const percentageClass = computed(() => {
  if (props.trend === 'up') return 'text-green-500 font-medium'
  if (props.trend === 'down') return 'text-red-500 font-medium'
  return 'text-500 font-medium'
})

const trendIcon = computed(() => {
  if (props.trend === 'up') return 'pi pi-arrow-up'
  if (props.trend === 'down') return 'pi pi-arrow-down'
  return 'pi pi-minus'
})
</script>

<style scoped>
.stats-card {
  border-radius: 12px;
  overflow: hidden;
}

.stats-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 10px;
}

.stats-icon i {
  font-size: 1.75rem;
}

.stats-card-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stats-card-orange {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stats-card-green {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stats-card-purple {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

:deep(.p-card-content) {
  padding: 1.5rem;
}
</style>
```

## CRUD Operations

### Product Management CRUD

```vue
<!-- views/inventory/Products.vue -->
<template>
  <div class="products-page">
    <div class="page-header">
      <h1>Products</h1>
      <Button label="New Product" icon="pi pi-plus" @click="openNew" />
    </div>

    <Card>
      <template #content>
        <!-- Toolbar -->
        <Toolbar class="mb-4">
          <template #start>
            <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
          </template>
          <template #end>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Search..." />
            </span>
            <Button icon="pi pi-filter" @click="toggleFilters" class="ml-2" />
            <Button icon="pi pi-download" @click="exportCSV" class="ml-2" />
          </template>
        </Toolbar>

        <!-- Advanced Filters -->
        <div v-if="showFilters" class="filters-panel mb-4">
          <div class="grid">
            <div class="col-12 md:col-3">
              <span class="p-float-label">
                <Dropdown v-model="filters.category" :options="categories" optionLabel="name" optionValue="id" class="w-full" />
                <label>Category</label>
              </span>
            </div>
            <div class="col-12 md:col-3">
              <span class="p-float-label">
                <InputNumber v-model="filters.minPrice" mode="currency" currency="USD" class="w-full" />
                <label>Min Price</label>
              </span>
            </div>
            <div class="col-12 md:col-3">
              <span class="p-float-label">
                <InputNumber v-model="filters.maxPrice" mode="currency" currency="USD" class="w-full" />
                <label>Max Price</label>
              </span>
            </div>
            <div class="col-12 md:col-3">
              <Button label="Clear Filters" @click="clearFilters" class="w-full" />
            </div>
          </div>
        </div>

        <!-- Data Table -->
        <DataTable 
          ref="dt"
          :value="products" 
          v-model:selection="selectedProducts"
          :paginator="true" 
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5,10,25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          responsiveLayout="scroll"
        >
          <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
          <Column field="code" header="Code" :sortable="true" style="min-width:12rem">
            <template #body="slotProps">
              <span class="font-bold">{{ slotProps.data.code }}</span>
            </template>
          </Column>
          <Column field="name" header="Name" :sortable="true" style="min-width:16rem"></Column>
          <Column header="Image" style="min-width:8rem">
            <template #body="slotProps">
              <img :src="slotProps.data.image" :alt="slotProps.data.name" class="product-image" />
            </template>
          </Column>
          <Column field="category" header="Category" :sortable="true" style="min-width:10rem">
            <template #body="slotProps">
              <Tag :value="slotProps.data.category" />
            </template>
          </Column>
          <Column field="price" header="Price" :sortable="true" style="min-width:8rem">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.price) }}
            </template>
          </Column>
          <Column field="quantity" header="Stock" :sortable="true" style="min-width:8rem">
            <template #body="slotProps">
              <Tag :value="`${slotProps.data.quantity} units`" :severity="getStockSeverity(slotProps.data.quantity)" />
            </template>
          </Column>
          <Column field="status" header="Status" :sortable="true" style="min-width:8rem">
            <template #body="slotProps">
              <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
            </template>
          </Column>
          <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteProduct(slotProps.data)" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Product Dialog -->
    <Dialog v-model:visible="productDialog" :style="{width: '600px'}" header="Product Details" :modal="true" class="p-fluid">
      <div class="formgrid grid">
        <div class="field col-12 md:col-6">
          <label for="code">Code</label>
          <InputText id="code" v-model.trim="product.code" required="true" autofocus :class="{'p-invalid': submitted && !product.code}" />
          <small class="p-error" v-if="submitted && !product.code">Code is required.</small>
        </div>
        <div class="field col-12 md:col-6">
          <label for="name">Name</label>
          <InputText id="name" v-model.trim="product.name" required="true" :class="{'p-invalid': submitted && !product.name}" />
          <small class="p-error" v-if="submitted && !product.name">Name is required.</small>
        </div>
        <div class="field col-12">
          <label for="description">Description</label>
          <Textarea id="description" v-model="product.description" rows="3" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="category">Category</label>
          <Dropdown id="category" v-model="product.category" :options="categories" optionLabel="name" optionValue="name" placeholder="Select a Category" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="price">Price</label>
          <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="quantity">Quantity</label>
          <InputNumber id="quantity" v-model="product.quantity" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="status">Status</label>
          <Dropdown id="status" v-model="product.status" :options="statuses" optionLabel="label" optionValue="value" placeholder="Select Status" />
        </div>
        <div class="field col-12">
          <label>Image</label>
          <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" @upload="onUpload" />
        </div>
      </div>
      
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" text @click="saveProduct" />
      </template>
    </Dialog>

    <!-- Delete Confirmation -->
    <Dialog v-model:visible="deleteProductDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="product">Are you sure you want to delete <b>{{product.name}}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteProduct" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const dt = ref()

// Data
const products = ref([])
const productDialog = ref(false)
const deleteProductDialog = ref(false)
const product = ref({})
const selectedProducts = ref()
const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
  'category': null,
  'minPrice': null,
  'maxPrice': null
})
const submitted = ref(false)
const showFilters = ref(false)

const categories = ref([
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Clothing' },
  { id: 3, name: 'Food' },
  { id: 4, name: 'Furniture' }
])

const statuses = ref([
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Out of Stock', value: 'Out of Stock' }
])

// Methods
const openNew = () => {
  product.value = {}
  submitted.value = false
  productDialog.value = true
}

const hideDialog = () => {
  productDialog.value = false
  submitted.value = false
}

const saveProduct = () => {
  submitted.value = true

  if (product.value.name.trim()) {
    if (product.value.id) {
      // Update existing product
      const index = findIndexById(product.value.id)
      products.value[index] = product.value
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 })
    } else {
      // Create new product
      product.value.id = createId()
      products.value.push(product.value)
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 })
    }

    productDialog.value = false
    product.value = {}
  }
}

const editProduct = (prod) => {
  product.value = { ...prod }
  productDialog.value = true
}

const confirmDeleteProduct = (prod) => {
  product.value = prod
  deleteProductDialog.value = true
}

const deleteProduct = () => {
  products.value = products.value.filter(val => val.id !== product.value.id)
  deleteProductDialog.value = false
  product.value = {}
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 })
}

const findIndexById = (id) => {
  let index = -1
  for (let i = 0; i < products.value.length; i++) {
    if (products.value[i].id === id) {
      index = i
      break
    }
  }
  return index
}

const createId = () => {
  let id = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

const exportCSV = () => {
  dt.value.exportCSV()
}

const confirmDeleteSelected = () => {
  // Implement bulk delete
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const clearFilters = () => {
  filters.value = {
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'category': null,
    'minPrice': null,
    'maxPrice': null
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const getStockSeverity = (quantity) => {
  if (quantity === 0) return 'danger'
  if (quantity < 10) return 'warning'
  return 'success'
}

const getStatusSeverity = (status) => {
  switch (status) {
    case 'Active':
      return 'success'
    case 'Inactive':
      return 'warning'
    case 'Out of Stock':
      return 'danger'
    default:
      return null
  }
}

const onUpload = (event) => {
  // Handle file upload
}

// Load sample data
onMounted(() => {
  // In real app, load from API
  products.value = [
    {
      id: '1',
      code: 'P001',
      name: 'Laptop Pro 15',
      description: 'High-performance laptop',
      category: 'Electronics',
      price: 1299.99,
      quantity: 25,
      status: 'Active',
      image: '/placeholder.jpg'
    },
    // Add more sample products
  ]
})
</script>

<style scoped>
.products-page {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.product-image {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
}

.filters-panel {
  padding: 1rem;
  background-color: var(--surface-ground);
  border-radius: 8px;
}

.confirmation-content {
  display: flex;
  align-items: center;
}
</style>
```

## Forms & Validation

### Employee Form with Validation

```vue
<!-- views/hr/EmployeeForm.vue -->
<template>
  <div class="employee-form-page">
    <Card>
      <template #title>
        <div class="flex align-items-center">
          <Button icon="pi pi-arrow-left" class="p-button-text mr-2" @click="$router.back()" />
          <span>{{ isEditMode ? 'Edit Employee' : 'New Employee' }}</span>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleSubmit(!v$.$invalid)">
          <TabView>
            <TabPanel header="Personal Information">
              <div class="formgrid grid">
                <div class="field col-12 md:col-6">
                  <label for="firstName" class="required">First Name</label>
                  <InputText 
                    id="firstName" 
                    v-model="v$.employee.firstName.$model"
                    :class="{'p-invalid': v$.employee.firstName.$error}"
                  />
                  <div class="p-error" v-for="error of v$.employee.firstName.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
                
                <div class="field col-12 md:col-6">
                  <label for="lastName" class="required">Last Name</label>
                  <InputText 
                    id="lastName" 
                    v-model="v$.employee.lastName.$model"
                    :class="{'p-invalid': v$.employee.lastName.$error}"
                  />
                  <div class="p-error" v-for="error of v$.employee.lastName.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>

                <div class="field col-12 md:col-6">
                  <label for="email" class="required">Email</label>
                  <InputText 
                    id="email" 
                    v-model="v$.employee.email.$model"
                    :class="{'p-invalid': v$.employee.email.$error}"
                  />
                  <div class="p-error" v-for="error of v$.employee.email.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>

                <div class="field col-12 md:col-6">
                  <label for="phone">Phone</label>
                  <InputMask 
                    id="phone" 
                    v-model="employee.phone"
                    mask="(999) 999-9999"
                    placeholder="(999) 999-9999"
                  />
                </div>

                <div class="field col-12 md:col-6">
                  <label for="dateOfBirth">Date of Birth</label>
                  <Calendar 
                    id="dateOfBirth" 
                    v-model="employee.dateOfBirth"
                    dateFormat="mm/dd/yy"
                    :maxDate="maxDate"
                    showIcon
                  />
                </div>

                <div class="field col-12 md:col-6">
                  <label for="gender">Gender</label>
                  <Dropdown 
                    id="gender" 
                    v-model="employee.gender"
                    :options="genderOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Gender"
                  />
                </div>

                <div class="field col-12">
                  <label for="address">Address</label>
                  <Textarea 
                    id="address" 
                    v-model="employee.address"
                    rows="3"
                  />
                </div>
              </div>
            </TabPanel>

            <TabPanel header="Employment Details">
              <div class="formgrid grid">
                <div class="field col-12 md:col-6">
                  <label for="employeeId" class="required">Employee ID</label>
                  <InputText 
                    id="employeeId" 
                    v-model="v$.employee.employeeId.$model"
                    :class="{'p-invalid': v$.employee.employeeId.$error}"
                  />
                  <div class="p-error" v-for="error of v$.employee.employeeId.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>

                <div class="field col-12 md:col-6">
                  <label for="department" class="required">Department</label>
                  <Dropdown 
                    id="department" 
                    v-model="v$.employee.department.$model"
                    :options="departments"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Select Department"
                    :class="{'p-invalid': v$.employee.department.$error}"
                  />
                  <div class="p-error" v-for="error of v$.employee.department.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>

                <div class="field col-12 md:col-6">
                  <label for="position" class="required">Position</label>
                  <InputText 
                    id="position" 
                    v-model="v$.employee.position.$model"
                    :class="{'p-invalid': v$.employee.position.$error}"
                  />
                  <div class="p-error" v-for="error of v$.employee.position.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>

                <div class="field col-12 md:col-6">
                  <label for="manager">Reports To</label>
                  <AutoComplete 
                    id="manager"
                    v-model="employee.manager"
                    :suggestions="filteredManagers"
                    @complete="searchManager"
                    field="name"
                    placeholder="Search Manager"
                  />
                </div>

                <div class="field col-12 md:col-6">
                  <label for="joinDate" class="required">Join Date</label>
                  <Calendar 
                    id="joinDate" 
                    v-model="v$.employee.joinDate.$model"
                    dateFormat="mm/dd/yy"
                    :maxDate="new Date()"
                    showIcon
                    :class="{'p-invalid': v$.employee.joinDate.$error}"
                  />
                  <div class="p-error" v-for="error of v$.employee.joinDate.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>

                <div class="field col-12 md:col-6">
                  <label for="employmentType">Employment Type</label>
                  <Dropdown 
                    id="employmentType" 
                    v-model="employee.employmentType"
                    :options="employmentTypes"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Type"
                  />
                </div>

                <div class="field col-12 md:col-6">
                  <label for="salary" class="required">Salary</label>
                  <InputNumber 
                    id="salary" 
                    v-model="v$.employee.salary.$model"
                    mode="currency"
                    currency="USD"
                    :class="{'p-invalid': v$.employee.salary.$error}"
                  />
                  <div class="p-error" v-for="error of v$.employee.salary.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>

                <div class="field col-12 md:col-6">
                  <label for="status">Status</label>
                  <SelectButton 
                    id="status"
                    v-model="employee.status"
                    :options="statusOptions"
                    optionLabel="label"
                    optionValue="value"
                  />
                </div>
              </div>
            </TabPanel>

            <TabPanel header="Documents">
              <div class="formgrid grid">
                <div class="field col-12">
                  <label>Upload Documents</label>
                  <FileUpload 
                    name="documents[]" 
                    :multiple="true"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    :maxFileSize="10000000"
                    @upload="onUpload"
                    :auto="false"
                    chooseLabel="Choose Files"
                  >
                    <template #empty>
                      <p>Drag and drop files here to upload.</p>
                    </template>
                  </FileUpload>
                </div>

                <div class="field col-12" v-if="employee.documents && employee.documents.length">
                  <label>Existing Documents</label>
                  <div class="documents-list">
                    <div v-for="doc in employee.documents" :key="doc.id" class="document-item">
                      <i :class="getDocumentIcon(doc.type)"></i>
                      <span>{{ doc.name }}</span>
                      <Button icon="pi pi-download" class="p-button-text p-button-sm" />
                      <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="removeDocument(doc)" />
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel header="Emergency Contact">
              <div class="formgrid grid">
                <div class="field col-12 md:col-6">
                  <label for="emergencyName">Contact Name</label>
                  <InputText 
                    id="emergencyName" 
                    v-model="employee.emergency.name"
                  />
                </div>

                <div class="field col-12 md:col-6">
                  <label for="emergencyRelation">Relationship</label>
                  <InputText 
                    id="emergencyRelation" 
                    v-model="employee.emergency.relation"
                  />
                </div>

                <div class="field col-12 md:col-6">
                  <label for="emergencyPhone">Phone</label>
                  <InputMask 
                    id="emergencyPhone" 
                    v-model="employee.emergency.phone"
                    mask="(999) 999-9999"
                    placeholder="(999) 999-9999"
                  />
                </div>

                <div class="field col-12 md:col-6">
                  <label for="emergencyEmail">Email</label>
                  <InputText 
                    id="emergencyEmail" 
                    v-model="employee.emergency.email"
                  />
                </div>
              </div>
            </TabPanel>
          </TabView>

          <div class="mt-4">
            <Button type="submit" label="Save" icon="pi pi-check" :loading="loading" />
            <Button label="Cancel" icon="pi pi-times" class="p-button-text ml-2" @click="$router.back()" />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minValue } from '@vuelidate/validators'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// Form state
const isEditMode = computed(() => !!route.params.id)
const loading = ref(false)

const employee = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: null,
  gender: null,
  address: '',
  employeeId: '',
  department: null,
  position: '',
  manager: null,
  joinDate: null,
  employmentType: 'full-time',
  salary: null,
  status: 'active',
  documents: [],
  emergency: {
    name: '',
    relation: '',
    phone: '',
    email: ''
  }
})

// Validation rules
const rules = {
  employee: {
    firstName: { required },
    lastName: { required },
    email: { required, email },
    employeeId: { required },
    department: { required },
    position: { required },
    joinDate: { required },
    salary: { required, minValue: minValue(0) }
  }
}

const v$ = useVuelidate(rules, { employee })

// Options
const genderOptions = ref([
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
])

const departments = ref([
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Sales' },
  { id: 3, name: 'Marketing' },
  { id: 4, name: 'HR' },
  { id: 5, name: 'Finance' }
])

const employmentTypes = ref([
  { label: 'Full Time', value: 'full-time' },
  { label: 'Part Time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Intern', value: 'intern' }
])

const statusOptions = ref([
  { label: 'Active', value: 'active' },
  { label: 'On Leave', value: 'on-leave' },
  { label: 'Inactive', value: 'inactive' }
])

const filteredManagers = ref([])
const maxDate = computed(() => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 18)
  return date
})

// Methods
const handleSubmit = async (isFormValid) => {
  if (!isFormValid) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fill in all required fields',
      life: 3000
    })
    return
  }

  loading.value = true
  
  try {
    // API call would go here
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Employee ${isEditMode.value ? 'updated' : 'created'} successfully`,
      life: 3000
    })
    
    router.push('/hr/employees')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const searchManager = (event) => {
  // Simulate API search
  filteredManagers.value = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
  ].filter(m => m.name.toLowerCase().includes(event.query.toLowerCase()))
}

const onUpload = (event) => {
  // Handle file upload
}

const removeDocument = (doc) => {
  employee.documents = employee.documents.filter(d => d.id !== doc.id)
}

const getDocumentIcon = (type) => {
  const icons = {
    'pdf': 'pi pi-file-pdf',
    'doc': 'pi pi-file-word',
    'docx': 'pi pi-file-word',
    'jpg': 'pi pi-image',
    'png': 'pi pi-image'
  }
  return icons[type] || 'pi pi-file'
}
</script>

<style scoped>
.employee-form-page {
  padding: 2rem;
}

.required::after {
  content: ' *';
  color: var(--red-500);
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: var(--surface-ground);
  border-radius: 4px;
}

.document-item span {
  flex: 1;
}

:deep(.p-tabview-panels) {
  padding: 2rem 0;
}
</style>
```

## Data Components

### Tree View Component

```vue
<!-- views/organization/OrgChart.vue -->
<template>
  <div class="org-chart-page">
    <Card>
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <span>Organization Structure</span>
          <div>
            <Button icon="pi pi-plus" label="Add Department" class="mr-2" @click="showAddDialog = true" />
            <Button icon="pi pi-download" label="Export" />
          </div>
        </div>
      </template>
      <template #content>
        <Tree 
          :value="nodes" 
          v-model:selectionKeys="selectedKeys"
          :filter="true"
          filterMode="lenient"
          :expandedKeys="expandedKeys"
          @nodeSelect="onNodeSelect"
          @nodeUnselect="onNodeUnselect"
          selectionMode="single"
          class="org-tree"
        >
          <template #default="slotProps">
            <div class="org-node">
              <div class="org-node-content">
                <i :class="slotProps.node.icon" class="org-node-icon"></i>
                <div class="org-node-info">
                  <div class="org-node-title">{{ slotProps.node.label }}</div>
                  <div class="org-node-subtitle">{{ slotProps.node.data?.employeeCount }} employees</div>
                </div>
                <div class="org-node-actions">
                  <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editDepartment(slotProps.node)" />
                  <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="deleteDepartment(slotProps.node)" />
                </div>
              </div>
            </div>
          </template>
        </Tree>
      </template>
    </Card>

    <!-- Department Details Panel -->
    <Sidebar v-model:visible="showDetails" position="right" :style="{width: '400px'}">
      <template v-if="selectedDepartment">
        <h3>{{ selectedDepartment.label }}</h3>
        <Divider />
        
        <div class="detail-item">
          <label>Manager</label>
          <div class="flex align-items-center mt-2">
            <Avatar :label="selectedDepartment.data?.manager?.initials" class="mr-2" />
            <span>{{ selectedDepartment.data?.manager?.name }}</span>
          </div>
        </div>

        <div class="detail-item">
          <label>Employee Count</label>
          <div class="mt-2">{{ selectedDepartment.data?.employeeCount }}</div>
        </div>

        <div class="detail-item">
          <label>Budget</label>
          <div class="mt-2">{{ formatCurrency(selectedDepartment.data?.budget) }}</div>
        </div>

        <div class="detail-item">
          <label>Recent Activities</label>
          <Timeline :value="activities" class="mt-2">
            <template #content="slotProps">
              <small>{{ slotProps.item.date }}</small>
              <p class="mt-1 mb-0">{{ slotProps.item.activity }}</p>
            </template>
          </Timeline>
        </div>
      </template>
    </Sidebar>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Tree from 'primevue/tree'
import Sidebar from 'primevue/sidebar'
import Timeline from 'primevue/timeline'
import Avatar from 'primevue/avatar'
import Divider from 'primevue/divider'

const nodes = ref([
  {
    key: '0',
    label: 'ABC Corporation',
    icon: 'pi pi-building',
    data: {
      employeeCount: 450,
      manager: { name: 'John CEO', initials: 'JC' },
      budget: 5000000
    },
    children: [
      {
        key: '0-0',
        label: 'Engineering',
        icon: 'pi pi-code',
        data: {
          employeeCount: 120,
          manager: { name: 'Alice CTO', initials: 'AC' },
          budget: 2000000
        },
        children: [
          {
            key: '0-0-0',
            label: 'Frontend Team',
            icon: 'pi pi-desktop',
            data: { employeeCount: 40, manager: { name: 'Bob Lead', initials: 'BL' }, budget: 600000 }
          },
          {
            key: '0-0-1',
            label: 'Backend Team',
            icon: 'pi pi-server',
            data: { employeeCount: 50, manager: { name: 'Carol Lead', initials: 'CL' }, budget: 800000 }
          },
          {
            key: '0-0-2',
            label: 'DevOps Team',
            icon: 'pi pi-cloud',
            data: { employeeCount: 30, manager: { name: 'Dave Lead', initials: 'DL' }, budget: 600000 }
          }
        ]
      },
      {
        key: '0-1',
        label: 'Sales',
        icon: 'pi pi-chart-line',
        data: {
          employeeCount: 80,
          manager: { name: 'Eve VP', initials: 'EV' },
          budget: 1500000
        },
        children: [
          {
            key: '0-1-0',
            label: 'Direct Sales',
            icon: 'pi pi-phone',
            data: { employeeCount: 50, manager: { name: 'Frank Manager', initials: 'FM' }, budget: 900000 }
          },
          {
            key: '0-1-1',
            label: 'Channel Partners',
            icon: 'pi pi-users',
            data: { employeeCount: 30, manager: { name: 'Grace Manager', initials: 'GM' }, budget: 600000 }
          }
        ]
      },
      {
        key: '0-2',
        label: 'HR',
        icon: 'pi pi-users',
        data: {
          employeeCount: 25,
          manager: { name: 'Helen HR Director', initials: 'HH' },
          budget: 500000
        }
      }
    ]
  }
])

const selectedKeys = ref({})
const expandedKeys = ref({ '0': true, '0-0': true, '0-1': true })
const showDetails = ref(false)
const selectedDepartment = ref(null)
const showAddDialog = ref(false)

const activities = ref([
  { date: '2024-01-15', activity: 'New hire: John Developer' },
  { date: '2024-01-10', activity: 'Department meeting scheduled' },
  { date: '2024-01-05', activity: 'Budget review completed' }
])

const onNodeSelect = (node) => {
  selectedDepartment.value = node
  showDetails.value = true
}

const onNodeUnselect = () => {
  selectedDepartment.value = null
  showDetails.value = false
}

const editDepartment = (node) => {
  // Implementation
}

const deleteDepartment = (node) => {
  // Implementation
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value)
}
</script>

<style scoped>
.org-chart-page {
  padding: 2rem;
}

.org-tree {
  font-size: 1.1rem;
}

.org-node {
  padding: 0.5rem;
}

.org-node-content {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.org-node-content:hover {
  background-color: var(--surface-hover);
}

.org-node-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  color: var(--primary-color);
}

.org-node-info {
  flex: 1;
}

.org-node-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.org-node-subtitle {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

.org-node-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.org-node-content:hover .org-node-actions {
  opacity: 1;
}

.detail-item {
  margin-bottom: 1.5rem;
}

.detail-item label {
  font-weight: 600;
  color: var(--text-color-secondary);
}

:deep(.p-tree-toggler) {
  margin-right: 0.5rem;
}
</style>
```

### Pivot Table Component

```vue
<!-- views/finance/FinancialAnalysis.vue -->
<template>
  <div class="financial-analysis-page">
    <Card>
      <template #title>Financial Analysis - Pivot Table</template>
      <template #content>
        <!-- Pivot Configuration -->
        <div class="pivot-config mb-4">
          <div class="grid">
            <div class="col-12 md:col-3">
              <label>Rows</label>
              <MultiSelect 
                v-model="pivotConfig.rows" 
                :options="availableFields"
                optionLabel="label"
                optionValue="value"
                placeholder="Select row fields"
                class="w-full"
              />
            </div>
            <div class="col-12 md:col-3">
              <label>Columns</label>
              <MultiSelect 
                v-model="pivotConfig.columns" 
                :options="availableFields"
                optionLabel="label"
                optionValue="value"
                placeholder="Select column fields"
                class="w-full"
              />
            </div>
            <div class="col-12 md:col-3">
              <label>Values</label>
              <Dropdown 
                v-model="pivotConfig.valueField" 
                :options="valueFields"
                optionLabel="label"
                optionValue="value"
                placeholder="Select value field"
                class="w-full"
              />
            </div>
            <div class="col-12 md:col-3">
              <label>Aggregation</label>
              <Dropdown 
                v-model="pivotConfig.aggregation" 
                :options="aggregationTypes"
                optionLabel="label"
                optionValue="value"
                placeholder="Select aggregation"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Pivot Table -->
        <DataTable 
          :value="pivotData" 
          :scrollable="true" 
          scrollHeight="600px"
          class="pivot-table"
          :loading="loading"
        >
          <!-- Dynamic columns based on pivot configuration -->
          <Column 
            v-for="col in pivotColumns" 
            :key="col.field"
            :field="col.field"
            :header="col.header"
            :style="col.style"
          >
            <template #body="slotProps">
              <span v-if="col.isValue" class="value-cell">
                {{ formatValue(slotProps.data[col.field]) }}
              </span>
              <span v-else>
                {{ slotProps.data[col.field] }}
              </span>
            </template>
            <template #footer v-if="col.isValue">
              <strong>{{ formatValue(calculateColumnTotal(col.field)) }}</strong>
            </template>
          </Column>

          <!-- Row Total Column -->
          <Column field="rowTotal" header="Total" style="min-width: 120px">
            <template #body="slotProps">
              <strong class="row-total">{{ formatValue(slotProps.data.rowTotal) }}</strong>
            </template>
            <template #footer>
              <strong>{{ formatValue(grandTotal) }}</strong>
            </template>
          </Column>
        </DataTable>

        <!-- Export Options -->
        <div class="mt-3">
          <Button icon="pi pi-download" label="Export Excel" class="p-button-success mr-2" @click="exportExcel" />
          <Button icon="pi pi-chart-bar" label="View Chart" @click="showChart = true" />
        </div>
      </template>
    </Card>

    <!-- Chart Dialog -->
    <Dialog v-model:visible="showChart" header="Pivot Chart" :style="{width: '80vw'}" :modal="true">
      <Chart type="bar" :data="chartData" :options="chartOptions" style="height: 400px" />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import MultiSelect from 'primevue/multiselect'
import Chart from 'primevue/chart'

const loading = ref(false)
const showChart = ref(false)

// Pivot configuration
const pivotConfig = ref({
  rows: ['department'],
  columns: ['quarter'],
  valueField: 'revenue',
  aggregation: 'sum'
})

const availableFields = ref([
  { label: 'Department', value: 'department' },
  { label: 'Region', value: 'region' },
  { label: 'Product', value: 'product' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Month', value: 'month' }
])

const valueFields = ref([
  { label: 'Revenue', value: 'revenue' },
  { label: 'Profit', value: 'profit' },
  { label: 'Quantity', value: 'quantity' },
  { label: 'Cost', value: 'cost' }
])

const aggregationTypes = ref([
  { label: 'Sum', value: 'sum' },
  { label: 'Average', value: 'average' },
  { label: 'Count', value: 'count' },
  { label: 'Min', value: 'min' },
  { label: 'Max', value: 'max' }
])

// Sample data - in real app, this would come from API
const rawData = ref([
  { department: 'Sales', region: 'North', product: 'Product A', quarter: 'Q1', month: 'Jan', revenue: 100000, profit: 20000, quantity: 100, cost: 80000 },
  { department: 'Sales', region: 'North', product: 'Product B', quarter: 'Q1', month: 'Jan', revenue: 150000, profit: 30000, quantity: 150, cost: 120000 },
  { department: 'Sales', region: 'South', product: 'Product A', quarter: 'Q1', month: 'Feb', revenue: 120000, profit: 24000, quantity: 120, cost: 96000 },
  { department: 'Marketing', region: 'North', product: 'Product A', quarter: 'Q1', month: 'Jan', revenue: 80000, profit: 16000, quantity: 80, cost: 64000 },
  { department: 'Sales', region: 'North', product: 'Product A', quarter: 'Q2', month: 'Apr', revenue: 130000, profit: 26000, quantity: 130, cost: 104000 },
  // ... more data
])

// Computed pivot data
const pivotData = computed(() => {
  // This is a simplified pivot logic
  // In production, use a proper pivot library or backend processing
  const result = []
  const rowValues = [...new Set(rawData.value.map(d => d[pivotConfig.value.rows[0]]))]
  const colValues = [...new Set(rawData.value.map(d => d[pivotConfig.value.columns[0]]))]
  
  rowValues.forEach(rowVal => {
    const row = { [pivotConfig.value.rows[0]]: rowVal }
    let rowTotal = 0
    
    colValues.forEach(colVal => {
      const filtered = rawData.value.filter(d => 
        d[pivotConfig.value.rows[0]] === rowVal && 
        d[pivotConfig.value.columns[0]] === colVal
      )
      
      const value = calculateAggregation(filtered, pivotConfig.value.valueField)
      row[colVal] = value
      rowTotal += value
    })
    
    row.rowTotal = rowTotal
    result.push(row)
  })
  
  return result
})

const pivotColumns = computed(() => {
  const columns = []
  
  // Row field columns
  pivotConfig.value.rows.forEach(row => {
    columns.push({
      field: row,
      header: availableFields.value.find(f => f.value === row)?.label || row,
      style: 'min-width: 150px'
    })
  })
  
  // Value columns based on column fields
  if (pivotData.value.length > 0) {
    const firstRow = pivotData.value[0]
    const colValues = Object.keys(firstRow).filter(key => 
      !pivotConfig.value.rows.includes(key) && key !== 'rowTotal'
    )
    
    colValues.forEach(col => {
      columns.push({
        field: col,
        header: col,
        style: 'min-width: 120px',
        isValue: true
      })
    })
  }
  
  return columns
})

const grandTotal = computed(() => {
  return pivotData.value.reduce((sum, row) => sum + (row.rowTotal || 0), 0)
})

const chartData = computed(() => {
  const labels = pivotData.value.map(row => row[pivotConfig.value.rows[0]])
  const datasets = []
  
  if (pivotData.value.length > 0) {
    const firstRow = pivotData.value[0]
    const colValues = Object.keys(firstRow).filter(key => 
      !pivotConfig.value.rows.includes(key) && key !== 'rowTotal'
    )
    
    colValues.forEach((col, index) => {
      datasets.push({
        label: col,
        data: pivotData.value.map(row => row[col] || 0),
        backgroundColor: getColor(index)
      })
    })
  }
  
  return { labels, datasets }
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return formatValue(value)
        }
      }
    }
  }
})

// Methods
const calculateAggregation = (data, field) => {
  if (data.length === 0) return 0
  
  switch (pivotConfig.value.aggregation) {
    case 'sum':
      return data.reduce((sum, item) => sum + item[field], 0)
    case 'average':
      return data.reduce((sum, item) => sum + item[field], 0) / data.length
    case 'count':
      return data.length
    case 'min':
      return Math.min(...data.map(item => item[field]))
    case 'max':
      return Math.max(...data.map(item => item[field]))
    default:
      return 0
  }
}

const calculateColumnTotal = (field) => {
  return pivotData.value.reduce((sum, row) => sum + (row[field] || 0), 0)
}

const formatValue = (value) => {
  if (pivotConfig.value.valueField === 'revenue' || pivotConfig.value.valueField === 'profit' || pivotConfig.value.valueField === 'cost') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value)
  }
  return new Intl.NumberFormat('en-US').format(value)
}

const getColor = (index) => {
  const colors = [
    '#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', 
    '#10B981', '#3B82F6', '#EF4444', '#8B5CF6'
  ]
  return colors[index % colors.length]
}

const exportExcel = () => {
  // Implementation for Excel export
  // You can use libraries like xlsx or SheetJS
}

// Watch for configuration changes
watch(pivotConfig, () => {
  // In real app, refetch data based on new configuration
}, { deep: true })
</script>

<style scoped>
.financial-analysis-page {
  padding: 2rem;
}

.pivot-config {
  padding: 1rem;
  background-color: var(--surface-ground);
  border-radius: 8px;
}

.pivot-config label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.pivot-table :deep(.value-cell) {
  text-align: right;
  font-weight: 500;
}

.pivot-table :deep(.row-total) {
  color: var(--primary-color);
}

.pivot-table :deep(.p-datatable-footer td) {
  background-color: var(--surface-100);
  font-weight: 600;
}
</style>
```

## Advanced Components

### Dashboard Builder with Drag & Drop

```vue
<!-- views/DashboardBuilder.vue -->
<template>
  <div class="dashboard-builder">
    <div class="builder-header">
      <h2>Dashboard Builder</h2>
      <div class="builder-actions">
        <Button label="Preview" icon="pi pi-eye" class="p-button-outlined mr-2" @click="previewMode = !previewMode" />
        <Button label="Save Dashboard" icon="pi pi-save" @click="saveDashboard" />
      </div>
    </div>

    <div class="builder-content">
      <!-- Widget Library -->
      <div class="widget-library" v-if="!previewMode">
        <h3>Available Widgets</h3>
        <div class="widget-list">
          <div 
            v-for="widget in availableWidgets" 
            :key="widget.type"
            class="widget-item"
            draggable="true"
            @dragstart="onDragStart($event, widget)"
          >
            <i :class="widget.icon"></i>
            <span>{{ widget.name }}</span>
          </div>
        </div>
      </div>

      <!-- Dashboard Canvas -->
      <div class="dashboard-canvas" :class="{ 'preview-mode': previewMode }">
        <div 
          class="grid-container"
          @drop="onDrop"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-for="(widget, index) in dashboardWidgets"
            :key="widget.id"
            :class="getWidgetClass(widget)"
            :style="getWidgetStyle(widget)"
          >
            <Card class="widget-card">
              <template #header v-if="!previewMode">
                <div class="widget-header">
                  <span>{{ widget.title }}</span>
                  <div class="widget-controls">
                    <Button icon="pi pi-cog" class="p-button-text p-button-sm" @click="configureWidget(widget)" />
                    <Button icon="pi pi-times" class="p-button-text p-button-sm" @click="removeWidget(index)" />
                  </div>
                </div>
              </template>
              <template #content>
                <component 
                  :is="getWidgetComponent(widget.type)" 
                  :config="widget.config"
                  :data="widget.data"
                />
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <!-- Widget Configuration Dialog -->
    <Dialog v-model:visible="showConfigDialog" header="Widget Configuration" :style="{width: '500px'}" :modal="true">
      <div v-if="selectedWidget">
        <div class="field">
          <label for="widgetTitle">Title</label>
          <InputText id="widgetTitle" v-model="selectedWidget.title" class="w-full" />
        </div>
        
        <div class="field">
          <label for="widgetSize">Size</label>
          <Dropdown 
            id="widgetSize"
            v-model="selectedWidget.size" 
            :options="widgetSizes"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>

        <!-- Dynamic configuration based on widget type -->
        <component 
          :is="getWidgetConfigComponent(selectedWidget.type)"
          v-model:config="selectedWidget.config"
        />
      </div>
      
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="showConfigDialog = false" />
        <Button label="Apply" icon="pi pi-check" @click="applyWidgetConfig" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import { useToast } from 'primevue/usetoast'

// Import widget components
import ChartWidget from '@/components/widgets/ChartWidget.vue'
import StatsWidget from '@/components/widgets/StatsWidget.vue'
import TableWidget from '@/components/widgets/TableWidget.vue'
import TimelineWidget from '@/components/widgets/TimelineWidget.vue'

// Import config components
import ChartWidgetConfig from '@/components/widgets/config/ChartWidgetConfig.vue'
import TableWidgetConfig from '@/components/widgets/config/TableWidgetConfig.vue'

const toast = useToast()

const previewMode = ref(false)
const showConfigDialog = ref(false)
const selectedWidget = ref(null)
const draggedWidget = ref(null)

const availableWidgets = ref([
  { type: 'chart', name: 'Chart', icon: 'pi pi-chart-bar', component: ChartWidget },
  { type: 'stats', name: 'Statistics', icon: 'pi pi-percentage', component: StatsWidget },
  { type: 'table', name: 'Data Table', icon: 'pi pi-table', component: TableWidget },
  { type: 'timeline', name: 'Timeline', icon: 'pi pi-clock', component: TimelineWidget }
])

const dashboardWidgets = ref([
  {
    id: '1',
    type: 'stats',
    title: 'Revenue Stats',
    size: 'small',
    position: { x: 0, y: 0 },
    config: {
      showTrend: true,
      color: 'blue'
    },
    data: {
      value: 250000,
      trend: 12.5,
      label: 'Total Revenue'
    }
  },
  {
    id: '2',
    type: 'chart',
    title: 'Sales Chart',
    size: 'large',
    position: { x: 4, y: 0 },
    config: {
      chartType: 'line',
      showLegend: true
    },
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Sales',
        data: [65, 59, 80, 81, 56],
        borderColor: '#4F46E5'
      }]
    }
  }
])

const widgetSizes = ref([
  { label: 'Small (1x1)', value: 'small' },
  { label: 'Medium (2x1)', value: 'medium' },
  { label: 'Large (2x2)', value: 'large' },
  { label: 'Extra Large (3x2)', value: 'xlarge' }
])

const widgetComponents = shallowRef({
  chart: ChartWidget,
  stats: StatsWidget,
  table: TableWidget,
  timeline: TimelineWidget
})

const widgetConfigComponents = shallowRef({
  chart: ChartWidgetConfig,
  table: TableWidgetConfig
})

// Methods
const onDragStart = (event, widget) => {
  draggedWidget.value = widget
  event.dataTransfer.effectAllowed = 'copy'
}

const onDrop = (event) => {
  if (!draggedWidget.value) return
  
  const newWidget = {
    id: Date.now().toString(),
    type: draggedWidget.value.type,
    title: `New ${draggedWidget.value.name}`,
    size: 'medium',
    position: calculateDropPosition(event),
    config: getDefaultConfig(draggedWidget.value.type),
    data: getSampleData(draggedWidget.value.type)
  }
  
  dashboardWidgets.value.push(newWidget)
  draggedWidget.value = null
}

const calculateDropPosition = (event) => {
  // Calculate grid position based on drop coordinates
  return { x: 0, y: dashboardWidgets.value.length }
}

const getDefaultConfig = (type) => {
  const defaults = {
    chart: { chartType: 'line', showLegend: true },
    stats: { showTrend: true, color: 'blue' },
    table: { pagination: true, rowsPerPage: 10 },
    timeline: { orientation: 'vertical' }
  }
  return defaults[type] || {}
}

const getSampleData = (type) => {
  const sampleData = {
    chart: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Data',
        data: [12, 19, 3, 5, 2],
        borderColor: '#4F46E5'
      }]
    },
    stats: {
      value: 1234,
      trend: 5.2,
      label: 'Metric'
    },
    table: {
      columns: ['Name', 'Value', 'Status'],
      rows: [
        { name: 'Item 1', value: 100, status: 'Active' },
        { name: 'Item 2', value: 200, status: 'Pending' }
      ]
    },
    timeline: {
      events: [
        { date: '2024-01-01', title: 'Event 1' },
        { date: '2024-01-15', title: 'Event 2' }
      ]
    }
  }
  return sampleData[type] || {}
}

const getWidgetClass = (widget) => {
  const sizeClasses = {
    small: 'col-12 md:col-6 lg:col-3',
    medium: 'col-12 md:col-6',
    large: 'col-12 lg:col-6',
    xlarge: 'col-12 lg:col-9'
  }
  return sizeClasses[widget.size] || sizeClasses.medium
}

const getWidgetStyle = (widget) => {
  return {
    // Additional positioning styles if needed
  }
}

const getWidgetComponent = (type) => {
  return widgetComponents.value[type] || 'div'
}

const getWidgetConfigComponent = (type) => {
  return widgetConfigComponents.value[type] || 'div'
}

const configureWidget = (widget) => {
  selectedWidget.value = { ...widget }
  showConfigDialog.value = true
}

const applyWidgetConfig = () => {
  const index = dashboardWidgets.value.findIndex(w => w.id === selectedWidget.value.id)
  if (index !== -1) {
    dashboardWidgets.value[index] = selectedWidget.value
  }
  showConfigDialog.value = false
}

const removeWidget = (index) => {
  dashboardWidgets.value.splice(index, 1)
}

const saveDashboard = () => {
  // Save dashboard configuration
  toast.add({
    severity: 'success',
    summary: 'Dashboard Saved',
    detail: 'Your dashboard has been saved successfully',
    life: 3000
  })
}
</script>

<style scoped>
.dashboard-builder {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.builder-header {
  padding: 1.5rem;
  background-color: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.builder-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.widget-library {
  width: 250px;
  padding: 1.5rem;
  background-color: var(--surface-ground);
  border-right: 1px solid var(--surface-border);
  overflow-y: auto;
}

.widget-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.widget-item {
  padding: 1rem;
  background-color: var(--surface-card);
  border-radius: 8px;
  cursor: move;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s;
}

.widget-item:hover {
  background-color: var(--surface-hover);
  transform: translateX(4px);
}

.widget-item i {
  font-size: 1.25rem;
  color: var(--primary-color);
}

.dashboard-canvas {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: var(--surface-50);
}

.dashboard-canvas.preview-mode {
  background-color: var(--surface-ground);
}

.grid-container {
  min-height: 100%;
}

.widget-card {
  height: 100%;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.widget-controls {
  display: flex;
  gap: 0.25rem;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}
</style>
```

## Best Practices

### 1. Component Organization
- Keep components small and focused on a single responsibility
- Use composition API for better TypeScript support
- Implement proper prop validation and typing

### 2. State Management with Pinia
```javascript
// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  
  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || 'guest')
  
  const login = async (credentials) => {
    try {
      const response = await api.login(credentials)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
    } catch (error) {
      throw error
    }
  }
  
  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }
  
  return {
    user,
    token,
    isAuthenticated,
    userRole,
    login,
    logout
  }
})
```

### 3. API Integration
```javascript
// services/api.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default api
```

### 4. Performance Optimization
- Use lazy loading for routes
- Implement virtual scrolling for large lists
- Optimize bundle size with tree shaking
- Use PrimeVue's lazy loading features

### 5. Accessibility
- Use proper ARIA labels
- Ensure keyboard navigation works
- Maintain proper color contrast
- Test with screen readers

### 6. Testing
```javascript
// Example component test
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import StatsCard from '@/components/widgets/StatsCard.vue'

describe('StatsCard', () => {
  it('renders properly', () => {
    const wrapper = mount(StatsCard, {
      props: {
        title: 'Revenue',
        value: 1000,
        icon: 'pi pi-dollar'
      }
    })
    
    expect(wrapper.text()).toContain('Revenue')
    expect(wrapper.text()).toContain('1000')
    expect(wrapper.find('.pi-dollar').exists()).toBe(true)
  })
})
```

This documentation provides a comprehensive guide for building an ERP UI with PrimeVue and Vue.js. The examples demonstrate real-world implementations of common ERP features including layouts, navigation, dashboards, CRUD operations, forms with validation, and advanced data visualization components.