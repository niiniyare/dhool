<template>
  <div class="data-table-crud">
    <!-- Toolbar -->
    <div v-if="showToolbar && toolbarActions.length > 0" class="table-toolbar">
      <div class="toolbar-left">
        <ActionMenu
          :actions="toolbarActions"
          layout="buttons"
          size="small"
          @action="handleToolbarAction"
        />
      </div>
      
      <div class="toolbar-right">
        <!-- Search -->
        <div v-if="searchable" class="search-container">
          <IconField iconPosition="left">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="searchQuery"
              :placeholder="searchPlaceholder"
              class="search-input"
              @keyup.enter="handleSearch"
            />
          </IconField>
          <Button
            v-if="searchQuery"
            icon="pi pi-times"
            severity="secondary"
            text
            @click="clearSearch"
          />
        </div>

        <!-- Filters Toggle -->
        <Button
          v-if="filterable && filters.length > 0"
          :icon="showFilters ? 'pi pi-filter-slash' : 'pi pi-filter'"
          :label="showFilters ? 'Hide Filters' : 'Filters'"
          severity="secondary"
          outlined
          @click="toggleFilters"
        />

        <!-- Refresh -->
        <Button
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          :loading="combinedLoading"
          @click="refresh"
        />
      </div>
    </div>

    <!-- Filters Panel -->
    <div v-if="showFilters && filterable" class="filters-panel">
      <div class="filters-grid">
        <div
          v-for="filter in filters"
          :key="filter.field"
          class="filter-item"
        >
          <label :for="`filter-${filter.field}`" class="filter-label">
            {{ filter.label || getColumnLabel(filter.field) }}
          </label>
          
          <!-- Select Filter -->
          <Select
            v-if="filter.type === 'select'"
            :id="`filter-${filter.field}`"
            v-model="appliedFilters[filter.field]"
            :options="filter.options"
            option-label="label"
            option-value="value"
            placeholder="All"
            show-clear
            @change="applyFilters"
          />
          
          <!-- Date Range Filter -->
          <Calendar
            v-else-if="filter.type === 'dateRange'"
            :id="`filter-${filter.field}`"
            v-model="appliedFilters[filter.field]"
            selection-mode="range"
            :manual-input="false"
            show-button-bar
            @date-select="applyFilters"
          />
          
          <!-- Text Filter -->
          <InputText
            v-else
            :id="`filter-${filter.field}`"
            v-model="appliedFilters[filter.field]"
            :placeholder="`Filter by ${getColumnLabel(filter.field)}`"
            @keyup.enter="applyFilters"
          />
        </div>
      </div>
      
      <div class="filters-actions">
        <Button
          label="Apply Filters"
          severity="primary"
          size="small"
          @click="applyFilters"
        />
        <Button
          label="Clear All"
          severity="secondary"
          size="small"
          outlined
          @click="clearFilters"
        />
      </div>
    </div>

    <!-- Data Table -->
    <DataTable
      v-model:selection="selectedItems"
      :value="items"
      :loading="combinedLoading"
      :scrollable="true"
      scroll-height="flex"
      :paginator="paginatorEnabled"
      :rows="pageSize"
      :total-records="totalItems"
      :lazy="lazy"
      :selection-mode="selectionMode"
      :meta-key-selection="false"
      :row-hover="true"
      :show-gridlines="showGridlines"
      :striped-rows="stripedRows"
      :size="tableSize"
      :sort-field="sortField"
      :sort-order="sortOrder"
      class="data-table"
      @page="onPage"
      @sort="onSort"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      @row-select-all="onRowSelectAll"
      @row-unselect-all="onRowUnselectAll"
    >
      <!-- Selection Column -->
      <Column
        v-if="selectionMode === 'multiple'"
        selection-mode="multiple"
        :style="{ width: '3em' }"
        :exportable="false"
      />

      <!-- Data Columns -->
      <Column
        v-for="column in displayColumns"
        :key="column.field"
        :field="column.field"
        :header="column.header"
        :sortable="column.sortable"
        :style="getColumnStyle(column)"
        :class="getColumnClass(column)"
      >
        <template #body="{ data }">
          <component
            :is="getCellComponent(column)"
            :value="getFieldValue(data, column.field)"
            :column="column"
            :data="data"
          />
        </template>
        
        <template v-if="column.filter" #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @keydown.enter="filterCallback()"
            class="p-column-filter"
            :placeholder="`Search ${column.header}`"
          />
        </template>
      </Column>

      <!-- Actions Column -->
      <Column
        v-if="rowActions.length > 0"
        :exportable="false"
        :style="{ width: 'min-content' }"
        class="actions-column"
        header="Actions"
      >
        <template #body="{ data }">
          <ActionMenu
            :actions="getRowActions(data)"
            layout="dropdown"
            size="small"
            @action="handleRowAction($event, data)"
          />
        </template>
      </Column>

      <!-- Empty State -->
      <template #empty>
        <EmptyState
          :icon="emptyIcon"
          :title="emptyTitle"
          :description="emptyDescription"
          :action="emptyAction"
        />
      </template>

      <!-- Loading Template -->
      <template #loading>
        <div class="loading-container">
          <ProgressSpinner />
          <span>Loading data...</span>
        </div>
      </template>
    </DataTable>

    <!-- Pagination Info -->
    <div v-if="showPaginationInfo" class="pagination-info">
      <span class="pagination-summary">
        Showing {{ paginationSummary }} of {{ totalItems }} entries
      </span>
      
      <div class="pagination-controls">
        <Select
          v-model="pageSize"
          :options="pageSizeOptions"
          option-label="label"
          option-value="value"
          @change="onPageSizeChange"
        />
        <span class="pagination-text">per page</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import type { ActionSchema } from '@/types/schema'

