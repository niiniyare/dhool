<template>
  <span :class="cellClasses">
    {{ formattedNumber }}
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

const numericValue = computed(() => {
  if (props.value == null) return null
  
  const num = Number(props.value)
  return isNaN(num) ? null : num
})

const formattedNumber = computed(() => {
  if (numericValue.value == null) return '-'
  
  const options: Intl.NumberFormatOptions = {}
  
  // Currency formatting
  if (props.column.currency) {
    options.style = 'currency'
    options.currency = props.column.currencyCode || 'USD'
  }
  
  // Percentage formatting
  if (props.column.percentage) {
    options.style = 'percent'
    options.minimumFractionDigits = props.column.decimals || 1
    options.maximumFractionDigits = props.column.decimals || 1
  }
  
  // Decimal places
  if (props.column.decimals !== undefined) {
    options.minimumFractionDigits = props.column.decimals
    options.maximumFractionDigits = props.column.decimals
  }
  
  // Thousand separators
  if (props.column.useGrouping !== false) {
    options.useGrouping = true
  }
  
  // Custom formatting
  if (props.column.format === 'compact') {
    options.notation = 'compact'
  }
  
  return new Intl.NumberFormat(undefined, options).format(numericValue.value)
})

const cellClasses = computed(() => [
  'number-cell',
  'text-right',
  'font-mono',
  {
    'text-red-600 dark:text-red-400': props.column.negative && numericValue.value && numericValue.value < 0,
    'text-green-600 dark:text-green-400': props.column.positive && numericValue.value && numericValue.value > 0
  }
])
</script>

<style scoped>
.number-cell {
  @apply tabular-nums;
}
</style>