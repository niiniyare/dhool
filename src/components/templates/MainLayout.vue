<template>
  <div class="main-layout">
    <!-- Mobile Header -->
    <div class="mobile-header md:hidden">
      <div class="flex items-center justify-between p-4 bg-surface-0 border-b border-surface-200 dark:border-surface-700">
        <div class="flex items-center gap-3">
          <Button
            icon="pi pi-bars"
            severity="secondary"
            text
            @click="toggleMobileSidebar"
            class="p-2"
          />
          <img src="/logo.svg" alt="Dhool ERP" class="h-8" />
        </div>
        
        <div class="flex items-center gap-2">
          <!-- Notifications -->
          <Button
            icon="pi pi-bell"
            severity="secondary"
            text
            badge="3"
            badge-severity="danger"
            @click="toggleNotifications"
            class="p-2"
          />
          
          <!-- Profile Menu -->
          <Button
            type="button"
            class="p-0 w-10 h-10"
            @click="toggleProfileMenu"
          >
            <Avatar
              :label="userInitials"
              shape="circle"
              size="normal"
              class="w-full h-full"
            />
          </Button>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <Sidebar
      v-model:visible="sidebarVisible"
      :position="sidebarPosition"
      :class="sidebarClass"
      :modal="isMobile"
      :dismissable="isMobile"
      :close-on-escape="isMobile"
      :show-close-icon="false"
      :auto-z-index="true"
      @hide="onSidebarHide"
    >
      <template #header>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-3">
            <img src="/logo.svg" alt="Dhool ERP" class="h-8" />
            <span v-if="!isCollapsed" class="font-semibold text-lg">Dhool ERP</span>
          </div>
          
          <!-- Desktop collapse toggle -->
          <Button
            v-if="!isMobile"
            :icon="isCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"
            severity="secondary"
            text
            @click="toggleCollapse"
            class="p-2"
          />
        </div>
      </template>

      <!-- Navigation Menu -->
      <PanelMenu
        :model="menuItems"
        class="sidebar-menu"
        :multiple="false"
      />

      <!-- Sidebar Footer -->
      <template #footer>
        <div class="sidebar-footer">
          <!-- User Profile Section -->
          <div class="user-profile-section">
            <div class="flex items-center gap-3 p-3 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg cursor-pointer transition-colors">
              <Avatar
                :label="userInitials"
                shape="circle"
                size="normal"
                class="flex-shrink-0"
              />
              <div v-if="!isCollapsed" class="flex-1 min-w-0">
                <div class="font-medium text-surface-900 dark:text-surface-0 truncate">
                  {{ currentUser.name }}
                </div>
                <div class="text-sm text-surface-600 dark:text-surface-400 truncate">
                  {{ currentUser.email }}
                </div>
              </div>
              <Button
                v-if="!isCollapsed"
                icon="pi pi-ellipsis-v"
                severity="secondary"
                text
                size="small"
                @click="toggleProfileMenu"
                class="flex-shrink-0"
              />
            </div>
          </div>

          <!-- Theme Toggle -->
          <div class="theme-toggle-section">
            <Button
              :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
              :label="isCollapsed ? undefined : (isDark ? 'Light Mode' : 'Dark Mode')"
              severity="secondary"
              text
              @click="toggleTheme"
              class="w-full justify-start"
            />
          </div>
        </div>
      </template>
    </Sidebar>

    <!-- Main Content Area -->
    <div class="main-content" :class="{ 'main-content-collapsed': isCollapsed && !isMobile }">
      <!-- Desktop Header -->
      <div class="desktop-header hidden md:flex items-center justify-between p-4 bg-surface-0 border-b border-surface-200 dark:border-surface-700">
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-semibold text-surface-900 dark:text-surface-0">
            {{ currentPageTitle }}
          </h1>
        </div>
        
        <div class="flex items-center gap-3">
          <!-- Search -->
          <IconField icon-position="left">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="searchQuery"
              placeholder="Search..."
              class="w-80"
            />
          </IconField>
          
          <!-- Notifications -->
          <Button
            icon="pi pi-bell"
            severity="secondary"
            text
            badge="3"
            badge-severity="danger"
            @click="toggleNotifications"
          />
          
          <!-- Profile Menu -->
          <Button
            type="button"
            class="p-0 w-10 h-10"
            @click="toggleProfileMenu"
          >
            <Avatar
              :label="userInitials"
              shape="circle"
              size="normal"
              class="w-full h-full"
            />
          </Button>
        </div>
      </div>

      <!-- Page Content -->
      <div class="page-content">
        <router-view />
      </div>
    </div>

    <!-- Profile Menu Overlay -->
    <OverlayPanel ref="profileMenu" :dismissable="true" class="w-80">
      <div class="profile-menu">
        <div class="profile-header p-4 border-b border-surface-200 dark:border-surface-700">
          <div class="flex items-center gap-3">
            <Avatar
              :label="userInitials"
              shape="circle"
              size="large"
            />
            <div>
              <div class="font-semibold text-surface-900 dark:text-surface-0">
                {{ currentUser.name }}
              </div>
              <div class="text-sm text-surface-600 dark:text-surface-400">
                {{ currentUser.email }}
              </div>
              <Chip :label="currentUser.role" size="small" class="mt-1" />
            </div>
          </div>
        </div>

        <div class="profile-actions p-2">
          <Button
            icon="pi pi-user"
            label="Profile Settings"
            severity="secondary"
            text
            class="w-full justify-start"
            @click="navigateToProfile"
          />
          <Button
            icon="pi pi-cog"
            label="Preferences"
            severity="secondary"
            text
            class="w-full justify-start"
            @click="navigateToPreferences"
          />
          <Button
            icon="pi pi-question-circle"
            label="Help & Support"
            severity="secondary"
            text
            class="w-full justify-start"
            @click="openHelp"
          />
          <Divider />
          <Button
            icon="pi pi-sign-out"
            label="Sign Out"
            severity="secondary"
            text
            class="w-full justify-start"
            @click="signOut"
          />
        </div>
      </div>
    </OverlayPanel>

    <!-- Notifications Panel -->
    <OverlayPanel ref="notificationsPanel" :dismissable="true" class="w-96">
      <div class="notifications-panel">
        <div class="notifications-header p-4 border-b border-surface-200 dark:border-surface-700">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-surface-900 dark:text-surface-0">
              Notifications
            </h3>
            <Button
              label="Mark all read"
              severity="secondary"
              text
              size="small"
              @click="markAllNotificationsRead"
            />
          </div>
        </div>

        <div class="notifications-list">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item p-3 hover:bg-surface-50 dark:hover:bg-surface-800 border-b border-surface-200 dark:border-surface-700 last:border-b-0"
            :class="{ 'bg-primary-50 dark:bg-primary-950': !notification.read }"
          >
            <div class="flex gap-3">
              <i 
                :class="notification.icon"
                :style="{ color: notification.color }"
                class="text-lg mt-1"
              />
              <div class="flex-1 min-w-0">
                <div class="font-medium text-surface-900 dark:text-surface-0">
                  {{ notification.title }}
                </div>
                <div class="text-sm text-surface-600 dark:text-surface-400 mt-1">
                  {{ notification.message }}
                </div>
                <div class="text-xs text-surface-500 dark:text-surface-500 mt-2">
                  {{ notification.time }}
                </div>
              </div>
              <div v-if="!notification.read" class="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

