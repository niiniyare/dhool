<template>
  <div class="empty-state text-center py-12 px-6">
    <!-- Icon -->
    <div 
      v-if="icon"
      class="mb-4"
    >
      <div 
        class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
        :class="iconBgClasses"
      >
        <i :class="icon" class="text-2xl" :style="{ color: iconColor }" />
      </div>
    </div>

    <!-- Title -->
    <h3 
      v-if="title"
      class="text-lg font-medium text-gray-900 dark:text-white mb-2"
    >
      {{ title }}
    </h3>

    <!-- Description -->
    <p 
      v-if="description"
      class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto"
    >
      {{ description }}
    </p>

    <!-- Action Button -->
    <div 
      v-if="actionLabel || $slots.action"
      class="empty-state__action"
    >
      <slot name="action">
        <Button
          v-if="actionLabel"
          :label="actionLabel"
          :icon="actionIcon"
          :severity="actionSeverity"
          :size="actionSize"
          @click="handleAction"
        />
      </slot>
    </div>

    <!-- Additional Content Slot -->
    <div 
      v-if="$slots.default"
      class="empty-state__content mt-4"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'

export interface EmptyStateProps {
  icon?: string
  iconColor?: string
  iconBgColor?: string
  title?: string
  description?: string
  actionLabel?: string
  actionIcon?: string
  actionSeverity?: 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger' | 'contrast' | undefined
  actionSize?: 'small' | 'large' | undefined
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<EmptyStateProps>(), {
  icon: 'pi pi-inbox',
  iconColor: '',
  iconBgColor: '',
  title: '',
  description: '',
  actionLabel: '',
  actionIcon: '',
  actionSeverity: undefined,
  actionSize: undefined,
  variant: 'default'
})

const emit = defineEmits<{
  action: []
}>()

// Handle action button click
const handleAction = () => {
  emit('action')
}

// Icon background styling
const iconBgClasses = computed(() => {
  if (props.iconBgColor) return `bg-[${props.iconBgColor}]`
  
  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-700',
    primary: 'bg-blue-100 dark:bg-blue-900/30',
    success: 'bg-green-100 dark:bg-green-900/30',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30',
    danger: 'bg-red-100 dark:bg-red-900/30',
    info: 'bg-blue-100 dark:bg-blue-900/30'
  }
  
  return variantClasses[props.variant] || variantClasses.default
})

// Computed icon color
const iconColor = computed(() => {
  if (props.iconColor) return props.iconColor
  
  const variantColors = {
    default: '#6b7280',
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6'
  }
  
  return variantColors[props.variant] || variantColors.default
})
</script>

<style scoped>
.empty-state {
  @apply flex flex-col items-center justify-center min-h-[200px];
}

.empty-state__action {
  @apply flex justify-center;
}

.empty-state__content {
  @apply text-gray-600 dark:text-gray-400;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .empty-state {
    @apply py-8 px-4;
  }
  
  .empty-state .text-lg {
    @apply text-base;
  }
  
  .empty-state .w-16 {
    @apply w-12;
  }
  
  .empty-state .h-16 {
    @apply h-12;
  }
  
  .empty-state .text-2xl {
    @apply text-xl;
  }
}

/* Animation for empty state reveal */
.empty-state {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>