// Composables
import { useCrud } from '@/composables/useCrud'
import { useSchema } from '@/composables/useSchema'

// PrimeVue Components
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import Calendar from 'primevue/calendar'
import ProgressSpinner from 'primevue/progressspinner'

// Local Components
import ActionMenu from '@/components/molecules/ActionMenu.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'

// Cell Components
import TextCell from './cells/TextCell.vue'
import BadgeCell from './cells/BadgeCell.vue'
import DateCell from './cells/DateCell.vue'
import EmailCell from './cells/EmailCell.vue'
import PhoneCell from './cells/PhoneCell.vue'
import NumberCell from './cells/NumberCell.vue'

interface Props {
  docType: string
  columns?: any[]
  toolbarActions?: ActionSchema[]
  rowActions?: ActionSchema[]
  showToolbar?: boolean
  searchable?: boolean
  filterable?: boolean
  selectionMode?: 'single' | 'multiple'
  lazy?: boolean
  showGridlines?: boolean
  stripedRows?: boolean
  tableSize?: 'small' | 'normal' | 'large'
  pageSizeOptions?: Array<{ label: string; value: number }>
  defaultPageSize?: number
  emptyIcon?: string
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ActionSchema
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  toolbarActions: () => [],
  rowActions: () => [],
  showToolbar: true,
  searchable: true,
  filterable: true,
  selectionMode: 'multiple',
  lazy: true,
  showGridlines: true,
  stripedRows: false,
  tableSize: 'normal',
  pageSizeOptions: () => [
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 }
  ],
  defaultPageSize: 25,
  emptyIcon: 'pi pi-inbox',
  emptyTitle: 'No data found',
  emptyDescription: 'There are no records to display.',
  emptyAction: undefined
})

const emit = defineEmits<{
  select: [items: any[]]
  action: [action: string, data?: any]
  create: []
  edit: [item: any]
  delete: [item: any]
  bulkDelete: [items: any[]]
}>()

// Composables
const {
  items,
  loading,
  totalItems,
  currentPage: crudCurrentPage,
  totalPages,
  hasNext,
  hasPrev,
  fetchList,
  create,
  update,
  remove,
  bulkDelete,
  canPerform,
  selectedItem,
  selectItem,
  refresh: crudRefresh
} = useCrud(props.docType)

const {
  schema,
  loading: schemaLoading,
  columns: schemaColumns,
  toolbarActions: schemaToolbarActions,
  rowActions: schemaRowActions,
  fields
} = useSchema(props.docType)

