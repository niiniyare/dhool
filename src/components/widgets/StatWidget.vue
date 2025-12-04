<template>
  <StatCard
    :title="widget.title"
    :value="displayValue"
    :trend="trendValue"
    :trend-label="trendLabel"
    :icon="widget.config.icon"
    :variant="widget.config.color || 'default'"
    :loading="loading"
    :formatter="valueFormatter"
    class="stat-widget h-full"
  />
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import StatCard from '@/components/molecules/StatCard.vue'

interface StatWidgetConfig {
  value?: string | number
  label?: string
  icon?: string
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast'
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
    period?: string
  }
  dataSource?: string
  format?: 'number' | 'currency' | 'percentage' | 'bytes'
  precision?: number
}

interface StatWidget {
  id: string
  type: 'stat'
  title: string
  config: StatWidgetConfig
  refreshInterval?: number
}

interface Props {
  widget: StatWidget
  data?: any
  loading?: boolean
  editMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: undefined,
  loading: false,
  editMode: false
})

const emit = defineEmits<{
  refresh: []
  configure: []
}>()

// Auto-refresh setup
let refreshTimer: NodeJS.Timeout | null = null

const setupAutoRefresh = () => {
  if (props.widget.refreshInterval && props.widget.refreshInterval > 0 && !props.editMode) {
    refreshTimer = setInterval(() => {
      emit('refresh')
    }, props.widget.refreshInterval * 1000)
  }
}

const clearAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// Computed properties
const displayValue = computed(() => {
  if (props.loading) return 0
  
  // Use data from props if available, otherwise fall back to config value
  const value = props.data?.value ?? props.widget.config.value ?? 0
  
  // Apply any data transformation if needed
  if (typeof value === 'string' && !isNaN(Number(value))) {
    return Number(value)
  }
  
  return value
})

const trendValue = computed(() => {
  // Use data from props if available, otherwise fall back to config
  const trend = props.data?.trend ?? props.widget.config.trend
  return trend?.value
})

const trendLabel = computed(() => {
  const trend = props.data?.trend ?? props.widget.config.trend
  return trend?.period || 'vs last period'
})

const valueFormatter = computed(() => {
  const format = props.widget.config.format || 'number'
  const precision = props.widget.config.precision ?? 0
  
  return (value: string | number): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    
    if (isNaN(numValue)) return String(value)
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: precision,
          maximumFractionDigits: precision
        }).format(numValue)
      
      case 'percentage':
        return new Intl.NumberFormat('en-US', {
          style: 'percent',
          minimumFractionDigits: precision,
          maximumFractionDigits: precision
        }).format(numValue / 100)
      
      case 'bytes':
        return formatBytes(numValue)
      
      case 'number':
      default:
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision
        }).format(numValue)
    }
  }
})

// Utility functions
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Lifecycle
onMounted(() => {
  setupAutoRefresh()
})

onUnmounted(() => {
  clearAutoRefresh()
})

// Watchers
watch(() => props.editMode, (isEditing) => {
  if (isEditing) {
    clearAutoRefresh()
  } else {
    setupAutoRefresh()
  }
})

watch(() => props.widget.refreshInterval, () => {
  clearAutoRefresh()
  setupAutoRefresh()
})
</script>

<style scoped>
.stat-widget {
  @apply w-full;
}

/* Edit mode styling */
.stat-widget:deep(.stat-card) {
  @apply transition-all duration-200;
}

.stat-widget:deep(.stat-card:hover) {
  @apply ring-2 ring-blue-500 ring-opacity-50;
}
</style>