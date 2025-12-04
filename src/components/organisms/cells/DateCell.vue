<template>
  <span :class="cellClasses" :title="fullDate">
    {{ formattedDate }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: any
  column: any
  data: any
}

const props = defineProps<Props>()

const dateValue = computed(() => {
  if (!props.value) return null
  
  if (props.value instanceof Date) return props.value
  
  // Try to parse as date
  const parsed = new Date(props.value)
  return isNaN(parsed.getTime()) ? null : parsed
})

const formattedDate = computed(() => {
  if (!dateValue.value) return '-'
  
  const format = props.column.dateFormat || 'short'
  
  switch (format) {
    case 'short':
      return dateValue.value.toLocaleDateString()
    case 'medium':
      return dateValue.value.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
      })
    case 'long':
      return dateValue.value.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    case 'datetime':
      return dateValue.value.toLocaleString()
    case 'time':
      return dateValue.value.toLocaleTimeString()
    case 'relative':
      return getRelativeTime(dateValue.value)
    default:
      return dateValue.value.toLocaleDateString()
  }
})

const fullDate = computed(() => {
  if (!dateValue.value) return ''
  return dateValue.value.toLocaleString()
})

const cellClasses = computed(() => [
  'date-cell',
  'text-nowrap'
])

const getRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return diffMinutes <= 1 ? 'Just now' : `${diffMinutes}m ago`
    }
    return `${diffHours}h ago`
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}
</script>

<style scoped>
.date-cell {
  @apply text-sm text-gray-600 dark:text-gray-400;
}
</style>