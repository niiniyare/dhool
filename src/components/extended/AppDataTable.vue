<template>
  <div class="app-data-table">
    <!-- Header Section -->
    <div v-if="showHeader" class="app-table-header">
      <div class="header-content">
        <div class="header-left">
          <h3 v-if="title" class="table-title">{{ title }}</h3>
          <p v-if="description" class="table-description">{{ description }}</p>
        </div>
        <div class="header-right">
          <slot name="header-actions">
            <Button
              v-if="refreshable"
              icon="pi pi-refresh"
              severity="secondary"
              outlined
              :loading="loading"
              @click="handleRefresh"
            />
          </slot>
        </div>
      </div>
    </div>

    <!-- Advanced Toolbar -->
    <div v-if="showToolbar" class="app-table-toolbar">
      <!-- Primary Actions -->
      <div class="toolbar-left">
        <slot name="toolbar-left">
          <ActionMenu
            v-if="toolbarActions.length > 0"
            :actions="filteredToolbarActions"
            layout="buttons"
            size="small"
            @action="handleToolbarAction"
          />
        </slot>
        
        <!-- Bulk Actions (shown when items selected) -->
        <div v-if="selectedItems.length > 0" class="bulk-actions">
          <div class="bulk-indicator">
            <Badge :value="selectedItems.length" severity="info" />
            <span class="bulk-text">{{ selectedItems.length }} selected</span>
          </div>
          
          <ActionMenu
            v-if="bulkActions.length > 0"
            :actions="filteredBulkActions"
            layout="buttons"
            size="small"
            severity="secondary"
            @action="handleBulkAction"
          />
        </div>
      </div>

      <!-- Search & Filter Controls -->
      <div class="toolbar-right">
        <!-- Quick Search -->
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
            size="small"
            @click="clearSearch"
          />
        </div>

        <!-- Column Visibility -->
        <Button
          v-if="columnToggle"
          icon="pi pi-table"
          severity="secondary"
          outlined
          @click="toggleColumnSelector"
        />

        <!-- Advanced Filters -->
        <Button
          v-if="filterable && filters.length > 0"
          :icon="showFilters ? 'pi pi-filter-slash' : 'pi pi-filter'"
          :label="showFilters ? 'Hide Filters' : 'Filters'"
          :severity="hasActiveFilters ? 'primary' : 'secondary'"
          :outlined="!hasActiveFilters"
          @click="toggleFilters"
        />

        <!-- Export -->
        <SplitButton
          v-if="exportable"
          label="Export"
          icon="pi pi-download"
          severity="secondary"
          outlined
          size="small"
          :model="exportOptions"
          @click="handleExport"
        />

        <!-- View Options -->
        <slot name="view-options">
          <SelectButton
            v-if="viewModes.length > 1"
            v-model="currentViewMode"
            :options="viewModes"
            option-label="label"
            option-value="value"
            size="small"
          />
        </slot>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters && showActiveFilters" class="active-filters">
      <div class="active-filters-header">
        <span class="filters-label">Active filters:</span>
        <Button
          label="Clear all"
          severity="secondary"
          text
          size="small"
          @click="clearAllFilters"
        />
      </div>
      <div class="active-filters-list">
        <Chip
          v-for="(filter, key) in activeFilters"
          :key="key"
          :label="formatFilterLabel(key, filter)"
          removable
          @remove="removeFilter(key)"
        />
      </div>
    </div>

    <!-- Advanced Filters Panel -->
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
          
          <!-- Dynamic Filter Components -->
          <component
            :is="getFilterComponent(filter)"
            :id="`filter-${filter.field}`"
            v-model="appliedFilters[filter.field]"
            v-bind="getFilterProps(filter)"
            @change="applyFilters"
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
          label="Reset"
          severity="secondary"
          size="small"
          outlined
          @click="clearFilters"
        />
      </div>
    </div>

    <!-- Column Selector Overlay -->
    <OverlayPanel ref="columnSelectorPanel">
      <div class="column-selector">
        <div class="column-selector-header">
          <h4>Show/Hide Columns</h4>
          <div class="column-actions">
            <Button
              label="All"
              severity="secondary"
              text
              size="small"
              @click="showAllColumns"
            />
            <Button
              label="None"
              severity="secondary"
              text
              size="small"
              @click="hideAllColumns"
            />
          </div>
        </div>
        
        <div class="column-list">
          <div
            v-for="column in availableColumns"
            :key="column.field"
            class="column-item"
          >
            <Checkbox
              v-model="visibleColumns"
              :input-id="`col-${column.field}`"
              :value="column.field"
            />
            <label :for="`col-${column.field}`" class="column-label">
              {{ column.header }}
            </label>
          </div>
        </div>
      </div>
    </OverlayPanel>

    <!-- Main Data Table -->
    <div class="table-container" :class="{ [`view-${currentViewMode}`]: currentViewMode }">
      <DataTable
        ref="dataTableRef"
        v-model:selection="selectedItems"
        :value="items"
        :loading="loading"
        :scrollable="scrollable"
        :scroll-height="scrollHeight"
        :virtual-scroller="virtualScroll"
        :virtual-scroller-options="virtualScrollOptions"
        :paginator="paginatorEnabled"
        :rows="pageSize"
        :total-records="totalItems"
        :lazy="lazy"
        :selection-mode="selectionMode"
        :meta-key-selection="false"
        :row-hover="rowHover"
        :show-gridlines="showGridlines"
        :striped-rows="stripedRows"
        :size="tableSize"
        :sort-field="sortField"
        :sort-order="sortOrder"
        :sort-mode="sortMode"
        :multi-sort-meta="multiSortMeta"
        :resizable-columns="resizableColumns"
        :reorderable-columns="reorderableColumns"
        :auto-layout="autoLayout"
        :state-storage="stateStorage"
        :state-key="stateKey"
        class="app-data-table-core"
        @page="onPage"
        @sort="onSort"
        @filter="onFilter"
        @row-select="onRowSelect"
        @row-unselect="onRowUnselect"
        @row-select-all="onRowSelectAll"
        @row-unselect-all="onRowUnselectAll"
        @row-click="onRowClick"
        @row-dblclick="onRowDoubleClick"
        @column-resize-end="onColumnResize"
        @column-reorder="onColumnReorder"
      >
        <!-- Selection Column -->
        <Column
          v-if="selectionMode === 'multiple'"
          selection-mode="multiple"
          :style="{ width: '3rem' }"
          :exportable="false"
          frozen
        />

        <!-- Expandable Row Column -->
        <Column
          v-if="expandableRows"
          expander
          :style="{ width: '3rem' }"
          :exportable="false"
          frozen
        />

        <!-- Dynamic Data Columns -->
        <Column
          v-for="column in visibleDisplayColumns"
          :key="column.field"
          :field="column.field"
          :header="column.header"
          :sortable="column.sortable !== false"
          :filter-field="column.filterField || column.field"
          :show-filter-menu="column.filterable !== false && columnFilters"
          :filter-header-style="column.filterHeaderStyle"
          :filter-menu-style="column.filterMenuStyle"
          :style="getColumnStyle(column)"
          :class="getColumnClass(column)"
          :frozen="column.frozen"
          :align-frozen="column.alignFrozen || 'left'"
          :sortable-disabled="column.sortableDisabled"
          :header-style="column.headerStyle"
          :body-style="column.bodyStyle"
          :footer-style="column.footerStyle"
        >
          <!-- Custom Header Template -->
          <template v-if="hasSlot(`header-${column.field}`)" #header>
            <slot :name="`header-${column.field}`" :column="column" />
          </template>

          <!-- Dynamic Cell Content -->
          <template #body="{ data, field, index }">
            <slot
              v-if="hasSlot(`cell-${column.field}`)"
              :name="`cell-${column.field}`"
              :data="data"
              :field="field"
              :value="getFieldValue(data, field)"
              :column="column"
              :index="index"
            />
            <component
              v-else
              :is="getCellComponent(column)"
              :value="getFieldValue(data, field)"
              :column="column"
              :data="data"
              :index="index"
            />
          </template>
          
          <!-- Column Filter Template -->
          <template v-if="column.filterable !== false && columnFilters" #filter="{ filterModel, filterCallback }">
            <component
              :is="getColumnFilterComponent(column)"
              v-model="filterModel.value"
              v-bind="getColumnFilterProps(column)"
              @change="filterCallback()"
              @keydown.enter="filterCallback()"
            />
          </template>

          <!-- Custom Footer Template -->
          <template v-if="hasSlot(`footer-${column.field}`)" #footer>
            <slot :name="`footer-${column.field}`" :column="column" />
          </template>
        </Column>

        <!-- Actions Column -->
        <Column
          v-if="rowActions.length > 0"
          :exportable="false"
          :style="{ width: 'min-content' }"
          class="actions-column"
          header="Actions"
          frozen
          align-frozen="right"
        >
          <template #body="{ data, index }">
            <slot
              v-if="hasSlot('row-actions')"
              name="row-actions"
              :data="data"
              :index="index"
              :actions="getRowActions(data)"
            />
            <ActionMenu
              v-else
              :actions="getRowActions(data)"
              layout="dropdown"
              size="small"
              @action="handleRowAction($event, data, index)"
            />
          </template>
        </Column>

        <!-- Expandable Row Template -->
        <template v-if="expandableRows" #expansion="{ data, index }">
          <slot name="expansion" :data="data" :index="index" />
        </template>

        <!-- Empty State -->
        <template #empty>
          <slot name="empty">
            <EmptyState
              :icon="emptyIcon"
              :title="emptyTitle"
              :description="emptyDescription"
              :action="emptyAction"
            />
          </slot>
        </template>

        <!-- Loading Template -->
        <template #loading>
          <slot name="loading">
            <div class="loading-container">
              <ProgressSpinner />
              <span>{{ loadingText }}</span>
            </div>
          </slot>
        </template>
      </DataTable>
    </div>

    <!-- Enhanced Footer -->
    <div v-if="showFooter" class="app-table-footer">
      <!-- Pagination Info & Controls -->
      <div class="footer-content">
        <div class="pagination-info">
          <span class="pagination-summary">
            {{ paginationSummary }}
          </span>
          
          <div v-if="showAdvancedPagination" class="pagination-controls">
            <span class="pagination-label">Show:</span>
            <Select
              v-model="pageSize"
              :options="pageSizeOptions"
              option-label="label"
              option-value="value"
              size="small"
              @change="onPageSizeChange"
            />
            <span class="pagination-text">per page</span>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="footer-actions">
          <slot name="footer-actions">
            <!-- Export Summary -->
            <div v-if="showExportSummary && selectedItems.length > 0" class="export-summary">
              <Button
                :label="`Export ${selectedItems.length} selected`"
                icon="pi pi-download"
                severity="primary"
                size="small"
                @click="exportSelected"
              />
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, useSlots } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import type { ActionSchema } from '@/types/schema'

