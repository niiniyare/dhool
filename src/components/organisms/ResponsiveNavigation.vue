<template>
  <div class="responsive-navigation">
    <!-- Desktop Sidebar -->
    <Sidebar
      v-if="!isMobile"
      v-model:visible="sidebarVisible"
      :position="sidebarPosition"
      :class="desktopSidebarClass"
      :modal="false"
      :dismissable="false"
      :close-on-escape="false"
      :show-close-icon="false"
      :auto-z-index="false"
    >
      <template #header>
        <DesktopSidebarHeader
          :collapsed="isCollapsed"
          :user="currentUser"
          @toggle-collapse="toggleCollapse"
        />
      </template>

      <DesktopSidebarContent
        :menu-items="menuItems"
        :collapsed="isCollapsed"
        :current-route="currentRoute"
        @navigate="handleNavigate"
      />

      <template #footer>
        <DesktopSidebarFooter
          :user="currentUser"
          :collapsed="isCollapsed"
          :is-dark="isDarkMode"
          @toggle-theme="toggleTheme"
          @profile-action="handleProfileAction"
        />
      </template>
    </Sidebar>

    <!-- Mobile Sidebar -->
    <MobileSidebar
      v-if="isMobile"
      v-model:visible="sidebarVisible"
      :user="currentUser"
      :is-dark-theme="isDarkMode"
      @navigate="handleNavigate"
      @theme-toggle="toggleTheme"
      @sign-out="handleSignOut"
      @hide="onMobileSidebarHide"
    />

    <!-- Mobile Header Bar -->
    <div v-if="isMobile" class="mobile-header-bar">
      <MobileHeader
        :user="currentUser"
        :notifications-count="notificationsCount"
        @toggle-sidebar="toggleSidebar"
        @open-notifications="openNotifications"
        @open-profile="openProfile"
      />
    </div>

    <!-- Desktop Header Bar -->
    <div v-else class="desktop-header-bar">
      <DesktopHeader
        :page-title="pageTitle"
        :user="currentUser"
        :notifications-count="notificationsCount"
        :search-query="searchQuery"
        @search="handleSearch"
        @open-notifications="openNotifications"
        @open-profile="openProfile"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'
import MobileSidebar from '@/components/molecules/MobileSidebar.vue'
import DesktopSidebarHeader from '@/components/molecules/DesktopSidebarHeader.vue'
import DesktopSidebarContent from '@/components/molecules/DesktopSidebarContent.vue'
import DesktopSidebarFooter from '@/components/molecules/DesktopSidebarFooter.vue'
import MobileHeader from '@/components/molecules/MobileHeader.vue'
import DesktopHeader from '@/components/molecules/DesktopHeader.vue'

// Types
interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface MenuItem {
  label: string
  icon: string
  to?: string
  items?: MenuItem[]
  badge?: string
  badgeClass?: string
  visible?: boolean
}

// Props
interface Props {
  user?: User
  menuItems?: MenuItem[]
  pageTitle?: string
  isDarkMode?: boolean
  notificationsCount?: number
  searchQuery?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageTitle: 'Dashboard',
  isDarkMode: false,
  notificationsCount: 0,
  searchQuery: ''
})

// Emits
const emit = defineEmits<{
  'navigate': [route: string]
  'search': [query: string]
  'toggle-theme': []
  'open-notifications': []
  'open-profile': []
  'profile-action': [action: string]
  'sign-out': []
}>()

// Composables
const route = useRoute()
const {
  visible: sidebarVisible,
  collapsed: isCollapsed,
  position: sidebarPosition,
  isMobile,
  isTablet,
  isDesktop,
  sidebarClasses,
  toggle: toggleSidebar,
  toggleCollapse,
  onSidebarHide
} = useSidebar({
  visible: true,
  collapsed: false,
  position: 'left'
})

// Computed
const currentRoute = computed(() => route.path)

const currentUser = computed(() => 
  props.user || {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Admin'
  }
)

const desktopSidebarClass = computed(() => [
  ...sidebarClasses.value,
  'desktop-sidebar',
  {
    'sidebar-collapsed': isCollapsed.value
  }
])

// Default menu items
const menuItems = computed(() => 
  props.menuItems || [
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
      label: 'Settings',
      icon: 'pi pi-cog',
      items: [
        { label: 'General', icon: 'pi pi-sliders-h', to: '/settings/general' },
        { label: 'Users & Roles', icon: 'pi pi-users', to: '/settings/users' },
        { label: 'Integrations', icon: 'pi pi-link', to: '/settings/integrations' }
      ]
    }
  ]
)

// Methods
const handleNavigate = (route: string) => {
  emit('navigate', route)
}

const handleSearch = (query: string) => {
  emit('search', query)
}

const toggleTheme = () => {
  emit('toggle-theme')
}

const openNotifications = () => {
  emit('open-notifications')
}

const openProfile = () => {
  emit('open-profile')
}

const handleProfileAction = (action: string) => {
  emit('profile-action', action)
}

const handleSignOut = () => {
  emit('sign-out')
}

const onMobileSidebarHide = () => {
  onSidebarHide()
}
</script>

<style scoped>
.responsive-navigation {
  @apply relative;
}

.mobile-header-bar {
  @apply sticky top-0 z-40 md:hidden;
}

.desktop-header-bar {
  @apply hidden md:block;
}

.desktop-sidebar {
  @apply transition-all duration-300;
  width: 280px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 30;
}

.desktop-sidebar.sidebar-collapsed {
  width: 80px;
}

.desktop-sidebar :deep(.p-sidebar) {
  @apply border-r border-surface-200 dark:border-surface-700;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

.desktop-sidebar :deep(.p-sidebar-content) {
  @apply flex flex-col h-full;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .desktop-sidebar {
    @apply hidden;
  }
}

@media (min-width: 769px) {
  .mobile-header-bar {
    @apply hidden;
  }
}

/* Animation for sidebar toggle */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}

/* Backdrop for mobile sidebar */
.mobile-sidebar :deep(.p-sidebar-mask) {
  @apply bg-black bg-opacity-50 backdrop-blur-sm;
}
</style>