// Types
interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  icon: string
  color: string
}

interface MenuItem {
  label: string
  icon: string
  to?: string
  items?: MenuItem[]
  badge?: string
  badgeClass?: string
  command?: () => void
  visible?: boolean
}

// Composables
const router = useRouter()
const route = useRoute()
const toast = useToast()
const confirm = useConfirm()

// Refs
const profileMenu = ref()
const notificationsPanel = ref()
const sidebarVisible = ref(true)
const isCollapsed = ref(false)
const isDark = ref(false)
const searchQuery = ref('')

// Responsive state
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value < 768)
const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024)

// Sidebar configuration
const sidebarPosition = computed(() => 'left')
const sidebarClass = computed(() => [
  'main-sidebar',
  {
    'sidebar-collapsed': isCollapsed.value && !isMobile.value,
    'sidebar-mobile': isMobile.value
  }
])

// Current user (would come from auth store)
const currentUser = ref<User>({
  id: '1',
  name: 'John Smith',
  email: 'john.smith@company.com',
  role: 'Admin'
})

const userInitials = computed(() => {
  return currentUser.value.name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
})

// Page title
const currentPageTitle = computed(() => {
  const routeMeta = route.meta
  return routeMeta?.title || 'Dashboard'
})

// Navigation menu items
const menuItems = ref<MenuItem[]>([
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    to: '/dashboard'
  },
  {
    label: 'CRM',
    icon: 'pi pi-users',
    items: [
      { label: 'Customers', icon: 'pi pi-user', to: '/customers' },
      { label: 'Leads', icon: 'pi pi-star', to: '/leads' },
      { label: 'Contacts', icon: 'pi pi-phone', to: '/contacts' },
      { label: 'Opportunities', icon: 'pi pi-chart-line', to: '/opportunities' }
    ]
  },
  {
    label: 'Sales',
    icon: 'pi pi-shopping-cart',
    items: [
      { label: 'Quotes', icon: 'pi pi-file', to: '/quotes' },
      { label: 'Orders', icon: 'pi pi-shopping-bag', to: '/orders' },
      { label: 'Invoices', icon: 'pi pi-receipt', to: '/invoices' },
      { label: 'Payments', icon: 'pi pi-credit-card', to: '/payments' }
    ]
  },
  {
    label: 'Inventory',
    icon: 'pi pi-box',
    items: [
      { label: 'Products', icon: 'pi pi-tag', to: '/products' },
      { label: 'Stock', icon: 'pi pi-database', to: '/stock' },
      { label: 'Warehouses', icon: 'pi pi-building', to: '/warehouses' },
      { label: 'Suppliers', icon: 'pi pi-truck', to: '/suppliers' }
    ]
  },
  {
    label: 'Accounting',
    icon: 'pi pi-calculator',
    items: [
      { label: 'Chart of Accounts', icon: 'pi pi-list', to: '/accounts' },
      { label: 'Journal Entries', icon: 'pi pi-book', to: '/journal' },
      { label: 'Reports', icon: 'pi pi-chart-bar', to: '/reports' },
      { label: 'Taxes', icon: 'pi pi-percentage', to: '/taxes' }
    ]
  },
  {
    label: 'HR',
    icon: 'pi pi-id-card',
    items: [
      { label: 'Employees', icon: 'pi pi-users', to: '/employees' },
      { label: 'Payroll', icon: 'pi pi-money-bill', to: '/payroll' },
      { label: 'Attendance', icon: 'pi pi-clock', to: '/attendance' },
      { label: 'Leave', icon: 'pi pi-calendar', to: '/leave' }
    ]
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    items: [
      { label: 'General', icon: 'pi pi-sliders-h', to: '/settings/general' },
      { label: 'Users & Roles', icon: 'pi pi-users', to: '/settings/users' },
      { label: 'Integrations', icon: 'pi pi-link', to: '/settings/integrations' },
      { label: 'Security', icon: 'pi pi-shield', to: '/settings/security' }
    ]
  }
])