// Composables
import { useCrud } from '@/composables/useCrud'
import { useSchema } from '@/composables/useSchema'

// PrimeVue Components
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import SplitButton from 'primevue/splitbutton'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import Calendar from 'primevue/calendar'
import Checkbox from 'primevue/checkbox'
import Badge from 'primevue/badge'
import Chip from 'primevue/chip'
import ProgressSpinner from 'primevue/progressspinner'
import OverlayPanel from 'primevue/overlaypanel'

// Local Components
import ActionMenu from '@/components/molecules/ActionMenu.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'

// Cell Components
import TextCell from '@/components/organisms/cells/TextCell.vue'
import BadgeCell from '@/components/organisms/cells/BadgeCell.vue'
import DateCell from '@/components/organisms/cells/DateCell.vue'
import EmailCell from '@/components/organisms/cells/EmailCell.vue'
import PhoneCell from '@/components/organisms/cells/PhoneCell.vue'
import NumberCell from '@/components/organisms/cells/NumberCell.vue'

interface ViewMode {
  label: string
  value: string
}

interface ExportOption {
  label: string
  icon: string
  command: () => void
}

interface Props {
  // Core Configuration
  docType?: string
  columns?: any[]
  data?: any[]
  
  // Header Configuration
  showHeader?: boolean
  title?: string
  description?: string
  refreshable?: boolean
  
