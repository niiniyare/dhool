<template>
  <Card class="table-widget h-full">
    <template #content>
      <div class="table-content h-full flex flex-col">
        <!-- Table Header -->
        <div v-if="widget.title" class="table-header mb-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ widget.title }}
          </h4>
        </div>

        <!-- Table Container -->
        <div class="table-container flex-1">
          <!-- Loading State -->
          <div v-if="loading" class="table-loading">
            <div class="flex flex-col items-center justify-center py-8">
              <ProgressSpinner size="small" />
              <span class="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading data...</span>
            </div>
          </div>

          <!-- No Data State -->
          <div v-else-if="!hasData" class="table-empty">
            <div class="flex flex-col items-center justify-center py-8">
              <i class="pi pi-table text-4xl text-gray-400 mb-2" />
              <span class="text-sm text-gray-600 dark:text-gray-400">No data available</span>
            </div>
          </div>

          <!-- DataTable -->
          <DataTable
            v-else
            :value="tableData"
            :loading="loading"
            :size="tableSize"
            :striped-rows="widget.config.striped"
            :show-gridlines="true"
            :paginator="isPaginated"
            :rows="pageSize"
            :lazy="false"
            :scroll-height="scrollHeight"
            responsive-layout="scroll"
            class="table-widget-datatable"
          >
            <!-- Dynamic Columns -->
            <Column
              v-for="column in displayColumns"
              :key="column.field"
              :field="column.field"
              :header="column.header"
              :sortable="column.sortable"
              :style="{ width: column.width }"
              :class="getColumnClasses(column)"
            >
              <template #body="slotProps">
                <!-- Formatted Cell Content -->
                <component
                  :is="getCellComponent(column.format)"
                  :value="slotProps.data[column.field]"
                  :format="column.format"
                  :column="column"
                  :data="slotProps.data"
                />
              </template>
            </Column>

            <!-- Empty State Template -->
            <template #empty>
              <div class="table-empty-row">
                <div class="flex flex-col items-center justify-center py-4">
                  <i class="pi pi-info-circle text-2xl text-gray-400 mb-2" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">No records found</span>
                </div>
              </div>
            </template>

            <!-- Loading Template -->
            <template #loading>
              <div class="table-loading-row">
                <ProgressSpinner size="small" />
              </div>
            </template>
          </DataTable>
        </div>

        <!-- Table Footer -->
        <div v-if="showFooter && hasData" class="table-footer mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{{ totalRecordsText }}</span>
            <div v-if="!isPaginated && totalRecords > pageSize" class="flex items-center gap-2">
              <span>Showing {{ Math.min(pageSize, totalRecords) }} of {{ totalRecords }} records</span>
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
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'

// Cell Components
import TextCell from '@/components/organisms/cells/TextCell.vue'
import NumberCell from '@/components/organisms/cells/NumberCell.vue'
import DateCell from '@/components/organisms/cells/DateCell.vue'
import BadgeCell from '@/components/organisms/cells/BadgeCell.vue'
import EmailCell from '@/components/organisms/cells/EmailCell.vue'
import PhoneCell from '@/components/organisms/cells/PhoneCell.vue'

interface TableColumn {
  field: string
  header: string
  sortable?: boolean
  width?: string
  format?: 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'datetime' | 'badge' | 'email' | 'phone'
  align?: 'left' | 'center' | 'right'
  class?: string
}

interface TableWidgetConfig {
  dataSource: string
  columns: TableColumn[]
  pageSize?: number
  showHeader?: boolean
  striped?: boolean
  sortable?: boolean
  scrollable?: boolean
  height?: string
}

interface TableWidget {
  id: string
  type: 'table'
  title: string
  config: TableWidgetConfig
  refreshInterval?: number
}

interface Props {
  widget: TableWidget
  data?: any[]
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
  rowSelect: [row: any]
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
const tableData = computed(() => {
  if (!props.data || !Array.isArray(props.data)) return []
  return props.data
})

const hasData = computed(() => {
  return tableData.value.length > 0
})

const displayColumns = computed(() => {
  return props.widget.config.columns || []
})

const pageSize = computed(() => {
  return props.widget.config.pageSize || 5
})

const isPaginated = computed(() => {
  return pageSize.value < totalRecords.value
})

const totalRecords = computed(() => {
  return tableData.value.length
})

const tableSize = computed(() => {
  // Use small size for dashboard widgets to save space
  return 'small'
})

const scrollHeight = computed(() => {
  if (props.widget.config.scrollable) {
    return props.widget.config.height || '300px'
  }
  return undefined
})

const showFooter = computed(() => {
  return totalRecords.value > 0
})

const totalRecordsText = computed(() => {
  const count = totalRecords.value
  return `${count} ${count === 1 ? 'record' : 'records'}`
})

// Methods
const getCellComponent = (format?: string) => {
  switch (format) {
    case 'number':
    case 'currency':
    case 'percentage':
      return NumberCell
    case 'date':
    case 'datetime':
      return DateCell
    case 'badge':
      return BadgeCell
    case 'email':
      return EmailCell
    case 'phone':
      return PhoneCell
    case 'text':
    default:
      return TextCell
  }
}

const getColumnClasses = (column: TableColumn) => {
  const classes = []
  
  if (column.align) {
    classes.push(`text-${column.align}`)
  }
  
  if (column.class) {
    classes.push(column.class)
  }
  
  return classes.join(' ')
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
.table-widget {
  @apply w-full h-full;
}

.table-content {
  min-height: 200px;
}

.table-container {
  min-height: 150px;
  overflow: hidden;
}

.table-loading,
.table-empty {
  @apply h-full flex items-center justify-center;
}

/* Custom DataTable styling for dashboard widgets */
.table-widget-datatable {
  @apply border-0;
}

.table-widget-datatable :deep(.p-datatable-header) {
  @apply hidden;
}

.table-widget-datatable :deep(.p-datatable-thead th) {
  @apply text-xs font-medium bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700;
  padding: 0.5rem 0.75rem;
}

.table-widget-datatable :deep(.p-datatable-tbody td) {
  @apply text-sm border-b border-gray-100 dark:border-gray-800;
  padding: 0.5rem 0.75rem;
}

.table-widget-datatable :deep(.p-datatable-tbody tr:hover) {
  @apply bg-gray-50 dark:bg-gray-800/50;
}

.table-widget-datatable :deep(.p-paginator) {
  @apply border-0 bg-transparent px-0 py-2;
}

.table-widget-datatable :deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  @apply text-xs min-w-6 h-6;
}

/* Empty state styling */
.table-empty-row,
.table-loading-row {
  @apply py-8;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .table-widget-datatable :deep(.p-datatable-thead th) {
    @apply text-xs px-2;
  }
  
  .table-widget-datatable :deep(.p-datatable-tbody td) {
    @apply text-xs px-2;
  }
  
  .table-header h4 {
    @apply text-base;
  }
}

/* Edit mode styling */
.table-widget:hover {
  @apply ring-2 ring-blue-500 ring-opacity-50 transition-all duration-200;
}

/* Focus ring for accessibility */
.table-widget:focus-within {
  @apply ring-2 ring-blue-500 ring-opacity-50;
}
</style>