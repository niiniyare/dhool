<template>
  <div class="app-topbar">
    <!-- Left Section: Mobile Menu + Breadcrumb/Title -->
    <div class="topbar-left">
      <Button
        v-if="isMobile"
        icon="pi pi-bars"
        class="mobile-menu-btn"
        text
        rounded
        @click="$emit('toggle-sidebar')"
      />
      <div class="breadcrumb">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <div v-if="breadcrumbItems.length" class="breadcrumb-nav">
          <span v-for="(item, index) in breadcrumbItems" :key="index" class="breadcrumb-item">
            <router-link v-if="item.to && index < breadcrumbItems.length - 1" :to="item.to">
              {{ item.label }}
            </router-link>
            <span v-else>{{ item.label }}</span>
            <i v-if="index < breadcrumbItems.length - 1" class="pi pi-angle-right breadcrumb-separator" />
          </span>
        </div>
      </div>
    </div>

    <!-- Right Section: Search + Actions + User Menu -->
    <div class="topbar-right">
      <!-- Global Search -->
      <div class="search-container">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            placeholder="Search anything..."
            class="search-input"
            @keyup.enter="performSearch"
            @input="onSearchInput"
          />
        </IconField>
        
        <!-- Search Results Dropdown -->
        <div v-if="showSearchResults && searchResults.length > 0" class="search-results">
          <div class="search-results-header">
            <span>Search Results</span>
            <Button icon="pi pi-times" text size="small" @click="clearSearch" />
          </div>
          <ul class="search-results-list">
            <li
              v-for="result in searchResults"
              :key="`${result.type}-${result.id}`"
              class="search-result-item"
              @click="navigateToResult(result)"
            >
              <div class="result-icon">
                <i :class="getResultIcon(result.type)" />
              </div>
              <div class="result-content">
                <div class="result-title">{{ result.title }}</div>
                <div class="result-subtitle">{{ result.subtitle }}</div>
              </div>
              <div class="result-type">
                <Tag :value="result.type" severity="secondary" />
              </div>
            </li>
          </ul>
          <div v-if="searchResults.length >= 5" class="search-results-footer">
            <Button
              label="View All Results"
              icon="pi pi-external-link"
              text
              size="small"
              @click="viewAllResults"
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <!-- Notifications -->
        <Button
          icon="pi pi-bell"
          class="action-btn"
          text
          rounded
          badge="3"
          badge-class="notification-badge"
          @click="showNotifications = true"
        />
        
        <!-- Quick Actions -->
        <Button
          icon="pi pi-plus"
          class="action-btn"
          text
          rounded
          @click="showQuickActions = !showQuickActions"
        />
      </div>

      <!-- User Menu -->
      <div class="user-menu">
        <Button
          class="user-menu-trigger"
          text
          @click="showUserMenu = !showUserMenu"
        >
          <div class="user-avatar">
            <Avatar
              :label="userInitials"
              shape="circle"
              size="normal"
              :style="{ backgroundColor: userAvatarColor }"
            />
          </div>
          <div v-if="!isMobile" class="user-info">
            <div class="user-name">{{ currentUser?.name || 'User' }}</div>
            <div class="user-role">{{ currentUser?.role || 'Member' }}</div>
          </div>
          <i class="pi pi-chevron-down user-menu-icon" />
        </Button>

        <!-- User Dropdown Menu -->
        <div v-if="showUserMenu" class="user-dropdown" v-click-outside="closeUserMenu">
          <div class="user-dropdown-header">
            <Avatar
              :label="userInitials"
              shape="circle"
              size="large"
              :style="{ backgroundColor: userAvatarColor }"
            />
            <div class="user-details">
              <div class="user-name">{{ currentUser?.name || 'User' }}</div>
              <div class="user-email">{{ currentUser?.email || 'user@example.com' }}</div>
              <div class="user-role">{{ currentUser?.role || 'Member' }}</div>
            </div>
          </div>
          
          <Divider />
          
          <ul class="user-menu-items">
            <li class="menu-item">
              <router-link to="/profile" class="menu-link" @click="closeUserMenu">
                <i class="pi pi-user" />
                <span>Profile</span>
              </router-link>
            </li>
            <li class="menu-item">
              <router-link to="/settings" class="menu-link" @click="closeUserMenu">
                <i class="pi pi-cog" />
                <span>Settings</span>
              </router-link>
            </li>
            <li class="menu-item">
              <button class="menu-link" @click="toggleTheme">
                <i :class="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'" />
                <span>{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
              </button>
            </li>
            <li class="menu-item">
              <router-link to="/help" class="menu-link" @click="closeUserMenu">
                <i class="pi pi-question-circle" />
                <span>Help & Support</span>
              </router-link>
            </li>
          </ul>
          
          <Divider />
          
          <div class="user-menu-footer">
            <Button
              label="Sign Out"
              icon="pi pi-sign-out"
              class="logout-btn"
              text
              @click="handleLogout"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications Sidebar -->
    <Sidebar v-model:visible="showNotifications" header="Notifications" position="right">
      <div class="notification-list">
        <div v-for="notification in notifications" :key="notification.id" class="notification-item">
          <div class="notification-icon">
            <i :class="getNotificationIcon(notification.type)" />
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
          </div>
        </div>
      </div>
    </Sidebar>

    <!-- Quick Actions Menu -->
    <Menu
      v-if="showQuickActions"
      ref="quickActionsMenu"
      :model="quickActionItems"
      popup
      @hide="showQuickActions = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface BreadcrumbItem {
  label: string
  to?: string
}