  // Toolbar Configuration
  showToolbar?: boolean
  toolbarActions?: ActionSchema[]
  rowActions?: ActionSchema[]
  bulkActions?: ActionSchema[]
  
  // Search & Filter Configuration
  searchable?: boolean
  searchPlaceholder?: string
  filterable?: boolean
  columnFilters?: boolean
  showActiveFilters?: boolean
  
  // Column Configuration
  columnToggle?: boolean
  resizableColumns?: boolean
  reorderableColumns?: boolean
  
  // Selection Configuration
  selectionMode?: 'single' | 'multiple'
  
  // Display Configuration
  showGridlines?: boolean
  stripedRows?: boolean
  rowHover?: boolean
  tableSize?: 'small' | 'normal' | 'large'
  
  // Pagination Configuration
  lazy?: boolean
  pageSizeOptions?: Array<{ label: string; value: number }>
  defaultPageSize?: number
  showAdvancedPagination?: boolean
  
  // Scrolling Configuration
  scrollable?: boolean
  scrollHeight?: string
  virtualScroll?: boolean
  virtualScrollOptions?: any
  
  // Sorting Configuration
  sortMode?: 'single' | 'multiple'
  
  // Export Configuration
  exportable?: boolean
  showExportSummary?: boolean
  
  // View Configuration
  viewModes?: ViewMode[]
  defaultViewMode?: string
  