// Sample notifications
const notifications = ref<Notification[]>([
  {
    id: '1',
    title: 'New Order Received',
    message: 'Order #ORD-2024-001 from Acme Corp needs approval',
    time: '2 minutes ago',
    read: false,
    icon: 'pi pi-shopping-cart',
    color: 'var(--green-500)'
  },
  {
    id: '2',
    title: 'Payment Overdue',
    message: 'Invoice #INV-2024-123 is 5 days overdue',
    time: '1 hour ago',
    read: false,
    icon: 'pi pi-exclamation-triangle',
    color: 'var(--red-500)'
  },
  {
    id: '3',
    title: 'Stock Low Alert',
    message: 'Product "Wireless Headphones" is running low',
    time: '3 hours ago',
    read: true,
    icon: 'pi pi-info-circle',
    color: 'var(--blue-500)'
  }
])

// Methods
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
  
  // Auto-hide sidebar on mobile
  if (isMobile.value) {
    sidebarVisible.value = false
    isCollapsed.value = false
  } else {
    sidebarVisible.value = true
  }
}

const toggleMobileSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

const toggleCollapse = () => {
  if (!isMobile.value) {
    isCollapsed.value = !isCollapsed.value
  }
}

const onSidebarHide = () => {
  if (isMobile.value) {
    sidebarVisible.value = false
  }
}

const toggleProfileMenu = (event: Event) => {
  profileMenu.value.toggle(event)
}

const toggleNotifications = (event: Event) => {
  notificationsPanel.value.toggle(event)
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  // Theme switching logic would go here
  document.documentElement.classList.toggle('dark', isDark.value)
  
  toast.add({
    severity: 'info',
    summary: 'Theme Changed',
    detail: `Switched to ${isDark.value ? 'dark' : 'light'} mode`,
    life: 3000
  })
}

const navigateToProfile = () => {
  router.push('/profile')
  profileMenu.value.hide()
}

const navigateToPreferences = () => {
  router.push('/preferences')
  profileMenu.value.hide()
}

const openHelp = () => {
  // Open help documentation
  window.open('/help', '_blank')
  profileMenu.value.hide()
}

