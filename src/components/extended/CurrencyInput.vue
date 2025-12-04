<template>
  <div class="currency-input">
    <InputNumber
      :id="fieldId"
      v-model="numericValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :invalid="hasError"
      :class="inputClasses"
      :aria-describedby="ariaDescribedby"
      :min="min"
      :max="max"
      :minFractionDigits="decimals"
      :maxFractionDigits="decimals"
      :currency="currencyCode"
      :locale="locale"
      mode="currency"
      :useGrouping="useGrouping"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />
    
    <!-- Currency Symbol Display (when not in currency mode) -->
    <div 
      v-if="showSymbol && !useCurrencyMode"
      class="currency-symbol absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none"
    >
      {{ currencySymbol }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import InputNumber from 'primevue/inputnumber'

interface Props {
  modelValue?: number | null
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  error?: string | string[]
  fieldId?: string
  ariaDescribedby?: string
  currencyCode?: string
  locale?: string
  decimals?: number
  min?: number
  max?: number
  useGrouping?: boolean
  showSymbol?: boolean
  useCurrencyMode?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: '',
  disabled: false,
  readonly: false,
  error: '',
  currencyCode: 'USD',
  locale: 'en-US',
  decimals: 2,
  min: undefined,
  max: undefined,
  useGrouping: true,
  showSymbol: true,
  useCurrencyMode: true,
  size: 'medium'
})

interface Emits {
  (e: 'update:modelValue', value: number | null): void
  (e: 'input', value: number | null): void
  (e: 'blur', event: Event): void
  (e: 'focus', event: Event): void
}

const emit = defineEmits<Emits>()

// Internal value for two-way binding
const numericValue = ref<number | null>(props.modelValue)

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  numericValue.value = newValue
})

// Compute error state
const hasError = computed(() => {
  if (Array.isArray(props.error)) {
    return props.error.length > 0
  }
  return Boolean(props.error)
})

// Get currency symbol for display
const currencySymbol = computed(() => {
  try {
    return new Intl.NumberFormat(props.locale, {
      style: 'currency',
      currency: props.currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).formatToParts(0).find(part => part.type === 'currency')?.value || '$'
  } catch {
    return '$'
  }
})

// Input classes based on state and size
const inputClasses = computed(() => [
  'w-full',
  {
    'pl-8': props.showSymbol && !props.useCurrencyMode,
    'text-sm': props.size === 'small',
    'text-base': props.size === 'medium',
    'text-lg': props.size === 'large',
    'h-8': props.size === 'small',
    'h-10': props.size === 'medium',
    'h-12': props.size === 'large'
  }
])

// Event handlers
const handleInput = (value: number | null) => {
  numericValue.value = value
  emit('update:modelValue', value)
  emit('input', value)
}

const handleBlur = (event: Event) => {
  emit('blur', event)
}

const handleFocus = (event: Event) => {
  emit('focus', event)
}

// Format value for display (when not using PrimeVue currency mode)
const formatCurrency = (value: number | null): string => {
  if (value == null) return ''
  
  try {
    return new Intl.NumberFormat(props.locale, {
      style: 'currency',
      currency: props.currencyCode,
      minimumFractionDigits: props.decimals,
      maximumFractionDigits: props.decimals,
      useGrouping: props.useGrouping
    }).format(value)
  } catch {
    // Fallback formatting
    return `${currencySymbol.value}${value.toFixed(props.decimals)}`
  }
}
</script>

<style scoped>
.currency-input {
  @apply relative;
}

.currency-symbol {
  font-weight: 500;
  z-index: 10;
}

/* Size-specific symbol positioning */
.currency-input :deep(.p-inputnumber-input) {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

/* Small size adjustments */
.currency-input :deep(.p-inputnumber.p-inputnumber-input) {
  @apply transition-colors duration-200;
}

/* Focus and error state styling */
.currency-input :deep(.p-inputnumber:not(.p-disabled):hover .p-inputnumber-input) {
  @apply border-gray-400 dark:border-gray-500;
}

.currency-input :deep(.p-inputnumber.p-focus .p-inputnumber-input) {
  @apply border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20;
}

.currency-input :deep(.p-inputnumber.p-invalid .p-inputnumber-input) {
  @apply border-red-500 dark:border-red-400 ring-2 ring-red-500/20;
}

/* Readonly state */
.currency-input :deep(.p-inputnumber.p-readonly .p-inputnumber-input) {
  @apply bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 cursor-default;
}

/* Disabled state */
.currency-input :deep(.p-inputnumber.p-disabled) {
  @apply opacity-60;
}

.currency-input :deep(.p-inputnumber.p-disabled .p-inputnumber-input) {
  @apply bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed;
}
</style>