<template>
  <div class="action-menu" :class="menuClasses">
    <!-- Single button -->
    <template v-if="actions.length === 1 && actions[0].type !== 'dropdown'">
      <Button
        :id="actions[0].id"
        :label="actions[0].label"
        :icon="actions[0].icon"
        :severity="mapSeverity(actions[0].variant)"
        :size="size"
        :disabled="actions[0].disabled || isActionDisabled(actions[0])"
        :outlined="actions[0].variant === 'outline'"
        :class="[actions[0].class, buttonClasses]"
        @click="handleAction(actions[0])"
      />
    </template>

    <!-- Multiple buttons -->
    <template v-else-if="layout === 'buttons'">
      <template v-for="action in visibleActions" :key="action.id">
        <Button
          v-if="action.type !== 'separator'"
          :id="action.id"
          :label="action.label"
          :icon="action.icon"
          :severity="mapSeverity(action.variant)"
          :size="size"
          :disabled="action.disabled || isActionDisabled(action)"
          :outlined="action.variant === 'outline'"
          :class="[action.class, buttonClasses]"
          @click="handleAction(action)"
        />
        <div v-else class="action-separator" />
      </template>
    </template>

    <!-- Dropdown menu -->
    <template v-else>
      <Menu ref="menu" :model="menuItems" :popup="true">
        <template #item="{ item }">
          <div 
            v-if="item.separator" 
            class="p-menu-separator"
          />
          <a 
            v-else 
            :class="['p-menu-item-link', { 'p-disabled': item.disabled }]"
            @click="item.command"
          >
            <span v-if="item.icon" :class="['p-menu-item-icon', item.icon]" />
            <span class="p-menu-item-text">{{ item.label }}</span>
          </a>
        </template>
      </Menu>
      
      <Button
        :icon="triggerIcon"
        :label="triggerLabel"
        :severity="triggerSeverity"
        :size="size"
        :outlined="triggerOutlined"
        :class="buttonClasses"
        @click="toggleMenu"
        aria-haspopup="true"
        aria-controls="action_menu"
      />
    </template>

    <!-- Confirmation Dialog -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import type { ActionSchema } from '@/types/schema'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import ConfirmDialog from 'primevue/confirmdialog'

interface Props {
  actions: ActionSchema[]
  layout?: 'buttons' | 'dropdown' | 'auto'
  size?: 'small' | 'large'
  align?: 'left' | 'center' | 'right'
  triggerIcon?: string
  triggerLabel?: string
  triggerSeverity?: 'secondary' | 'success' | 'info' | 'warning' | 'danger'
  triggerOutlined?: boolean
  maxButtons?: number
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => [],
  layout: 'auto',
  size: undefined,
  align: 'left',
  triggerIcon: 'pi pi-ellipsis-v',
  triggerLabel: '',
  triggerSeverity: 'secondary',
  triggerOutlined: true,
  maxButtons: 3
})

const emit = defineEmits<{
  action: [action: ActionSchema, event?: Event]
}>()

const menu = ref()
const confirm = useConfirm()

// Filter visible actions based on conditions and permissions
const visibleActions = computed(() => {
  return props.actions.filter(action => {
    if (action.type === 'separator') return true
    
    // Check conditions (simplified - would need actual condition evaluation)
    if (action.condition) {
      // This would be evaluated against current context
      // For now, just return true
    }
    
    // Check permissions (simplified - would need actual permission checking)
    if (action.permissions && action.permissions.length > 0) {
      // This would check against user permissions
      // For now, just return true
    }
    
    return true
  })
})

// Determine final layout
const finalLayout = computed(() => {
  if (props.layout !== 'auto') return props.layout
  
  const nonSeparatorActions = visibleActions.value.filter(a => a.type !== 'separator')
  
  // Single action or very few actions - use buttons
  if (nonSeparatorActions.length <= 2) return 'buttons'
  
  // Too many actions - use dropdown
  if (nonSeparatorActions.length > props.maxButtons) return 'dropdown'
  
  // Check if any action has children - use dropdown
  if (nonSeparatorActions.some(a => a.children && a.children.length > 0)) {
    return 'dropdown'
  }
  
  return 'buttons'
})

// Compute menu items for dropdown
const menuItems = computed(() => {
  if (finalLayout.value !== 'dropdown') return []
  
  const buildMenuItems = (actions: ActionSchema[]): any[] => {
    return actions.map(action => {
      if (action.type === 'separator') {
        return { separator: true }
      }
      
      return {
        label: action.label,
        icon: action.icon,
        disabled: action.disabled || isActionDisabled(action),
        class: action.class,
        command: (event: Event) => handleAction(action, event),
        items: action.children ? buildMenuItems(action.children) : undefined
      }
    })
  }
  
  return buildMenuItems(visibleActions.value)
})

// Check if action is disabled based on conditions
const isActionDisabled = (action: ActionSchema): boolean => {
  // This would implement actual condition checking
  // For now, just return the disabled property
  return false
}

// Map severity variants to PrimeVue severity
const mapSeverity = (variant?: string): string | undefined => {
  const severityMap: Record<string, string> = {
    'primary': 'primary',
    'secondary': 'secondary',
    'success': 'success',
    'info': 'info', 
    'warning': 'warning',
    'danger': 'danger'
  }
  
  return variant ? severityMap[variant] : undefined
}

// Handle action execution
const handleAction = (action: ActionSchema, event?: Event) => {
  // If action requires confirmation
  if (action.confirm) {
    confirm.require({
      message: action.confirm,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => executeAction(action, event),
      reject: () => {
        // User cancelled
      }
    })
    return
  }
  
  executeAction(action, event)
}

// Execute the actual action
const executeAction = (action: ActionSchema, event?: Event) => {
  // Handle different action types
  switch (action.type) {
    case 'link':
      if (action.url) {
        const target = action.target || '_self'
        if (target === '_blank') {
          window.open(action.url, '_blank')
        } else {
          window.location.href = action.url
        }
      }
      break
      
    case 'button':
    default:
      // Emit the action event for parent to handle
      emit('action', action, event)
      break
  }
}

// Toggle dropdown menu
const toggleMenu = (event: Event) => {
  menu.value?.toggle(event)
}

// Computed CSS classes
const menuClasses = computed(() => [
  'action-menu',
  `action-menu--${finalLayout.value}`,
  `action-menu--${props.align}`,
  {
    [`action-menu--${props.size}`]: props.size
  }
])

const buttonClasses = computed(() => [
  'action-menu__button',
  {
    [`action-menu__button--${props.size}`]: props.size
  }
])
</script>

<style scoped>
.action-menu {
  @apply flex items-center;
}

.action-menu--left {
  @apply justify-start;
}

.action-menu--center {
  @apply justify-center;
}

.action-menu--right {
  @apply justify-end;
}

.action-menu--buttons {
  @apply gap-2;
}

.action-menu--buttons .action-menu__button {
  @apply flex-shrink-0;
}

.action-menu--small .action-menu__button {
  @apply text-xs;
}

.action-menu--large .action-menu__button {
  @apply text-base;
}

.action-separator {
  @apply w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2;
}

/* Responsive behavior */
@media (max-width: 640px) {
  .action-menu--buttons {
    @apply flex-col gap-1;
  }
  
  .action-menu--buttons .action-menu__button {
    @apply w-full;
  }
}

/* Focus styles */
.action-menu__button:focus {
  @apply ring-2 ring-blue-500 ring-offset-2;
}

/* Loading state */
.action-menu__button[aria-busy="true"] {
  @apply opacity-50 pointer-events-none;
}
</style>