<template>
  <a
    v-if="value"
    :href="telLink"
    class="phone-cell"
    :title="`Call ${value}`"
  >
    {{ formattedPhone }}
  </a>
  <span v-else class="text-gray-400">-</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: any
  column: any
  data: any
}

const props = defineProps<Props>()

const telLink = computed(() => {
  if (!props.value) return ''
  // Remove all non-numeric characters for the tel: link
  const cleanNumber = String(props.value).replace(/\D/g, '')
  return `tel:${cleanNumber}`
})

const formattedPhone = computed(() => {
  if (!props.value) return ''
  
  const phone = String(props.value)
  
  // If column specifies a format, use it
  if (props.column.phoneFormat) {
    return formatPhoneNumber(phone, props.column.phoneFormat)
  }
  
  // Auto-detect and format common patterns
  const cleanNumber = phone.replace(/\D/g, '')
  
  // US/Canada format: (xxx) xxx-xxxx
  if (cleanNumber.length === 10) {
    return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6)}`
  }
  
  // International format with country code
  if (cleanNumber.length === 11 && cleanNumber.startsWith('1')) {
    return `+1 (${cleanNumber.slice(1, 4)}) ${cleanNumber.slice(4, 7)}-${cleanNumber.slice(7)}`
  }
  
  // Return original if we can't format
  return phone
})

const formatPhoneNumber = (phone: string, format: string): string => {
  const cleanNumber = phone.replace(/\D/g, '')
  let formatted = format
  
  // Replace X with digits from the phone number
  let digitIndex = 0
  formatted = formatted.replace(/X/g, () => {
    return digitIndex < cleanNumber.length ? cleanNumber[digitIndex++] : ''
  })
  
  return formatted
}
</script>

<style scoped>
.phone-cell {
  @apply text-blue-600 dark:text-blue-400 hover:underline font-mono text-sm;
}
</style>