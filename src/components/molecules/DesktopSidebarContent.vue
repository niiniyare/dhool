<template>
  <div class="desktop-sidebar-content">
    <PanelMenu
      :model="processedMenuItems"
      :multiple="false"
      class="navigation-menu"
      @item-click="handleItemClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface MenuItem {
  label: string
  icon: string
  to?: string
  items?: MenuItem[]
  badge?: string
  badgeClass?: string
  visible?: boolean
  command?: () => void
}

interface Props {
  menuItems: MenuItem[]
  collapsed: boolean
  currentRoute: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'navigate': [route: string]
}>()

// Process menu items for PanelMenu
const processedMenuItems = computed(() => {
  return props.menuItems.map(item => processMenuItem(item))
})

const processMenuItem = (item: MenuItem): any => {
  const processed: any = {
    label: props.collapsed ? '' : item.label,
    icon: item.icon,
    class: getItemClass(item),
    visible: item.visible !== false,
    command: () => {
      if (item.to) {
        emit('navigate', item.to)
      }
      if (item.command) {
        item.command()
      }
    }
  }

  // Add badge if present
  if (item.badge && !props.collapsed) {
    processed.badge = item.badge
    processed.badgeClass = item.badgeClass || 'p-badge-info'
  }

  // Process sub-items
  if (item.items && item.items.length > 0) {
    processed.items = item.items.map(subItem => ({
      label: subItem.label,
      icon: subItem.icon,
      class: getItemClass(subItem),
      visible: subItem.visible !== false,
      command: () => {
        if (subItem.to) {
          emit('navigate', subItem.to)
        }
        if (subItem.command) {
          subItem.command()
        }
      },
      badge: subItem.badge && !props.collapsed ? subItem.badge : undefined,
      badgeClass: subItem.badgeClass || 'p-badge-info'
    }))
  }

  return processed
}

const getItemClass = (item: MenuItem): string => {
  const classes = []
  
  if (item.to && isActive(item.to)) {
    classes.push('active-menu-item')
  }
  
  if (props.collapsed) {
    classes.push('collapsed-item')
  }
  
  return classes.join(' ')
}

const isActive = (route: string): boolean => {
  return props.currentRoute === route || 
         (route !== '/' && props.currentRoute.startsWith(route))
}

const handleItemClick = (event: any) => {
  // Additional handling if needed
  console.log('Menu item clicked:', event)
}
</script>

<style scoped>
.desktop-sidebar-content {
  @apply flex-1 overflow-y-auto py-4;
}

.navigation-menu {
  @apply border-none px-4;
}

/* Panel Menu Customization */
.navigation-menu :deep(.p-panelmenu-panel) {
  @apply border-none mb-2;
}

.navigation-menu :deep(.p-panelmenu-header) {
  @apply border-none bg-transparent;
}

.navigation-menu :deep(.p-panelmenu-header > a) {
  @apply border-none bg-transparent px-4 py-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 font-medium;
  transition: all 0.3s ease;
}

.navigation-menu :deep(.p-panelmenu-header > a:hover) {
  @apply text-surface-900 dark:text-surface-100;
}

.navigation-menu :deep(.p-panelmenu-header > a.active-menu-item) {
  @apply bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300;
}

.navigation-menu :deep(.p-panelmenu-content) {
  @apply border-none bg-transparent;
}

.navigation-menu :deep(.p-panelmenu-content .p-menuitem-link) {
  @apply px-6 py-2 ml-6 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg;
  transition: all 0.3s;
}

.navigation-menu :deep(.p-panelmenu-content .p-menuitem-link:hover) {
  @apply text-surface-800 dark:text-surface-200;
}

.navigation-menu :deep(.p-panelmenu-content .p-menuitem-link.active-menu-item) {
  @apply bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300;
}

/* Collapsed state styling */
.navigation-menu :deep(.p-panelmenu-header > a.collapsed-item) {
  @apply justify-center px-2;
}

.navigation-menu :deep(.p-panelmenu-header > a.collapsed-item .p-menuitem-text) {
  @apply hidden;
}

.navigation-menu :deep(.p-panelmenu-header > a.collapsed-item .p-submenu-icon) {
  @apply hidden;
}

.navigation-menu :deep(.p-panelmenu-header > a.collapsed-item .p-badge) {
  @apply hidden;
}

/* Hide content in collapsed state */
.navigation-menu.collapsed :deep(.p-panelmenu-content) {
  @apply hidden;
}

/* Icon-only tooltips for collapsed state */
.navigation-menu :deep(.p-panelmenu-header > a.collapsed-item) {
  position: relative;
}

.navigation-menu :deep(.p-panelmenu-header > a.collapsed-item:hover::after) {
  content: attr(aria-label);
  @apply absolute left-full ml-2 px-2 py-1 bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 text-xs rounded whitespace-nowrap z-50;
  top: 50%;
  transform: translateY(-50%);
}

/* Badge styling */
.navigation-menu :deep(.p-badge) {
  @apply min-w-[1.2rem] h-5 text-xs;
}

/* Custom scrollbar */
.desktop-sidebar-content::-webkit-scrollbar {
  width: 4px;
}

.desktop-sidebar-content::-webkit-scrollbar-track {
  @apply bg-transparent;
}

.desktop-sidebar-content::-webkit-scrollbar-thumb {
  @apply bg-surface-300 dark:bg-surface-600 rounded-full;
}

.desktop-sidebar-content::-webkit-scrollbar-thumb:hover {
  @apply bg-surface-400 dark:bg-surface-500;
}

/* Smooth transitions */
.navigation-menu :deep(*) {
  transition: all 0.3s ease;
}

/* Focus states for accessibility */
.navigation-menu :deep(.p-menuitem-link:focus) {
  @apply outline-none ring-2 ring-primary-500 ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-900;
}

.navigation-menu :deep(.p-panelmenu-header > a:focus) {
  @apply outline-none ring-2 ring-primary-500 ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-900;
}
</style>