  // Row Expansion
  expandableRows?: boolean
  
  // State Management
  stateStorage?: 'local' | 'session'
  stateKey?: string
  
  // Layout
  autoLayout?: boolean
  showFooter?: boolean
  
  // Empty State
  emptyIcon?: string
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ActionSchema
  
  // Loading
  loadingText?: string
}

const props = withDefaults(defineProps<Props>(), {
  // Core defaults
  columns: () => [],
  data: () => [],
  
  // Header defaults
  showHeader: true,
  refreshable: true,
  
  // Toolbar defaults
  showToolbar: true,
  toolbarActions: () => [],
  rowActions: () => [],
  bulkActions: () => [],
  
  // Search & Filter defaults
  searchable: true,
  searchPlaceholder: 'Search...',
  filterable: true,
  columnFilters: true,
  showActiveFilters: true,
  
  // Column defaults
  columnToggle: true,
  resizableColumns: true,
  reorderableColumns: false,
  
  // Selection defaults
  selectionMode: 'multiple',
  
  // Display defaults
  showGridlines: true,
  stripedRows: false,
  rowHover: true,
  tableSize: 'normal',
  
  // Pagination defaults
  lazy: true,
  pageSizeOptions: () => [
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 }
  ],
  defaultPageSize: 25,
  showAdvancedPagination: true,
  
  // Scrolling defaults
  scrollable: true,
  scrollHeight: 'flex',
  virtualScroll: false,
  
  // Sorting defaults
  sortMode: 'single',
  
  // Export defaults
  exportable: true,
  showExportSummary: true,
  
  // View defaults
  viewModes: () => [
    { label: 'Table', value: 'table' },
    { label: 'Grid', value: 'grid' }
  ],
  defaultViewMode: 'table',
  
  // Row expansion defaults
  expandableRows: false,
  
  // State defaults
  stateStorage: 'local',
  
  // Layout defaults
  autoLayout: false,
  showFooter: true,
  
  // Empty state defaults
  emptyIcon: 'pi pi-inbox',
  emptyTitle: 'No data found',
  emptyDescription: 'There are no records to display.',
  emptyAction: undefined,
  
  // Loading defaults
  loadingText: 'Loading data...'
})

const emit = defineEmits<{
  select: [items: any[]]
  action: [action: string, data?: any]
  create: []
  edit: [item: any]
  delete: [item: any]
  bulkAction: [action: string, items: any[]]
  rowClick: [event: any, item: any]
  rowDoubleClick: [event: any, item: any]
  columnResize: [event: any]
  columnReorder: [event: any]
  export: [format: string, data?: any[]]
  refresh: []
}>()

// Refs
const dataTableRef = ref()
const columnSelectorPanel = ref()

// Composables (only if docType provided)
const crud = props.docType ? useCrud(props.docType) : null
const schema = props.docType ? useSchema(props.docType) : null

// Local State
const selectedItems = ref<any[]>([])
const searchQuery = ref('')
const showFilters = ref(false)
const appliedFilters = ref<Record<string, any>>({})
const sortField = ref<string>()
const sortOrder = ref<number>(1)
const multiSortMeta = ref<any[]>([])
const pageSize = ref(props.defaultPageSize)
const currentPage = ref(1)
const currentViewMode = ref(props.defaultViewMode)
const visibleColumns = ref<string[]>([])

// Slots
const slots = useSlots()

// Computed Properties
const items = computed(() => {
  if (props.data.length > 0) return props.data
  return crud?.items.value || []
})

const loading = computed(() => {
  return crud?.loading.value || false
})

const totalItems = computed(() => {
  return crud?.totalItems.value || props.data.length
})

