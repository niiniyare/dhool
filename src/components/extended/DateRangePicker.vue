<template>
  <div class="date-range-picker">
    <!-- TODO: Implement comprehensive date range picker -->
    <!-- NOTE: Read @COMPREHENSIVE-ERP-UI-DOCUMENTATION.md for implementation details -->
    <!-- FIXME: Use PrimeVue 4 Calendar components with range selection -->
    <Calendar
      v-model="dateRange"
      selection-mode="range"
      :number-of-months="2"
      :read-only-input="false"
      date-format="dd/mm/yy"
      :show-icon="true"
      :inline="inline"
      :placeholder="placeholder"
      :disabled="disabled"
      :invalid="hasError"
      class="w-full"
      @date-select="handleDateSelect"
      @clear="handleClear"
    />
    
    <!-- Quick Selection Buttons -->
    <div v-if="showQuickSelect" class="date-range-quick-select mt-3">
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="preset in presets"
          :key="preset.label"
          :label="preset.label"
          size="small"
          severity="secondary"
          outlined
          @click="selectPreset(preset)"
        />
      </div>
    </div>
    
    <!-- Custom Range Display -->
    <div v-if="dateRange && dateRange.length === 2" class="date-range-display mt-2 text-sm text-muted-color">
      {{ formatDateRange(dateRange) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface DatePreset {
  label: string
  getValue: () => [Date, Date]
}

interface Props {
  modelValue?: [Date, Date] | null
  placeholder?: string
  disabled?: boolean
  error?: string
  inline?: boolean
  showQuickSelect?: boolean
  customPresets?: DatePreset[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Select date range',
  disabled: false,
  error: '',
  inline: false,
  showQuickSelect: true,
  customPresets: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: [Date, Date] | null]
  'change': [value: [Date, Date] | null]
  'clear': []
}>()

// Internal date range state
const dateRange = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

// Error state
const hasError = computed(() => Boolean(props.error))

// Default quick select presets
const defaultPresets: DatePreset[] = [
  {
    label: 'Today',
    getValue: () => {
      const today = new Date()
      return [today, today]
    }
  },
  {
    label: 'Yesterday',
    getValue: () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return [yesterday, yesterday]
    }
  },
  {
    label: 'Last 7 days',
    getValue: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    }
  },
  {
    label: 'Last 30 days',
    getValue: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 30)
      return [start, end]
    }
  },
  {
    label: 'This month',
    getValue: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return [start, end]
    }
  },
  {
    label: 'Last month',
    getValue: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return [start, end]
    }
  }
]

// Combined presets
const presets = computed(() => [
  ...defaultPresets,
  ...props.customPresets
])

// Event handlers
const handleDateSelect = (event: { value: [Date, Date] }) => {
  dateRange.value = event.value
}

const handleClear = () => {
  dateRange.value = null
  emit('clear')
}

const selectPreset = (preset: DatePreset) => {
  dateRange.value = preset.getValue()
}

// Format date range for display
const formatDateRange = (range: [Date, Date]): string => {
  if (!range || range.length !== 2) return ''
  
  const start = range[0]
  const end = range[1]
  
  if (start.getTime() === end.getTime()) {
    return start.toLocaleDateString()
  }
  
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
}

// TODO: Add more advanced features like time selection
// NOTE: This component provides a comprehensive date range picker
// FIXME: Add proper validation and error handling
</script>

<style scoped>
.date-range-picker {
  @apply w-full;
}

.date-range-quick-select {
  @apply border-t pt-3;
}

.date-range-display {
  @apply font-medium;
}

/* Responsive adjustments for calendar */
@media (max-width: 640px) {
  .date-range-picker :deep(.p-datepicker) {
    font-size: 0.875rem;
  }
  
  .date-range-picker :deep(.p-datepicker .p-datepicker-header) {
    padding: 0.5rem;
  }
}
</style>