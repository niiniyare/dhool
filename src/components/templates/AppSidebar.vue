<template>
  <div class="app-sidebar" :class="{ 'sidebar-collapsed': collapsed }">
    <!-- Logo/Header -->
    <div class="sidebar-header">
      <div class="logo">
        <i class="pi pi-bolt" />
        <span v-if="!collapsed" class="logo-text">Dhool</span>
      </div>
      <Button
        v-if="!isMobile"
        :icon="collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"
        class="collapse-btn"
        text
        rounded
        size="small"
        @click="toggleCollapse"
      />
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar-nav">
      <div class="nav-section">
        <div v-if="!collapsed" class="nav-section-title">Main</div>
        <ul class="nav-list">
          <li v-for="item in mainNavItems" :key="item.to" class="nav-item">
            <router-link :to="item.to" class="nav-link" active-class="active">
              <i :class="item.icon" />
              <span v-if="!collapsed" class="nav-text">{{ item.label }}</span>
              <Badge
                v-if="item.badge && !collapsed"
                :value="item.badge"
                severity="info"
                size="small"
              />
            </router-link>
          </li>
        </ul>
      </div>

      <div v-if="demoNavItems.length > 0" class="nav-section">
        <div v-if="!collapsed" class="nav-section-title">Demo</div>
        <ul class="nav-list">
          <li v-for="item in demoNavItems" :key="item.to" class="nav-item">
            <router-link :to="item.to" class="nav-link" active-class="active">
              <i :class="item.icon" />
              <span v-if="!collapsed" class="nav-text">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div v-if="crmNavItems.length > 0" class="nav-section">
        <div v-if="!collapsed" class="nav-section-title">CRM</div>
        <ul class="nav-list">
          <li v-for="item in crmNavItems" :key="item.to" class="nav-item">
            <router-link :to="item.to" class="nav-link" active-class="active">
              <i :class="item.icon" />
              <span v-if="!collapsed" class="nav-text">{{ item.label }}</span>
              <Badge
                v-if="item.badge && !collapsed"
                :value="item.badge"
                severity="info"
                size="small"
              />
            </router-link>
          </li>
        </ul>
      </div>

      <div v-if="salesNavItems.length > 0" class="nav-section">
        <div v-if="!collapsed" class="nav-section-title">Sales</div>
        <ul class="nav-list">
          <li v-for="item in salesNavItems" :key="item.to" class="nav-item">
            <router-link :to="item.to" class="nav-link" active-class="active">
              <i :class="item.icon" />
              <span v-if="!collapsed" class="nav-text">{{ item.label }}</span>
              <Badge
                v-if="item.badge && !collapsed"
                :value="item.badge"
                severity="info"
                size="small"
              />
            </router-link>
          </li>
        </ul>
      </div>

      <div v-if="inventoryNavItems.length > 0" class="nav-section">
        <div v-if="!collapsed" class="nav-section-title">Inventory</div>
        <ul class="nav-list">
          <li v-for="item in inventoryNavItems" :key="item.to" class="nav-item">
            <router-link :to="item.to" class="nav-link" active-class="active">
              <i :class="item.icon" />
              <span v-if="!collapsed" class="nav-text">{{ item.label }}</span>
              <Badge
                v-if="item.badge && !collapsed"
                :value="item.badge"
                severity="info"
                size="small"
              />
            </router-link>
          </li>
        </ul>
      </div>

      <div v-if="accountingNavItems.length > 0" class="nav-section">
        <div v-if="!collapsed" class="nav-section-title">Accounting</div>
        <ul class="nav-list">
          <li v-for="item in accountingNavItems" :key="item.to" class="nav-item">
            <router-link :to="item.to" class="nav-link" active-class="active">
              <i :class="item.icon" />
              <span v-if="!collapsed" class="nav-text">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div v-if="hrNavItems.length > 0" class="nav-section">
        <div v-if="!collapsed" class="nav-section-title">HR</div>
        <ul class="nav-list">
          <li v-for="item in hrNavItems" :key="item.to" class="nav-item">
            <router-link :to="item.to" class="nav-link" active-class="active">
              <i :class="item.icon" />
              <span v-if="!collapsed" class="nav-text">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div v-if="settingsNavItems.length > 0" class="nav-section">
        <div v-if="!collapsed" class="nav-section-title">Settings</div>
        <ul class="nav-list">
          <li v-for="item in settingsNavItems" :key="item.to" class="nav-item">
            <router-link :to="item.to" class="nav-link" active-class="active">
              <i :class="item.icon" />
              <span v-if="!collapsed" class="nav-text">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- User Actions -->
    <div class="sidebar-footer">
      <div class="nav-section">
        <ul class="nav-list">
          <li class="nav-item">
            <button class="nav-link" @click="toggleTheme">
              <i :class="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'" />
              <span v-if="!collapsed" class="nav-text">
                {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
              </span>
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" @click="$emit('logout')">
              <i class="pi pi-sign-out" />
              <span v-if="!collapsed" class="nav-text">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

interface NavItem {
  to: string
  label: string
  icon: string
  badge?: string | number
}

interface Props {
  modelValue?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'logout'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<Emits>()
const router = useRouter()

// Reactive state
const collapsed = ref(props.modelValue)
const isMobile = ref(false)
const isDarkMode = ref(false)

// Navigation items
const mainNavItems = ref<NavItem[]>([
  { to: '/dashboard', label: 'Dashboard', icon: 'pi pi-home' },
  { to: '/showcase', label: 'Showcase', icon: 'pi pi-palette' }
])

const demoNavItems = ref<NavItem[]>([
  { to: '/demo/access', label: 'Access Control', icon: 'pi pi-shield' },
  { to: '/demo/schemas', label: 'Schemas', icon: 'pi pi-sitemap' },
  { to: '/demo/renderer', label: 'Renderer', icon: 'pi pi-eye' }
])

const crmNavItems = ref<NavItem[]>([
  { to: '/customers', label: 'Customers', icon: 'pi pi-users' },
  { to: '/leads', label: 'Leads', icon: 'pi pi-star', badge: '12' },
  { to: '/contacts', label: 'Contacts', icon: 'pi pi-phone' },
  { to: '/opportunities', label: 'Opportunities', icon: 'pi pi-chart-line' }
])

const salesNavItems = ref<NavItem[]>([
  { to: '/quotes', label: 'Quotes', icon: 'pi pi-file' },
  { to: '/orders', label: 'Orders', icon: 'pi pi-shopping-bag', badge: '3' },
  { to: '/invoices', label: 'Invoices', icon: 'pi pi-receipt' },
  { to: '/payments', label: 'Payments', icon: 'pi pi-credit-card' }
])

const inventoryNavItems = ref<NavItem[]>([
  { to: '/products', label: 'Products', icon: 'pi pi-tag' },
  { to: '/stock', label: 'Stock', icon: 'pi pi-database' },
  { to: '/warehouses', label: 'Warehouses', icon: 'pi pi-building' },
  { to: '/suppliers', label: 'Suppliers', icon: 'pi pi-truck' }
])

const accountingNavItems = ref<NavItem[]>([
  { to: '/accounts', label: 'Chart of Accounts', icon: 'pi pi-list' },
  { to: '/journal', label: 'Journal Entries', icon: 'pi pi-book' },
  { to: '/reports', label: 'Reports', icon: 'pi pi-chart-bar' },
  { to: '/taxes', label: 'Taxes', icon: 'pi pi-percentage' }
])

const hrNavItems = ref<NavItem[]>([
  { to: '/employees', label: 'Employees', icon: 'pi pi-users' },
  { to: '/payroll', label: 'Payroll', icon: 'pi pi-money-bill' },
  { to: '/attendance', label: 'Attendance', icon: 'pi pi-clock' },
  { to: '/leave', label: 'Leave', icon: 'pi pi-calendar' }
])

const settingsNavItems = ref<NavItem[]>([
  { to: '/settings/general', label: 'General', icon: 'pi pi-sliders-h' },
  { to: '/settings/users', label: 'Users & Roles', icon: 'pi pi-users' },
  { to: '/settings/integrations', label: 'Integrations', icon: 'pi pi-link' },
  { to: '/settings/security', label: 'Security', icon: 'pi pi-shield' }
])

// Computed properties
const sidebarWidth = computed(() => collapsed.value ? '80px' : '280px')

// Methods
const toggleCollapse = () => {
  collapsed.value = !collapsed.value
  emit('update:modelValue', collapsed.value)
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  const html = document.documentElement
  if (isDarkMode.value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
  // Store preference
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    collapsed.value = true
  }
}

// Lifecycle
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // Load theme preference
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Watch for prop changes
watch(() => props.modelValue, (newVal) => {
  collapsed.value = newVal
})
</script>

<style scoped>
.app-sidebar {
  height: 100vh;
  background: var(--p-surface-0);
  border-right: 1px solid var(--p-border-color);
  transition: width 0.3s ease;
  width: v-bind(sidebarWidth);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  overflow: hidden;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid var(--p-border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--p-primary-color);
}

.logo i {
  font-size: 1.5rem;
}

.logo-text {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.sidebar-collapsed .logo-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.collapse-btn {
  width: 32px;
  height: 32px;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-section {
  margin-bottom: 2rem;
}

.nav-section:last-child {
  margin-bottom: 0;
}

.nav-section-title {
  padding: 0 1rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--p-text-muted-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--p-text-color);
  text-decoration: none;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.nav-link:hover {
  background: var(--p-surface-hover);
}

.nav-link.active {
  background: var(--p-primary-50);
  color: var(--p-primary-color);
  border-right: 3px solid var(--p-primary-color);
}

.nav-link i {
  font-size: 1.125rem;
  min-width: 18px;
  text-align: center;
}

.nav-text {
  opacity: 1;
  transition: opacity 0.3s ease;
  white-space: nowrap;
}

.sidebar-collapsed .nav-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.sidebar-footer {
  border-top: 1px solid var(--p-border-color);
  padding: 1rem 0 0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .app-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .app-sidebar.show {
    transform: translateX(0);
  }
}

/* Dark mode adjustments */
:global(.dark) .app-sidebar {
  background: var(--p-surface-900);
  border-right-color: var(--p-surface-700);
}

:global(.dark) .sidebar-header {
  border-bottom-color: var(--p-surface-700);
}

:global(.dark) .sidebar-footer {
  border-top-color: var(--p-surface-700);
}
</style>