const signOut = () => {
  confirm.require({
    message: 'Are you sure you want to sign out?',
    header: 'Confirm Sign Out',
    icon: 'pi pi-question-circle',
    rejectClass: 'p-button-secondary p-button-outlined',
    rejectLabel: 'Cancel',
    acceptLabel: 'Sign Out',
    accept: () => {
      // Sign out logic
      router.push('/login')
      toast.add({
        severity: 'success',
        summary: 'Signed Out',
        detail: 'You have been successfully signed out',
        life: 3000
      })
    }
  })
  profileMenu.value.hide()
}

const markAllNotificationsRead = () => {
  notifications.value.forEach(n => n.read = true)
  toast.add({
    severity: 'success',
    summary: 'Notifications',
    detail: 'All notifications marked as read',
    life: 3000
  })
}

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
  updateWindowWidth()
  
  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme')
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = savedTheme ? savedTheme === 'dark' : systemDark
  document.documentElement.classList.toggle('dark', isDark.value)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})
</script>

<style scoped>
.main-layout {
  @apply min-h-screen bg-surface-50 dark:bg-surface-950;
}

.mobile-header {
  @apply sticky top-0 z-40;
}

.main-sidebar {
  @apply transition-all duration-300;
  width: 280px;
}

.main-sidebar.sidebar-collapsed {
  width: 80px;
}

.main-sidebar.sidebar-mobile {
  width: 280px;
}

.main-content {
  @apply transition-all duration-300;
  margin-left: 280px;
  min-height: 100vh;
}

.main-content-collapsed {
  margin-left: 80px;
}

@media (max-width: 768px) {
  .main-content,
  .main-content-collapsed {
    margin-left: 0;
  }
}

.desktop-header {
  @apply sticky top-0 z-30;
}

.page-content {
  @apply flex-1 p-6;
}

.sidebar-menu {
  @apply border-none;
}

.sidebar-menu :deep(.p-panelmenu-panel) {
  @apply border-none;
}

.sidebar-menu :deep(.p-panelmenu-header) {
  @apply border-none bg-transparent;
}

.sidebar-menu :deep(.p-panelmenu-header > a) {
  @apply border-none bg-transparent px-4 py-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800;
  transition: background-color 0.3s;
}

.sidebar-menu :deep(.p-panelmenu-header > a.p-panelmenu-header-link) {
  @apply text-surface-700 dark:text-surface-300;
}

.sidebar-menu :deep(.p-panelmenu-content) {
  @apply border-none bg-transparent;
}

.sidebar-menu :deep(.p-panelmenu-content .p-menuitem-link) {
  @apply px-6 py-2 ml-6 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg;
  transition: all 0.3s;
}

.sidebar-menu :deep(.p-panelmenu-content .p-menuitem-link:hover) {
  @apply text-surface-800 dark:text-surface-200;
}

.sidebar-menu :deep(.p-panelmenu-content .p-menuitem-link.router-link-active) {
  @apply bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300;
}

.sidebar-footer {
  @apply border-t border-surface-200 dark:border-surface-700 pt-4;
}

.user-profile-section {
  @apply mb-4;
}

.theme-toggle-section {
  @apply mb-2;
}

.profile-menu {
  @apply min-w-0;
}

.notifications-panel {
  @apply max-h-96 overflow-hidden;
}

.notifications-list {
  @apply max-h-80 overflow-y-auto;
}

.notification-item {
  @apply cursor-pointer;
  transition: background-color 0.3s;
}

/* Collapsed sidebar styles */
.sidebar-collapsed .sidebar-menu :deep(.p-panelmenu-header > a) {
  @apply justify-center px-2;
}

.sidebar-collapsed .sidebar-menu :deep(.p-panelmenu-header .p-menuitem-text) {
  @apply hidden;
}

.sidebar-collapsed .sidebar-menu :deep(.p-panelmenu-content) {
  @apply hidden;
}

.sidebar-collapsed .user-profile-section :deep(.p-button .p-button-label) {
  @apply hidden;
}

.sidebar-collapsed .theme-toggle-section :deep(.p-button .p-button-label) {
  @apply hidden;
}

/* Custom scrollbar */
.notifications-list::-webkit-scrollbar {
  width: 4px;
}

.notifications-list::-webkit-scrollbar-track {
  @apply bg-surface-100 dark:bg-surface-800;
}

.notifications-list::-webkit-scrollbar-thumb {
  @apply bg-surface-300 dark:bg-surface-600 rounded-full;
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  @apply bg-surface-400 dark:bg-surface-500;
}
</style>