interface SearchResult {
  id: string
  type: string
  title: string
  subtitle: string
  url: string
}

interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  createdAt: string
  read: boolean
}

interface Emits {
  (e: 'toggle-sidebar'): void
  (e: 'logout'): void
}

const emit = defineEmits<Emits>()
const route = useRoute()
const router = useRouter()

// Reactive state
const isMobile = ref(false)
const isDarkMode = ref(false)
const searchQuery = ref('')
const showSearchResults = ref(false)
const showUserMenu = ref(false)
const showNotifications = ref(false)
const showQuickActions = ref(false)
const searchResults = ref<SearchResult[]>([])

// Mock user data
const currentUser = ref<User>({
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Administrator'
})

// Mock notifications
const notifications = ref<Notification[]>([
  {
    id: '1',
    type: 'info',
    title: 'New Update Available',
    message: 'System update v2.1.0 is ready to install',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    read: false
  },
  {
    id: '2',
    type: 'success',
    title: 'Backup Completed',
    message: 'Daily backup completed successfully',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    read: false
  },
  {
    id: '3',
    type: 'warning',
    title: 'Storage Space Low',
    message: 'Available storage is below 10%',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    read: true
  }
])

// Computed properties
const pageTitle = computed(() => {
  return route.meta?.title as string || route.name as string || 'Dashboard'
})

const breadcrumbItems = computed((): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = []
  
  if (route.matched.length > 1) {
    route.matched.forEach((match, index) => {
      if (match.meta?.breadcrumb !== false) {
        items.push({
          label: match.meta?.title as string || match.name as string || '',
          to: index < route.matched.length - 1 ? match.path : undefined
        })
      }
    })
  }
  
  return items
})

const userInitials = computed(() => {
  const name = currentUser.value?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const userAvatarColor = computed(() => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
  const charCode = currentUser.value?.name?.charCodeAt(0) || 65
  return colors[charCode % colors.length]
})

// Quick actions menu items
const quickActionItems = ref([
  {
    label: 'New Contact',
    icon: 'pi pi-user-plus',
    command: () => router.push('/contacts/new')
  },
  {
    label: 'New Project',
    icon: 'pi pi-plus-circle',
    command: () => router.push('/projects/new')
  },
  {
    label: 'New Document',
    icon: 'pi pi-file-plus',
    command: () => router.push('/documents/new')
  },
  { separator: true },
  {
    label: 'Import Data',
    icon: 'pi pi-upload',
    command: () => router.push('/import')
  },
  {
    label: 'Export Data',
    icon: 'pi pi-download',
    command: () => router.push('/export')
  }
])

// Methods
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const onSearchInput = () => {
  if (searchQuery.value.length > 2) {
    performSearch()
  } else {
    showSearchResults.value = false
    searchResults.value = []
  }
}

const performSearch = async () => {
  if (searchQuery.value.trim().length < 3) return

  // Mock search - replace with actual API call
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'Contact',
      title: `Contact matching "${searchQuery.value}"`,
      subtitle: 'contact@example.com',
      url: '/contacts/1'
    },
    {
      id: '2',
      type: 'Project',
      title: `Project containing "${searchQuery.value}"`,
      subtitle: 'Active project',
      url: '/projects/2'
    },
    {
      id: '3',
      type: 'Document',
      title: `Document about "${searchQuery.value}"`,
      subtitle: 'Created yesterday',
      url: '/documents/3'
    }
  ]

  searchResults.value = mockResults
  showSearchResults.value = true
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  showSearchResults.value = false
}

const navigateToResult = (result: SearchResult) => {
  router.push(result.url)
  clearSearch()
}

const viewAllResults = () => {
  router.push({
    name: 'search',
    query: { q: searchQuery.value }
  })
  clearSearch()
}

const getResultIcon = (type: string): string => {
  const icons: Record<string, string> = {
    Contact: 'pi pi-user',
    Project: 'pi pi-folder',
    Document: 'pi pi-file',
    Task: 'pi pi-check-square'
  }
  return icons[type] || 'pi pi-search'
}