const displayColumns = computed(() => {
  if (props.columns.length > 0) return props.columns
  return schema?.columns.value || []
})

const availableColumns = computed(() => displayColumns.value)

const visibleDisplayColumns = computed(() => {
  if (visibleColumns.value.length === 0) return displayColumns.value
  return displayColumns.value.filter(col => visibleColumns.value.includes(col.field))
})

const toolbarActions = computed(() => {
  if (props.toolbarActions.length > 0) return props.toolbarActions
  return schema?.toolbarActions.value || []
})

const rowActions = computed(() => {
  if (props.rowActions.length > 0) return props.rowActions
  return schema?.rowActions.value || []
})

const filters = computed(() => {
  if (schema?.value && 'filters' in schema.value && schema.value.filters) {
    return schema.value.filters
  }
  return []
})

const filteredToolbarActions = computed(() => {
  return toolbarActions.value.filter(action => {
    if (action.permission && crud) {
      return crud.canPerform(action.permission)
    }
    return true
  })
})

const filteredBulkActions = computed(() => {
  return props.bulkActions.filter(action => {
    if (action.permission && crud) {
      return crud.canPerform(action.permission)
    }
    return true
  })
})

const hasActiveFilters = computed(() => {
  return Object.keys(activeFilters.value).length > 0
})

const activeFilters = computed(() => {
  const active: Record<string, any> = {}
  Object.keys(appliedFilters.value).forEach(key => {
    const value = appliedFilters.value[key]
    if (value != null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
      active[key] = value
    }
  })
  return active
})

const paginatorEnabled = computed(() => {
  return totalItems.value > pageSize.value
})

const paginationSummary = computed(() => {
  if (totalItems.value === 0) return 'No entries'
  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, totalItems.value)
  return `Showing ${start}-${end} of ${totalItems.value} entries`
})

const stateKey = computed(() => {
  return props.stateKey || `app-datatable-${props.docType || 'default'}`
})

const exportOptions = computed((): ExportOption[] => [
  {
    label: 'CSV',
    icon: 'pi pi-file',
    command: () => handleExport('csv')
  },
  {
    label: 'Excel',
    icon: 'pi pi-file-excel',
    command: () => handleExport('excel')
  },
  {
    label: 'PDF',
    icon: 'pi pi-file-pdf',
    command: () => handleExport('pdf')
  }
])

// Utility Functions
const hasSlot = (name: string): boolean => {
  return !!slots[name]
}

const getColumnLabel = (field: string): string => {
  const column = displayColumns.value.find(col => col.field === field)
  return column?.header || field
}

const getColumnStyle = (column: any) => {
  const style: any = {}
  if (column.width) style.width = column.width
  if (column.minWidth) style.minWidth = column.minWidth
  if (column.maxWidth) style.maxWidth = column.maxWidth
  return style
}

const getColumnClass = (column: any) => {
  const classes = ['data-column']
  if (column.class) classes.push(column.class)
  if (column.align) classes.push(`text-${column.align}`)
  return classes.join(' ')
}