// Local State
const selectedItems = ref<any[]>([])
const searchQuery = ref('')
const showFilters = ref(false)
const appliedFilters = ref<Record<string, any>>({})
const sortField = ref<string>()
const sortOrder = ref<number>(1)
const pageSize = ref(props.defaultPageSize)
const currentPage = ref(1)

// Computed Properties
const displayColumns = computed(() => {
  if (props.columns.length > 0) return props.columns
  return schemaColumns.value || []
})

const toolbarActions = computed(() => {
  if (props.toolbarActions.length > 0) return props.toolbarActions
  return schemaToolbarActions.value || []
})

const rowActions = computed(() => {
  if (props.rowActions.length > 0) return props.rowActions
  return schemaRowActions.value || []
})

const filters = computed(() => {
  // Use filters from schema if available
  if (schema.value && 'filters' in schema.value && schema.value.filters) {
    return schema.value.filters
  }
  return []
})

const searchPlaceholder = computed(() => {
  // Use searchFields from schema if available  
  if (schema.value && 'searchFields' in schema.value && schema.value.searchFields) {
    const fields = schema.value.searchFields
    if (fields.length === 0) return 'Search...'
    return `Search by ${fields.join(', ')}`
  }
  return 'Search...'
})

const combinedLoading = computed(() => {
  return loading.value || schemaLoading.value
})

const paginatorEnabled = computed(() => {
  return totalItems.value > pageSize.value
})

const showPaginationInfo = computed(() => {
  return totalItems.value > 0
})

const paginationSummary = computed(() => {
  if (totalItems.value === 0) return '0-0'
  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, totalItems.value)
  return `${start}-${end}`
})

// Column Helpers
const getColumnLabel = (field: string): string => {
  const column = displayColumns.value.find(col => col.field === field)
  return column?.header || field
}

const getColumnStyle = (column: any) => {
  const style: any = {}
  if (column.width) style.width = column.width
  return style
}

const getColumnClass = (column: any) => {
  const classes = ['data-column']
  if (column.class) classes.push(column.class)
  return classes.join(' ')
}

const getCellComponent = (column: any) => {
  switch (column.type) {
    case 'badge': return BadgeCell
    case 'date': return DateCell
    case 'email': return EmailCell
    case 'phone': return PhoneCell
    case 'number': return NumberCell
    default: return TextCell
  }
}

const getFieldValue = (data: any, field: string) => {
  return field.split('.').reduce((obj, key) => obj?.[key], data)
}

const getRowActions = (data: any): ActionSchema[] => {
  // Filter row actions based on conditions and permissions
  return rowActions.value.filter(action => {
    // Check permissions first
    if (action.permission && !canPerform(action.permission)) {
      return false
    }
    
    // Add condition checking logic here based on data
    if (action.condition) {
      // This would implement actual condition evaluation against the data row
      return true
    }
    
    return true
  })
}

// Event Handlers
const onPage = (event: any) => {
  currentPage.value = event.page + 1
  pageSize.value = event.rows
  loadData()
}

const onSort = (event: any) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
  loadData()
}

const onPageSizeChange = () => {
  currentPage.value = 1
  loadData()
}

const onRowSelect = (event: any) => {
  emit('select', selectedItems.value)
}

const onRowUnselect = (event: any) => {
  emit('select', selectedItems.value)
}

const onRowSelectAll = (event: any) => {
  selectedItems.value = [...items.value]
  emit('select', selectedItems.value)
}

const onRowUnselectAll = (event: any) => {
  selectedItems.value = []
  emit('select', selectedItems.value)
}

const handleToolbarAction = (action: ActionSchema, event?: Event) => {
  const actionType = 'action' in action ? action.action : action.id
  switch (actionType) {
    case 'create':
      emit('create')
      break
    case 'export':
      exportData()
      break
    case 'import':
      importData()
      break
    case 'bulkDelete':
      if (selectedItems.value.length > 0) {
        handleBulkDelete()
      }
      break
    default:
      emit('action', actionType || action.id, { action, event })
  }
}

