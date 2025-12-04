<template>
  <Card class="chart-widget h-full">
    <template #content>
      <div class="chart-content h-full flex flex-col">
        <!-- Chart Header -->
        <div v-if="widget.title" class="chart-header mb-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ widget.title }}
          </h4>
        </div>

        <!-- Chart Container -->
        <div class="chart-container flex-1 relative">
          <!-- Loading State -->
          <div v-if="loading" class="chart-loading">
            <div class="flex flex-col items-center justify-center h-full">
              <ProgressSpinner size="small" />
              <span class="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading chart...</span>
            </div>
          </div>

          <!-- No Data State -->
          <div v-else-if="!hasData" class="chart-empty">
            <div class="flex flex-col items-center justify-center h-full">
              <i class="pi pi-chart-line text-4xl text-gray-400 mb-2" />
              <span class="text-sm text-gray-600 dark:text-gray-400">No data available</span>
            </div>
          </div>

          <!-- Chart Component -->
          <Chart
            v-else
            :type="chartType"
            :data="chartData"
            :options="chartOptions"
            :canvas-props="{ role: 'img' }"
            class="chart-canvas w-full h-full"
          />
        </div>

        <!-- Chart Legend (if external) -->
        <div v-if="showExternalLegend && hasData" class="chart-legend mt-4">
          <div class="flex flex-wrap gap-2 justify-center">
            <div
              v-for="(item, index) in legendItems"
              :key="index"
              class="flex items-center gap-1 text-sm"
            >
              <div
                class="w-3 h-3 rounded-sm"
                :style="{ backgroundColor: item.color }"
              />
              <span class="text-gray-700 dark:text-gray-300">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import ProgressSpinner from 'primevue/progressspinner'

interface ChartSeries {
  field: string
  label: string
  color?: string
}

interface ChartWidgetConfig {
  chartType: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter'
  dataSource: string
  xAxis?: string
  yAxis?: string
  series?: ChartSeries[]
  options?: {
    responsive?: boolean
    legend?: {
      display?: boolean
      position?: 'top' | 'bottom' | 'left' | 'right'
    }
    animation?: boolean
    scales?: any
    plugins?: any
  }
}

interface ChartWidget {
  id: string
  type: 'chart'
  title: string
  config: ChartWidgetConfig
  refreshInterval?: number
}

interface Props {
  widget: ChartWidget
  data?: any
  loading?: boolean
  editMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: undefined,
  loading: false,
  editMode: false
})

const emit = defineEmits<{
  refresh: []
  configure: []
}>()

// Auto-refresh setup
let refreshTimer: NodeJS.Timeout | null = null

const setupAutoRefresh = () => {
  if (props.widget.refreshInterval && props.widget.refreshInterval > 0 && !props.editMode) {
    refreshTimer = setInterval(() => {
      emit('refresh')
    }, props.widget.refreshInterval * 1000)
  }
}

const clearAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// Computed properties
const chartType = computed(() => props.widget.config.chartType)

const hasData = computed(() => {
  if (!props.data) return false
  
  // Check if we have datasets with data
  if (props.data.datasets) {
    return props.data.datasets.some((dataset: any) => dataset.data && dataset.data.length > 0)
  }
  
  // Check if we have raw data
  if (Array.isArray(props.data)) {
    return props.data.length > 0
  }
  
  return false
})

const chartData = computed(() => {
  if (!props.data) return { labels: [], datasets: [] }
  
  // If data is already in Chart.js format
  if (props.data.labels && props.data.datasets) {
    return processChartData(props.data)
  }
  
  // Transform raw data to Chart.js format
  return transformRawData(props.data)
})

const chartOptions = computed(() => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: props.widget.config.options?.legend?.display ?? true,
        position: props.widget.config.options?.legend?.position ?? 'top'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: getDefaultScales(),
    animation: props.widget.config.options?.animation ?? true
  }
  
  // Merge with custom options
  return mergeDeep(defaultOptions, props.widget.config.options || {})
})

const showExternalLegend = computed(() => {
  return props.widget.config.options?.legend?.position === 'external'
})

const legendItems = computed(() => {
  if (!hasData.value || !chartData.value.datasets) return []
  
  return chartData.value.datasets.map((dataset: any, index: number) => ({
    label: dataset.label || `Series ${index + 1}`,
    color: dataset.backgroundColor || dataset.borderColor || generateColor(index)
  }))
})

// Methods
const processChartData = (data: any) => {
  const processedData = { ...data }
  
  // Apply series configuration if available
  if (props.widget.config.series && processedData.datasets) {
    processedData.datasets = processedData.datasets.map((dataset: any, index: number) => {
      const seriesConfig = props.widget.config.series?.[index]
      if (seriesConfig) {
        return {
          ...dataset,
          label: seriesConfig.label || dataset.label,
          backgroundColor: seriesConfig.color || dataset.backgroundColor || generateColor(index),
          borderColor: seriesConfig.color || dataset.borderColor || generateColor(index)
        }
      }
      return dataset
    })
  }
  
  return processedData
}

const transformRawData = (rawData: any[]) => {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    return { labels: [], datasets: [] }
  }
  
  const xField = props.widget.config.xAxis || 'x'
  const yField = props.widget.config.yAxis || 'y'
  
  // Extract labels from x-axis field
  const labels = rawData.map(item => item[xField])
  
  // Create dataset
  const dataset = {
    label: props.widget.title || 'Data',
    data: rawData.map(item => item[yField]),
    backgroundColor: generateColors(rawData.length),
    borderColor: generateColors(rawData.length),
    borderWidth: 1
  }
  
  return {
    labels,
    datasets: [dataset]
  }
}

const getDefaultScales = () => {
  if (['pie', 'doughnut'].includes(chartType.value)) {
    return {}
  }
  
  return {
    x: {
      display: true,
      title: {
        display: true,
        text: props.widget.config.xAxis || 'X Axis'
      }
    },
    y: {
      display: true,
      title: {
        display: true,
        text: props.widget.config.yAxis || 'Y Axis'
      },
      beginAtZero: true
    }
  }
}

const generateColor = (index: number): string => {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280'  // Gray
  ]
  return colors[index % colors.length]
}

const generateColors = (count: number): string[] => {
  return Array.from({ length: count }, (_, index) => generateColor(index))
}

const mergeDeep = (target: any, source: any): any => {
  const result = { ...target }
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeDeep(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  
  return result
}

// Lifecycle
onMounted(() => {
  setupAutoRefresh()
})

onUnmounted(() => {
  clearAutoRefresh()
})

// Watchers
watch(() => props.editMode, (isEditing) => {
  if (isEditing) {
    clearAutoRefresh()
  } else {
    setupAutoRefresh()
  }
})

watch(() => props.widget.refreshInterval, () => {
  clearAutoRefresh()
  setupAutoRefresh()
})
</script>

<style scoped>
.chart-widget {
  @apply w-full h-full;
}

.chart-content {
  min-height: 200px;
}

.chart-container {
  min-height: 150px;
}

.chart-loading,
.chart-empty {
  @apply absolute inset-0;
}

.chart-canvas :deep(canvas) {
  @apply max-h-full max-w-full;
}

/* Edit mode styling */
.chart-widget:hover {
  @apply ring-2 ring-blue-500 ring-opacity-50 transition-all duration-200;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .chart-header h4 {
    @apply text-base;
  }
  
  .chart-container {
    min-height: 120px;
  }
  
  .chart-legend {
    @apply mt-2;
  }
  
  .chart-legend .flex {
    @apply text-xs gap-1;
  }
}
</style>