const getNotificationIcon = (type: string): string => {
  const icons: Record<string, string> = {
    info: 'pi pi-info-circle',
    warning: 'pi pi-exclamation-triangle',
    error: 'pi pi-times-circle',
    success: 'pi pi-check-circle'
  }
  return icons[type] || 'pi pi-bell'
}

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  const html = document.documentElement
  if (isDarkMode.value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  closeUserMenu()
}

const handleLogout = () => {
  closeUserMenu()
  emit('logout')
}

// Click outside directive
const vClickOutside = {
  beforeMount(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = function(event: Event) {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
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

// Close search results when clicking outside
watch(showSearchResults, (newValue) => {
  if (newValue) {
    const closeOnClickOutside = (event: Event) => {
      const searchContainer = document.querySelector('.search-container')
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        showSearchResults.value = false
        document.removeEventListener('click', closeOnClickOutside)
      }
    }
    setTimeout(() => {
      document.addEventListener('click', closeOnClickOutside)
    }, 100)
  }
})
</script>

<style scoped>
.app-topbar {
  height: 72px;
  background: var(--p-surface-0);
  border-bottom: 1px solid var(--p-border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Left Section */
.topbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.mobile-menu-btn {
  width: 40px;
  height: 40px;
}

.breadcrumb {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--p-text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
}

.breadcrumb-item a {
  color: var(--p-primary-color);
  text-decoration: none;
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  font-size: 0.75rem;
  margin: 0 0.25rem;
}

/* Right Section */
.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Search */
.search-container {
  position: relative;
}

.search-input {
  width: 300px;
  background: var(--p-surface-100);
  border: 1px solid var(--p-border-color);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--p-surface-0);
  border: 1px solid var(--p-border-color);
  border-radius: var(--p-border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.search-results-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--p-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.search-results-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-result-item:hover {
  background: var(--p-surface-hover);
}

.result-icon i {
  color: var(--p-primary-color);
  font-size: 1.125rem;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-weight: 500;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-subtitle {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-results-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--p-border-color);
  text-align: center;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
  width: 40px;
  height: 40px;
  position: relative;
}

:global(.notification-badge) {
  background: var(--p-red-500);
  color: white;
  font-size: 0.75rem;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border: none;
  background: none;
  border-radius: var(--p-border-radius);
  transition: background 0.2s ease;
}

.user-menu-trigger:hover {
  background: var(--p-surface-hover);
}

.user-avatar {
  display: flex;
  align-items: center;
}

.user-info {
  text-align: left;
  line-height: 1.2;
}

.user-name {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--p-text-color);
}

.user-role {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
}

.user-menu-icon {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  transition: transform 0.2s ease;
}

.user-menu-trigger:hover .user-menu-icon {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--p-surface-0);
  border: 1px solid var(--p-border-color);
  border-radius: var(--p-border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  margin-top: 0.5rem;
  z-index: 1000;
}

.user-dropdown-header {
  padding: 1.5rem 1rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-details {
  flex: 1;
}

.user-details .user-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.user-email {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
  margin-bottom: 0.25rem;
}

.user-details .user-role {
  font-size: 0.75rem;
  color: var(--p-primary-color);
  background: var(--p-primary-50);
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  display: inline-block;
}

.user-menu-items {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.menu-item {
  margin: 0;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--p-text-color);
  text-decoration: none;
  transition: background 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 0.875rem;
  cursor: pointer;
}

.menu-link:hover {
  background: var(--p-surface-hover);
}

.menu-link i {
  font-size: 1rem;
  color: var(--p-text-muted-color);
}

.user-menu-footer {
  padding: 0.5rem 1rem 1rem;
}

.logout-btn {
  width: 100%;
  color: var(--p-red-500);
  justify-content: center;
}

/* Notifications */
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-item {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--p-surface-50);
  border-radius: var(--p-border-radius);
}

.notification-icon i {
  font-size: 1.125rem;
  color: var(--p-primary-color);
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.notification-message {
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
  margin-bottom: 0.5rem;
}

.notification-time {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .app-topbar {
    padding: 0 1rem;
  }
  
  .search-input {
    width: 200px;
  }
  
  .user-info {
    display: none;
  }
  
  .breadcrumb-nav {
    display: none;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 576px) {
  .search-container {
    display: none;
  }
  
  .topbar-right {
    gap: 0.5rem;
  }
}

/* Dark mode adjustments */
:global(.dark) .app-topbar {
  background: var(--p-surface-900);
  border-bottom-color: var(--p-surface-700);
}

:global(.dark) .search-input {
  background: var(--p-surface-800);
  border-color: var(--p-surface-600);
}

:global(.dark) .search-results,
:global(.dark) .user-dropdown {
  background: var(--p-surface-800);
  border-color: var(--p-surface-600);
}

:global(.dark) .notification-item {
  background: var(--p-surface-700);
}
</style>