const handleRowAction = (action: ActionSchema, data: any) => {
  const actionType = 'action' in action ? action.action : action.id
  switch (actionType) {
    case 'edit':
      emit('edit', data)
      break
    case 'delete':
      handleDelete(data)
      break
    case 'view':
      selectItem(data)
      emit('action', 'view', { action, data })
      break
    default:
      emit('action', actionType || action.id, { action, data })
  }
}

const handleDelete = async (item: any) => {
  try {
    await remove(item.id)
    emit('delete', item)
  } catch (error) {
    console.error('Failed to delete item:', error)
  }
}

const handleBulkDelete = async () => {
  try {
    const ids = selectedItems.value.map(item => item.id)
    await bulkDelete(ids)
    selectedItems.value = []
    emit('bulkDelete', selectedItems.value)
  } catch (error) {
    console.error('Failed to bulk delete items:', error)
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const clearSearch = () => {
  searchQuery.value = ''
  handleSearch()
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const applyFilters = () => {
  currentPage.value = 1
  loadData()
}

const clearFilters = () => {
  appliedFilters.value = {}
  applyFilters()
}

const refresh = () => {
  loadData()
}

const exportData = () => {
  // Implement export functionality
  console.log('Export data')
}

const importData = () => {
  // Implement import functionality  
  console.log('Import data')
}

const buildLoadParams = () => {
  const params: any = {
    page: currentPage.value,
    limit: pageSize.value
  }

  // Add search
  if (searchQuery.value.trim()) {
    params.search = searchQuery.value.trim()
    if (schema.value && 'searchFields' in schema.value && schema.value.searchFields) {
      params.searchFields = schema.value.searchFields
    }
  }

  // Add filters
  Object.keys(appliedFilters.value).forEach(key => {
    const value = appliedFilters.value[key]
    if (value != null && value !== '') {
      // Handle date range filters
      if (Array.isArray(value) && value.length === 2) {
        const filter = filters.value.find((f: any) => f.field === key)
        if (filter?.type === 'dateRange') {
          params[filter.field_start || key] = value[0]
          params[filter.field_end || key] = value[1]
        }
      } else {
        params.filters = params.filters || {}
        params.filters[key] = value
      }
    }
  })

  // Add sorting
  if (sortField.value) {
    params.sort = sortField.value
    params.order = sortOrder.value === 1 ? 'asc' : 'desc'
  }

  return params
}

const loadData = async () => {
  try {
    const params = buildLoadParams()
    await fetchList(params)
    
    // Sync pagination state
    currentPage.value = crudCurrentPage.value
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

// Lifecycle
onMounted(() => {
  // Load schema and initial data
  loadData()
})

// Watch for prop changes
watch(() => props.docType, () => {
  loadData()
})
</script>

<style scoped>
.data-table-crud {
  @apply flex flex-col h-full;
}

.table-toolbar {
  @apply flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700;
}

.toolbar-left {
  @apply flex items-center gap-2;
}

.toolbar-right {
  @apply flex items-center gap-2;
}

.search-container {
  @apply flex items-center gap-1;
}

.search-input {
  @apply w-64;
}

.filters-panel {
  @apply p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700;
}

.filters-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4;
}

.filter-item {
  @apply flex flex-col gap-1;
}

.filter-label {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
}

.filters-actions {
  @apply flex items-center gap-2;
}

.data-table {
  @apply flex-1;
}

.data-table :deep(.p-datatable-wrapper) {
  @apply h-full;
}

.data-table :deep(.p-datatable-table) {
  @apply h-full;
}

.actions-column {
  @apply text-right;
}

.loading-container {
  @apply flex flex-col items-center justify-center py-8 gap-3;
}

.pagination-info {
  @apply flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700;
}

.pagination-summary {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.pagination-controls {
  @apply flex items-center gap-2;
}

.pagination-text {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .table-toolbar {
    @apply flex-col gap-3 items-stretch;
  }
  
  .toolbar-right {
    @apply justify-between;
  }
  
  .search-input {
    @apply w-full;
  }
  
  .filters-grid {
    @apply grid-cols-1;
  }
  
  .pagination-info {
    @apply flex-col gap-2 items-start;
  }
}
</style>