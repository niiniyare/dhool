<template>
  <Drawer
    v-model:visible="isVisible"
    position="left"
    class="mobile-sidebar"
    :modal="true"
    :dismissable="true"
    :close-on-escape="true"
    :show-close-icon="false"
    :auto-z-index="true"
    @hide="$emit('hide')"
  >
    <!-- Header -->
    <template #header>
      <div class="mobile-sidebar-header">
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-3">
            <img src="/logo.svg" alt="Dhool ERP" class="h-8" />
            <span class="font-semibold text-lg text-surface-900 dark:text-surface-0">
              Dhool ERP
            </span>
          </div>
          
          <Button
            icon="pi pi-times"
            severity="secondary"
            text
            @click="close"
            class="p-2"
          />
        </div>
      </div>
    </template>

    <!-- Navigation Content -->
    <div class="mobile-sidebar-content">
      <!-- User Profile Section -->
      <div class="user-section">
        <div class="user-card">
          <div class="flex items-center gap-3 p-4 bg-surface-100 dark:bg-surface-800 rounded-lg">
            <Avatar
              :label="userInitials"
              shape="circle"
              size="large"
              class="flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-surface-900 dark:text-surface-0 truncate">
                {{ currentUser.name }}
              </div>
              <div class="text-sm text-surface-600 dark:text-surface-400 truncate">
                {{ currentUser.email }}
              </div>
              <Chip 
                :label="currentUser.role" 
                size="small" 
                class="mt-1"
                severity="info"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <div class="quick-actions-grid">
          <Button
            v-for="action in quickActions"
            :key="action.label"
            :icon="action.icon"
            :label="action.label"
            severity="secondary"
            outlined
            @click="handleQuickAction(action)"
            class="quick-action-btn"
          />
        </div>
      </div>

      <!-- Navigation Menu -->
      <div class="navigation-menu">
        <Accordion :multiple="false" :active-index="activeAccordionIndex">
          <AccordionTab
            v-for="(section, index) in menuSections"
            :key="section.label"
            :header="section.label"
            :pt="{
              header: 'mobile-accordion-header',
              content: 'mobile-accordion-content'
            }"
          >
            <template #headericon="{ index: tabIndex }">
              <i :class="section.icon" class="mr-3" />
            </template>
            
            <div class="menu-items">
              <Button
                v-for="item in section.items"
                :key="item.label"
                :icon="item.icon"
                :label="item.label"
                severity="secondary"
                text
                class="menu-item-btn"
                :class="{ 'menu-item-active': isActiveRoute(item.to) }"
                @click="navigateTo(item.to)"
              >
                <template #default>
                  <span class="flex items-center gap-3 w-full">
                    <i :class="item.icon" />
                    <span class="flex-1 text-left">{{ item.label }}</span>
                    <Badge
                      v-if="item.badge"
                      :value="item.badge"
                      :severity="item.badgeSeverity || 'info'"
                      size="small"
                    />
                  </span>
                </template>
              </Button>
            </div>
          </AccordionTab>
        </Accordion>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="mobile-sidebar-footer">
        <!-- Settings -->
        <div class="footer-actions">
          <Button
            icon="pi pi-cog"
            label="Settings"
            severity="secondary"
            text
            @click="navigateTo('/settings')"
            class="w-full justify-start"
          />
          
          <!-- Theme Toggle -->
          <Button
            :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
            :label="isDark ? 'Light Mode' : 'Dark Mode'"
            severity="secondary"
            text
            @click="toggleTheme"
            class="w-full justify-start"
          />
          
          <!-- Help -->
          <Button
            icon="pi pi-question-circle"
            label="Help & Support"
            severity="secondary"
            text
            @click="openHelp"
            class="w-full justify-start"
          />
          
          <!-- Sign Out -->
          <Button
            icon="pi pi-sign-out"
            label="Sign Out"
            severity="secondary"
            text
            @click="signOut"
            class="w-full justify-start text-red-600 dark:text-red-400"
          />
        </div>
        
        <!-- App Version -->
        <div class="app-version">
          <div class="text-xs text-surface-500 dark:text-surface-400 text-center">
            Dhool ERP v{{ appVersion }}
          </div>
        </div>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

interface QuickAction {
  label: string
  icon: string
  action: string
  color?: string
}

interface MenuItem {
  label: string
  icon: string
  to: string
  badge?: string
  badgeSeverity?: string
}

interface MenuSection {
  label: string
  icon: string
  items: MenuItem[]
}

// Props & Emits
interface Props {
  visible: boolean
  user?: User
  isDarkTheme?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDarkTheme: false
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'hide': []
  'navigate': [route: string]
  'theme-toggle': []
  'sign-out': []
}>()

// Composables
const router = useRouter()
const route = useRoute()
const toast = useToast()
const confirm = useConfirm()

// State
const activeAccordionIndex = ref(0)
const appVersion = ref('2.1.0')

// Computed
const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const currentUser = computed(() => 
  props.user || {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Admin'
  }
)

const userInitials = computed(() => {
  return currentUser.value.name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
})

const isDark = computed(() => props.isDarkTheme)

// Quick Actions
const quickActions = ref<QuickAction[]>([
  { label: 'New Order', icon: 'pi pi-plus', action: 'new-order' },
  { label: 'Quick Search', icon: 'pi pi-search', action: 'search' },
  { label: 'Notifications', icon: 'pi pi-bell', action: 'notifications' },
  { label: 'Messages', icon: 'pi pi-envelope', action: 'messages' }
])

