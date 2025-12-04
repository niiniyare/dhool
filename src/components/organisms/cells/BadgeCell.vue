<template>
  <Badge 
    v-if="value"
    :value="formattedValue" 
    :severity="badgeSeverity"
    :size="badgeSize"
  />
  <span v-else class="text-gray-400">-</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Badge from 'primevue/badge'

interface Props {
  value: any
  column: any
  data: any
}

const props = defineProps<Props>()

const formattedValue = computed(() => {
  if (props.value == null) return ''
  
  // Check if column has options for mapping values to labels
  if (props.column.options) {
    const option = props.column.options.find((opt: any) => opt.value === props.value)
    return option?.label || props.value
  }
  
  return String(props.value)
})

const badgeSeverity = computed(() => {
  const value = String(props.value).toLowerCase()
  
  // Column-specific severity mapping
  if (props.column.severityMap) {
    return props.column.severityMap[value] || 'secondary'
  }
  
  // Default severity mapping based on common patterns
  const severityMap: Record<string, string> = {
    'active': 'success',
    'inactive': 'secondary', 
    'blocked': 'danger',
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger',
    'draft': 'secondary',
    'published': 'success',
    'individual': 'info',
    'company': 'primary'
  }
  
  return severityMap[value] || 'secondary'
})

const badgeSize = computed(() => {
  return props.column.size || 'normal'
})
</script>