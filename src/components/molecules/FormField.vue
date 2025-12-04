<template>
  <div class="form-field" :class="fieldClasses">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="fieldId" 
      class="form-field__label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Field Wrapper -->
    <div class="form-field__input-wrapper relative">
      <!-- Input Slot -->
      <slot 
        :fieldId="fieldId"
        :hasError="hasError"
        :errorMessage="errorMessage"
        :ariaDescribedby="ariaDescribedby"
      />
      
      <!-- Error Icon (if no custom input provided) -->
      <div 
        v-if="hasError && showErrorIcon" 
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500"
      >
        <i class="pi pi-exclamation-circle text-sm" />
      </div>
    </div>

    <!-- Help Text -->
    <small 
      v-if="description && !hasError" 
      :id="`${fieldId}-help`"
      class="form-field__help text-sm text-gray-500 dark:text-gray-400 mt-1 block"
    >
      {{ description }}
    </small>

    <!-- Error Message -->
    <small 
      v-if="hasError" 
      :id="`${fieldId}-error`"
      class="form-field__error text-sm text-red-600 dark:text-red-400 mt-1 block flex items-center"
    >
      <i class="pi pi-exclamation-triangle text-xs mr-1" />
      {{ errorMessage }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  label?: string
  description?: string
  error?: string | string[]
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'filled' | 'outlined'
  showErrorIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  description: '',
  error: '',
  required: false,
  disabled: false,
  readonly: false,
  size: 'medium',
  variant: 'default',
  showErrorIcon: true
})

// Generate unique field ID
const fieldId = useId()

// Compute error state and message
const hasError = computed(() => {
  if (Array.isArray(props.error)) {
    return props.error.length > 0
  }
  return Boolean(props.error)
})

const errorMessage = computed(() => {
  if (Array.isArray(props.error)) {
    return props.error[0] || ''
  }
  return props.error || ''
})

// Compute ARIA attributes
const ariaDescribedby = computed(() => {
  const ids = []
  if (props.description && !hasError.value) {
    ids.push(`${fieldId}-help`)
  }
  if (hasError.value) {
    ids.push(`${fieldId}-error`)
  }
  return ids.length > 0 ? ids.join(' ') : undefined
})

// Compute CSS classes
const fieldClasses = computed(() => [
  'form-field',
  {
    'form-field--error': hasError.value,
    'form-field--disabled': props.disabled,
    'form-field--readonly': props.readonly,
    'form-field--required': props.required,
    [`form-field--${props.size}`]: props.size !== 'medium',
    [`form-field--${props.variant}`]: props.variant !== 'default'
  }
])

const labelClasses = computed(() => [
  {
    'text-gray-400 dark:text-gray-500': props.disabled,
    'cursor-not-allowed': props.disabled
  }
])
</script>

<style scoped>
.form-field {
  @apply mb-4;
}

.form-field--small {
  @apply mb-3;
}

.form-field--small .form-field__label {
  @apply text-xs mb-1;
}

.form-field--small .form-field__help,
.form-field--small .form-field__error {
  @apply text-xs;
}

.form-field--large {
  @apply mb-6;
}

.form-field--large .form-field__label {
  @apply text-base mb-2;
}

.form-field--large .form-field__help,
.form-field--large .form-field__error {
  @apply text-base;
}

.form-field--disabled {
  @apply opacity-60;
}

.form-field--readonly .form-field__label {
  @apply text-gray-600 dark:text-gray-400;
}

/* Animation for error state */
.form-field__error {
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

/* Focus-within styles for better accessibility */
.form-field:focus-within .form-field__label {
  @apply text-blue-600 dark:text-blue-400;
}

.form-field--error:focus-within .form-field__label {
  @apply text-red-600 dark:text-red-400;
}
</style>