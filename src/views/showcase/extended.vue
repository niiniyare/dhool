<template>
  <div class="extended-showcase">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Extended Components Showcase
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Specialized components for advanced functionality - LinkField, CurrencyInput, DateRangePicker
      </p>
    </div>

    <!-- LinkField Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        LinkField
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <template #title>Basic Link Field</template>
          <template #content>
            <!-- TODO: Add LinkField component once implemented -->
            <p class="text-muted-color">LinkField component will be showcased here</p>
          </template>
        </Card>
      </div>
    </section>

    <!-- CurrencyInput Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        CurrencyInput
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <template #title>USD Currency</template>
          <template #content>
            <!-- TODO: Add CurrencyInput component once implemented -->
            <p class="text-muted-color">CurrencyInput component will be showcased here</p>
          </template>
        </Card>

        <Card>
          <template #title>EUR Currency</template>
          <template #content>
            <!-- TODO: Add CurrencyInput component with EUR -->
            <p class="text-muted-color">EUR CurrencyInput component will be showcased here</p>
          </template>
        </Card>

        <Card>
          <template #title>Custom Format</template>
          <template #content>
            <!-- TODO: Add CurrencyInput with custom formatting -->
            <p class="text-muted-color">Custom formatted CurrencyInput will be showcased here</p>
          </template>
        </Card>
      </div>
    </section>

    <!-- DateRangePicker Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        DateRangePicker
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card>
          <template #title>Basic Date Range</template>
          <template #content>
            <DateRangePicker
              v-model="basicDateRange"
              placeholder="Select date range"
            />
            <div v-if="basicDateRange" class="mt-2 text-sm text-muted-color">
              Selected: {{ formatRange(basicDateRange) }}
            </div>
          </template>
        </Card>

        <Card>
          <template #title>With Quick Select</template>
          <template #content>
            <DateRangePicker
              v-model="quickSelectRange"
              :show-quick-select="true"
              placeholder="Select or use presets"
            />
            <div v-if="quickSelectRange" class="mt-2 text-sm text-muted-color">
              Selected: {{ formatRange(quickSelectRange) }}
            </div>
          </template>
        </Card>

        <Card>
          <template #title>Inline Calendar</template>
          <template #content>
            <DateRangePicker
              v-model="inlineRange"
              :inline="true"
              :show-quick-select="false"
            />
          </template>
        </Card>

        <Card>
          <template #title>Custom Presets</template>
          <template #content>
            <DateRangePicker
              v-model="customPresetRange"
              :custom-presets="customPresets"
              placeholder="Select with custom presets"
            />
          </template>
        </Card>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DateRangePicker from '@/components/extended/DateRangePicker.vue'

// Date range states
const basicDateRange = ref<[Date, Date] | null>(null)
const quickSelectRange = ref<[Date, Date] | null>(null)
const inlineRange = ref<[Date, Date] | null>(null)
const customPresetRange = ref<[Date, Date] | null>(null)

// Custom presets for demonstration
const customPresets = [
  {
    label: 'Current Quarter',
    getValue: () => {
      const now = new Date()
      const quarter = Math.floor(now.getMonth() / 3)
      const start = new Date(now.getFullYear(), quarter * 3, 1)
      const end = new Date(now.getFullYear(), quarter * 3 + 3, 0)
      return [start, end] as [Date, Date]
    }
  },
  {
    label: 'Last Quarter',
    getValue: () => {
      const now = new Date()
      const quarter = Math.floor(now.getMonth() / 3) - 1
      const year = quarter < 0 ? now.getFullYear() - 1 : now.getFullYear()
      const adjustedQuarter = quarter < 0 ? 3 : quarter
      const start = new Date(year, adjustedQuarter * 3, 1)
      const end = new Date(year, adjustedQuarter * 3 + 3, 0)
      return [start, end] as [Date, Date]
    }
  },
  {
    label: 'Year to Date',
    getValue: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), 0, 1)
      const end = new Date()
      return [start, end] as [Date, Date]
    }
  }
]

// Format date range for display
const formatRange = (range: [Date, Date]): string => {
  if (!range || range.length !== 2) return ''
  
  const start = range[0]
  const end = range[1]
  
  if (start.getTime() === end.getTime()) {
    return start.toLocaleDateString()
  }
  
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
}

// TODO: Add more interactive examples once other extended components are implemented
// NOTE: This showcase demonstrates the DateRangePicker component functionality
// FIXME: Complete LinkField and CurrencyInput showcases when those components are ready
</script>

<style scoped>
.extended-showcase {
  @apply max-w-7xl mx-auto p-6;
}

/* Custom card styling for better showcase presentation */
:deep(.p-card) {
  @apply h-full;
}

:deep(.p-card-body) {
  @apply h-full flex flex-col;
}

:deep(.p-card-content) {
  @apply flex-1 flex flex-col justify-center;
}
</style>