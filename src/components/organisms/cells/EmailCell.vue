<template>
  <a
    v-if="value"
    :href="mailtoLink"
    class="email-cell"
    :title="`Send email to ${value}`"
  >
    {{ value }}
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

const mailtoLink = computed(() => {
  if (!props.value) return ''
  
  const subject = props.column.emailSubject || ''
  const body = props.column.emailBody || ''
  
  let link = `mailto:${props.value}`
  
  const params = []
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`)
  if (body) params.push(`body=${encodeURIComponent(body)}`)
  
  if (params.length > 0) {
    link += `?${params.join('&')}`
  }
  
  return link
})
</script>

<style scoped>
.email-cell {
  @apply text-blue-600 dark:text-blue-400 hover:underline;
}
</style>