// Menu sections
const menuSections = ref<MenuSection[]>([
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    items: [
      { label: 'Overview', icon: 'pi pi-chart-pie', to: '/dashboard' },
      { label: 'Analytics', icon: 'pi pi-chart-bar', to: '/analytics' }
    ]
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
      { label: 'Orders', icon: 'pi pi-shopping-bag', to: '/orders', badge: '5', badgeSeverity: 'info' },
      { label: 'Invoices', icon: 'pi pi-receipt', to: '/invoices' },
      { label: 'Payments', icon: 'pi pi-credit-card', to: '/payments' }
    ]
  },
  {
    label: 'Inventory',
    icon: 'pi pi-box',
    items: [
      { label: 'Products', icon: 'pi pi-tag', to: '/products' },
      { label: 'Stock', icon: 'pi pi-database', to: '/stock', badge: '!', badgeSeverity: 'warning' },
      { label: 'Warehouses', icon: 'pi pi-building', to: '/warehouses' },
      { label: 'Suppliers', icon: 'pi pi-truck', to: '/suppliers' }
    ]
  },
  {
    label: 'Reports',
    icon: 'pi pi-chart-bar',
    items: [
      { label: 'Sales Reports', icon: 'pi pi-chart-line', to: '/reports/sales' },
      { label: 'Financial Reports', icon: 'pi pi-calculator', to: '/reports/financial' },
      { label: 'Inventory Reports', icon: 'pi pi-list', to: '/reports/inventory' }
    ]
  }
])

// Methods
const close = () => {
  isVisible.value = false
}

const handleQuickAction = (action: QuickAction) => {
  switch (action.action) {
    case 'new-order':
      navigateTo('/orders/new')
      break
    case 'search':
      // Open search modal or navigate to search page
      toast.add({
        severity: 'info',
        summary: 'Quick Search',
        detail: 'Search functionality coming soon',
        life: 3000
      })
      break
    case 'notifications':
      // Open notifications
      toast.add({
        severity: 'info',
        summary: 'Notifications',
        detail: 'You have 3 new notifications',
        life: 3000
      })
      break
    case 'messages':
      navigateTo('/messages')
      break
  }
}

const navigateTo = (path: string) => {
  router.push(path)
  emit('navigate', path)
  close()
}

const isActiveRoute = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const toggleTheme = () => {
  emit('theme-toggle')
  toast.add({
    severity: 'info',
    summary: 'Theme Changed',
    detail: `Switched to ${!isDark.value ? 'dark' : 'light'} mode`,
    life: 3000
  })
}

const openHelp = () => {
  window.open('/help', '_blank')
  close()
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
      emit('sign-out')
      close()
    }
  })
}
</script>

<style scoped>
.mobile-sidebar {
  width: 100vw;
  max-width: 320px;
}

.mobile-sidebar-header {
  @apply pb-4 border-b border-surface-200 dark:border-surface-700;
}

.mobile-sidebar-content {
  @apply flex-1 py-4;
}

.user-section {
  @apply mb-6;
}

.user-card {
  @apply px-2;
}

.quick-actions {
  @apply mb-6 px-2;
}

.quick-actions-grid {
  @apply grid grid-cols-2 gap-3;
}

.quick-action-btn {
  @apply h-20 flex-col gap-2 text-xs;
}

.quick-action-btn :deep(.p-button-icon) {
  @apply text-lg mb-1;
}

.quick-action-btn :deep(.p-button-label) {
  @apply text-xs leading-tight;
}

.navigation-menu {
  @apply px-2;
}

.navigation-menu :deep(.p-accordion) {
  @apply border-none;
}

.navigation-menu :deep(.p-accordion-tab) {
  @apply border-none mb-2;
}

.navigation-menu :deep(.p-accordion-header) {
  @apply border-none bg-transparent;
}

.navigation-menu :deep(.p-accordion-header a) {
  @apply border-none bg-transparent px-4 py-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300;
  transition: background-color 0.3s;
}

.navigation-menu :deep(.p-accordion-content) {
  @apply border-none bg-transparent pt-2 pb-4;
}

.menu-items {
  @apply space-y-1 px-4;
}

.menu-item-btn {
  @apply w-full justify-start px-3 py-2 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg;
  transition: all 0.3s;
}

.menu-item-btn:hover {
  @apply text-surface-800 dark:text-surface-200;
}

.menu-item-active {
  @apply bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300;
}

.mobile-sidebar-footer {
  @apply border-t border-surface-200 dark:border-surface-700 pt-4;
}

.footer-actions {
  @apply space-y-2 mb-4;
}

.footer-actions .p-button {
  @apply w-full justify-start px-3 py-2;
}

.app-version {
  @apply pt-4 border-t border-surface-100 dark:border-surface-800;
}

/* Custom accordion styles for mobile */
.mobile-accordion-header {
  @apply rounded-lg;
}

.mobile-accordion-content {
  @apply px-0;
}

/* Smooth transitions */
.mobile-sidebar :deep(.p-drawer-content) {
  @apply overflow-y-auto;
}

.mobile-sidebar :deep(.p-drawer) {
  border-radius: 0 16px 16px 0;
}

/* Touch-friendly sizing */
@media (max-width: 768px) {
  .quick-action-btn {
    @apply h-16;
  }
  
  .menu-item-btn {
    @apply py-3;
  }
  
  .footer-actions .p-button {
    @apply py-3;
  }
}
</style>