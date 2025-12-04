<template>
  <Card 
    class="stat-card h-full"
    :class="cardClasses"
  >
    <template #content>
      <div class="flex items-start justify-between">
        <!-- Content -->
        <div class="flex-1">
          <!-- Title -->
          <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {{ title }}
          </h3>
          
          <!-- Value -->
          <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {{ formattedValue }}
          </div>
          
          <!-- Trend -->
          <div 
            v-if="trend !== undefined"
            class="flex items-center text-sm"
            :class="trendClasses"
          >
            <i :class="trendIcon" class="text-xs mr-1" />
            <span>{{ formattedTrend }}</span>
            <span v-if="trendLabel" class="ml-1 text-gray-500 dark:text-gray-400">
              {{ trendLabel }}
            </span>
          </div>
        </div>
        
        <!-- Icon -->
        <div 
          v-if="icon"
          class="flex-shrink-0 ml-4"
        >
          <div 
            class="w-12 h-12 rounded-full flex items-center justify-center"
            :class="iconBgClasses"
          >
            <i :class="icon" class="text-xl" :style="{ color: iconColor }" />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'

export interface StatCardProps {
  title: string
  value: string | number
  trend?: number
  trendLabel?: string
  icon?: string
  iconColor?: string
  iconBgColor?: string
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  loading?: boolean
  formatter?: (value: string | number) => string
}

const props = withDefaults(defineProps<StatCardProps>(), {
  trend: undefined,
  trendLabel: '',
  icon: '',
  iconColor: '',
  iconBgColor: '',
  variant: 'default',
  loading: false,
  formatter: undefined
})

// Format value using custom formatter or default
const formattedValue = computed(() => {
  if (props.loading) return '...'
  if (props.formatter) return props.formatter(props.value)
  
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})

// Format trend percentage
const formattedTrend = computed(() => {
  if (props.trend === undefined) return ''
  const absValue = Math.abs(props.trend)
  return `${absValue.toFixed(1)}%`
})

// Determine trend direction and styling
const trendDirection = computed(() => {
  if (props.trend === undefined || props.trend === 0) return 'neutral'
  return props.trend > 0 ? 'up' : 'down'
})

const trendIcon = computed(() => {
  switch (trendDirection.value) {
    case 'up': return 'pi pi-arrow-up'
    case 'down': return 'pi pi-arrow-down'
    default: return 'pi pi-minus'
  }
})

const trendClasses = computed(() => [
  {
    'text-green-600 dark:text-green-400': trendDirection.value === 'up',
    'text-red-600 dark:text-red-400': trendDirection.value === 'down',
    'text-gray-500 dark:text-gray-400': trendDirection.value === 'neutral'
  }
])

// Card styling
const cardClasses = computed(() => [
  'stat-card',
  {
    'stat-card--loading': props.loading,
    [`stat-card--${props.variant}`]: props.variant !== 'default'
  }
])

// Icon background styling
const iconBgClasses = computed(() => {
  if (props.iconBgColor) return ''
  
  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-700',
    primary: 'bg-blue-100 dark:bg-blue-900/30',
    success: 'bg-green-100 dark:bg-green-900/30',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30',
    danger: 'bg-red-100 dark:bg-red-900/30'
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
    danger: '#ef4444'
  }
  
  return variantColors[props.variant] || variantColors.default
})
</script>

<style scoped>
.stat-card {
  @apply transition-all duration-200 hover:shadow-lg;
}

.stat-card--loading {
  @apply animate-pulse;
}

.stat-card--loading .text-2xl {
  @apply bg-gray-200 dark:bg-gray-700 rounded text-transparent;
  height: 2rem;
  width: 6rem;
}

/* Variant-specific border colors */
.stat-card--primary {
  @apply border-l-4 border-l-blue-500;
}

.stat-card--success {
  @apply border-l-4 border-l-green-500;
}

.stat-card--warning {
  @apply border-l-4 border-l-yellow-500;
}

.stat-card--danger {
  @apply border-l-4 border-l-red-500;
}

/* Hover effects */
.stat-card:hover {
  @apply transform -translate-y-0.5;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .stat-card .text-2xl {
    @apply text-xl;
  }
  
  .stat-card .w-12 {
    @apply w-10;
  }
  
  .stat-card .h-12 {
    @apply h-10;
  }
  
  .stat-card .text-xl {
    @apply text-lg;
  }
}
</style>