const getCellComponent = (column: any) => {
  if (column.component) return column.component
  
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

const getFilterComponent = (filter: any) => {
  switch (filter.type) {
    case 'select': return Select
    case 'dateRange': return Calendar
    case 'checkbox': return Checkbox
    default: return InputText
  }
}

const getFilterProps = (filter: any) => {
  const props: any = {}
  
  switch (filter.type) {
    case 'select':
      props.options = filter.options
      props.optionLabel = 'label'
      props.optionValue = 'value'
      props.placeholder = 'All'
      props.showClear = true
      break
    case 'dateRange':
      props.selectionMode = 'range'
      props.manualInput = false
      props.showButtonBar = true
      break
    default:
      props.placeholder = `Filter by ${filter.label || filter.field}`
  }
  
  return props
}

const getColumnFilterComponent = (column: any) => {
  if (column.filterComponent) return column.filterComponent
  
  switch (column.filterType || column.type) {
    case 'select': return Select
    case 'date': return Calendar
    case 'number': return InputText
    default: return InputText
  }
}

const getColumnFilterProps = (column: any) => {
  const props: any = {}
  
  switch (column.filterType || column.type) {
    case 'select':
      props.options = column.filterOptions || column.options
      props.optionLabel = 'label'
      props.optionValue = 'value'
      props.placeholder = `All ${column.header}`
      props.showClear = true
      break
    case 'date':
      props.dateFormat = 'mm/dd/yy'
      props.placeholder = 'Select date'
      break
    case 'number':
      props.type = 'number'
      props.placeholder = `Enter ${column.header}`
      break
    default:
      props.type = 'text'
      props.placeholder = `Search ${column.header}`
      props.class = 'p-column-filter'
  }
  
  return props
}

const getRowActions = (data: any): ActionSchema[] => {
  return rowActions.value.filter(action => {
    if (action.permission && crud) {
      return crud.canPerform(action.permission)
    }
    
    if (action.condition) {
      // Implement condition evaluation
      return true
    }
    
    return true
  })
}

const formatFilterLabel = (key: string, value: any): string => {
  const filter = filters.value.find((f: any) => f.field === key)
  const label = filter?.label || getColumnLabel(key)
  
  if (Array.isArray(value)) {
    if (filter?.type === 'dateRange' && value.length === 2) {
      return `${label}: ${value[0]?.toLocaleDateString()} - ${value[1]?.toLocaleDateString()}`
    }
    return `${label}: ${value.join(', ')}`
  }
  
  if (filter?.type === 'select' && filter.options) {
    const option = filter.options.find((opt: any) => opt.value === value)
    return `${label}: ${option?.label || value}`
  }
  
  return `${label}: ${value}`
}

// Event Handlers
const onPage = (event: any) => {
  currentPage.value = event.page + 1
  pageSize.value = event.rows
  loadData()
}

const onSort = (event: any) => {
  if (props.sortMode === 'multiple') {
    multiSortMeta.value = event.multiSortMeta
  } else {
    sortField.value = event.sortField
    sortOrder.value = event.sortOrder
  }
  loadData()
}

const onFilter = (event: any) => {
  // Handle column-level filtering
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

const onRowClick = (event: any) => {
  emit('rowClick', event, event.data)
}

const onRowDoubleClick = (event: any) => {
  emit('rowDoubleClick', event, event.data)
}

const onColumnResize = (event: any) => {
  emit('columnResize', event)
}

const onColumnReorder = (event: any) => {
  emit('columnReorder', event)
}

const onPageSizeChange = () => {
  currentPage.value = 1
  loadData()
}

// Action Handlers
const handleToolbarAction = (action: ActionSchema, event?: Event) => {
  const actionType = 'action' in action ? action.action : action.id
  switch (actionType) {
    case 'create':
      emit('create')
      break
    case 'export':
      handleExport()
      break
    case 'refresh':
      handleRefresh()
      break
    default:
      emit('action', actionType || action.id, { action, event })
  }
}

const handleRowAction = (action: ActionSchema, data: any, index?: number) => {
  const actionType = 'action' in action ? action.action : action.id
  switch (actionType) {
    case 'edit':
      emit('edit', data)
      break
    case 'delete':
      handleDelete(data)
      break
    case 'view':
      emit('action', 'view', { action, data, index })
      break
    default:
      emit('action', actionType || action.id, { action, data, index })
  }
}

const handleBulkAction = (action: ActionSchema) => {
  const actionType = 'action' in action ? action.action : action.id
  emit('bulkAction', actionType || action.id, selectedItems.value)
}

const handleDelete = async (item: any) => {
  if (crud) {
    try {
      await crud.remove(item.id)
      emit('delete', item)
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
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

const handleRefresh = () => {
  loadData()
  emit('refresh')
}

// Filter Functions
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

const clearAllFilters = () => {
  appliedFilters.value = {}
  searchQuery.value = ''
  applyFilters()
}

const removeFilter = (key: string) => {
  delete appliedFilters.value[key]
  applyFilters()
}

// Column Functions
const toggleColumnSelector = (event: any) => {
  columnSelectorPanel.value.toggle(event)
}

const showAllColumns = () => {
  visibleColumns.value = availableColumns.value.map(col => col.field)
}

const hideAllColumns = () => {
  visibleColumns.value = []
}

// Export Functions
const handleExport = (format = 'csv') => {
  emit('export', format, selectedItems.value.length > 0 ? selectedItems.value : items.value)
}

const exportSelected = () => {
  handleExport('csv')
}

// Data Loading
const buildLoadParams = () => {
  const params: any = {
    page: currentPage.value,
    limit: pageSize.value
  }

  // Add search
  if (searchQuery.value.trim()) {
    params.search = searchQuery.value.trim()
    if (schema?.value && 'searchFields' in schema.value && schema.value.searchFields) {
      params.searchFields = schema.value.searchFields
    }
  }

  // Add filters
  Object.keys(appliedFilters.value).forEach(key => {
    const value = appliedFilters.value[key]
    if (value != null && value !== '') {
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
  if (props.sortMode === 'multiple' && multiSortMeta.value.length > 0) {
    params.multiSort = multiSortMeta.value
  } else if (sortField.value) {
    params.sort = sortField.value
    params.order = sortOrder.value === 1 ? 'asc' : 'desc'
  }

  return params
}

const loadData = async () => {
  if (!crud || !props.lazy) return
  
  try {
    const params = buildLoadParams()
    await crud.fetchList(params)
    currentPage.value = crud.currentPage.value
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

// Lifecycle
onMounted(() => {
  // Initialize visible columns
  visibleColumns.value = availableColumns.value.map(col => col.field)
  
  // Load initial data if using lazy loading
  if (props.lazy && crud) {
    loadData()
  }
})

// Watchers
watch(() => props.docType, () => {
  if (crud) {
    loadData()
  }
})
</script>

<style scoped>
.app-data-table {
  @apply flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-sm;
}

.app-table-header {
  @apply border-b border-gray-200 dark:border-gray-700;
}

.header-content {
  @apply flex items-start justify-between p-6;
}

.header-left {
  @apply flex-1;
}

.table-title {
  @apply text-xl font-semibold text-gray-900 dark:text-white mb-1;
}

.table-description {
  @apply text-gray-600 dark:text-gray-400 text-sm;
}

.header-right {
  @apply flex items-center gap-2;
}

.app-table-toolbar {
  @apply flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800;
}

.toolbar-left {
  @apply flex items-center gap-4;
}

.bulk-actions {
  @apply flex items-center gap-3 pl-4 border-l border-gray-300 dark:border-gray-600;
}

.bulk-indicator {
  @apply flex items-center gap-2;
}

.bulk-text {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
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

.active-filters {
  @apply p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800;
}

.active-filters-header {
  @apply flex items-center justify-between mb-2;
}

.filters-label {
  @apply text-sm font-medium text-blue-700 dark:text-blue-300;
}

.active-filters-list {
  @apply flex flex-wrap gap-2;
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

.column-selector {
  @apply w-64 p-4;
}

.column-selector-header {
  @apply flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700;
}

.column-selector-header h4 {
  @apply font-medium text-gray-900 dark:text-white;
}

.column-actions {
  @apply flex gap-1;
}

.column-list {
  @apply space-y-2 max-h-64 overflow-y-auto;
}

.column-item {
  @apply flex items-center gap-2;
}

.column-label {
  @apply text-sm text-gray-700 dark:text-gray-300 cursor-pointer;
}

.table-container {
  @apply flex-1 relative;
}

.app-data-table-core {
  @apply h-full;
}

.app-data-table-core :deep(.p-datatable-wrapper) {
  @apply h-full;
}

.actions-column {
  @apply text-right;
}

.loading-container {
  @apply flex flex-col items-center justify-center py-12 gap-3;
}

.app-table-footer {
  @apply border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800;
}

.footer-content {
  @apply flex items-center justify-between p-4;
}

.pagination-info {
  @apply flex items-center gap-4;
}

.pagination-summary {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.pagination-controls {
  @apply flex items-center gap-2;
}

.pagination-label,
.pagination-text {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.footer-actions {
  @apply flex items-center gap-2;
}

.export-summary {
  @apply flex items-center gap-2;
}

/* View Mode Styles */
.view-grid {
  /* Custom grid view styles */
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .app-table-toolbar {
    @apply flex-col gap-3 items-stretch;
  }
  
  .toolbar-right {
    @apply flex-wrap justify-between;
  }
  
  .search-input {
    @apply w-full;
  }
  
  .filters-grid {
    @apply grid-cols-1;
  }
  
  .footer-content {
    @apply flex-col gap-2 items-start;
  }
  
  .bulk-actions {
    @apply pl-0 border-l-0 border-t border-gray-300 dark:border-gray-600 pt-3;
  }
}

/* Custom scrollbar */
.column-list::-webkit-scrollbar {
  @apply w-1;
}

.column-list::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-700 rounded;
}

.column-list::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600 rounded;
}

.column-list::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500 dark:bg-gray-500;
}
</style>