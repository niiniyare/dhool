<template>
  <span :class="cellClasses">
    {{ formattedValue }}
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

const formattedValue = computed(() => {
  if (props.value == null) return '-'
  return String(props.value)
})

const cellClasses = computed(() => [
  'text-cell',
  {
    'truncate': props.column.truncate !== false
  }
])
</script>

<style scoped>
.text-cell {
  @apply max-w-xs;
}
</style>