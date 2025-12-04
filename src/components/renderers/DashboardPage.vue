<template>
  <div class="dashboard-page">
    <!-- Dashboard Header -->
    <div v-if="showHeader" class="dashboard-page__header">
      <div class="dashboard-page__title-section">
        <div class="flex items-center gap-3">
          <i v-if="dashboardConfig?.icon || schema?.icon" :class="dashboardConfig?.icon || schema?.icon" class="text-2xl text-gray-600 dark:text-gray-400" />
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ pageTitle }}
            </h1>
            <p v-if="dashboardConfig?.description || schema?.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ dashboardConfig?.description || schema?.description }}
            </p>
          </div>
        </div>
        
        <!-- Dashboard Actions -->
        <div class="dashboard-page__actions">
          <Button
            v-if="canEdit && !editMode"
            label="Edit"
            icon="pi pi-pencil"
            severity="secondary"
            outlined
            @click="enableEditMode"
          />
          <Button
            v-if="editMode"
            label="Save"
            icon="pi pi-check"
            @click="saveDashboard"
            :loading="saving"
          />
          <Button
            v-if="editMode"
            label="Cancel"
            icon="pi pi-times"
            severity="secondary"
            outlined
            @click="cancelEdit"
          />
          <Button
            v-if="!editMode"
            label="Refresh"
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            @click="refreshDashboard"
            :loading="loading"
          />
          <slot name="header-actions" />
        </div>
      </div>
      
      <!-- Dashboard Filters -->
      <div v-if="hasFilters" class="dashboard-page__filters">
        <div class="flex items-center gap-4 flex-wrap">
          <!-- Date Range Filter -->
          <div v-if="filters?.dateRange?.enabled" class="filter-item">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Date Range
            </label>
            <Calendar 
              v-model="filterValues.dateRange"
              selection-mode="range"
              date-format="mm/dd/yy"
              show-icon
              icon-display="input"
              class="w-64"
              @update:model-value="onFilterChange"
            />
          </div>
          
          <!-- Custom Filters -->
          <div
            v-for="filter in filters?.customFilters"
            :key="filter.field"
            class="filter-item"
          >
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              {{ filter.label }}
            </label>
            
            <!-- Select Filter -->
            <Select
              v-if="filter.type === 'select'"
              v-model="filterValues.custom[filter.field]"
              :options="filter.options"
              option-label="label"
              option-value="value"
              placeholder="Select..."
              class="w-48"
              @update:model-value="onFilterChange"
            />
            
            <!-- MultiSelect Filter -->
            <MultiSelect
              v-else-if="filter.type === 'multiselect'"
              v-model="filterValues.custom[filter.field]"
              :options="filter.options"
              option-label="label"
              option-value="value"
              placeholder="Select..."
              class="w-48"
              @update:model-value="onFilterChange"
            />
            
            <!-- Text Filter -->
            <InputText
              v-else-if="filter.type === 'text'"
              v-model="filterValues.custom[filter.field]"
              placeholder="Enter text..."
              class="w-48"
              @update:model-value="onFilterChange"
            />
            
            <!-- Number Filter -->
            <InputNumber
              v-else-if="filter.type === 'number'"
              v-model="filterValues.custom[filter.field]"
              placeholder="Enter number..."
              class="w-48"
              @update:model-value="onFilterChange"
            />
            
            <!-- Date Filter -->
            <Calendar
              v-else-if="filter.type === 'date'"
              v-model="filterValues.custom[filter.field]"
              date-format="mm/dd/yy"
              show-icon
              class="w-48"
              @update:model-value="onFilterChange"
            />
          </div>
          
          <!-- Clear Filters -->
          <Button
            v-if="hasActiveFilters"
            label="Clear"
            icon="pi pi-filter-slash"
            severity="secondary"
            text
            @click="clearFilters"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !dashboardConfig" class="dashboard-page__loading">
      <div class="flex flex-col items-center justify-center py-12">
        <ProgressSpinner />
        <p class="text-gray-600 dark:text-gray-400 mt-3">Loading dashboard...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="dashboard-page__error">
      <Message severity="error" :closable="false">
        <template #icon>
          <i class="pi pi-exclamation-triangle" />
        </template>
        <div>
          <h3 class="font-medium">Failed to load dashboard</h3>
          <p class="text-sm mt-1">{{ error.message }}</p>
          <Button 
            label="Retry" 
            size="small" 
            severity="secondary" 
            @click="loadDashboard" 
            class="mt-2"
          />
        </div>
      </Message>
    </div>

    <!-- No Access State -->
    <div v-else-if="!hasAccess && dashboardConfig" class="dashboard-page__no-access">
      <Message severity="warn" :closable="false">
        <template #icon>
          <i class="pi pi-lock" />
        </template>
        <div>
          <h3 class="font-medium">Access Restricted</h3>
          <p class="text-sm mt-1">
            You don't have permission to view this dashboard.
          </p>
        </div>
      </Message>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="dashboardConfig" class="dashboard-page__content">
      <!-- Empty State -->
      <div v-if="!visibleWidgets.length" class="dashboard-page__empty">
        <div class="flex flex-col items-center justify-center py-12">
          <i class="pi pi-chart-bar text-6xl text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No widgets configured
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-center mb-4">
            This dashboard doesn't have any widgets configured yet.
          </p>
          <Button
            v-if="canEdit"
            label="Configure Dashboard"
            icon="pi pi-cog"
            @click="enableEditMode"
          />
        </div>
      </div>

      <!-- Widget Grid -->
      <div v-else class="dashboard-grid" :style="gridStyles">
        <div
          v-for="widget in visibleWidgets"
          :key="widget.id"
          class="widget-container"
          :style="getWidgetStyles(widget)"
          :class="{
            'widget-container--editing': editMode,
            'widget-container--error': widgetErrors[widget.id]
          }"
        >
          <!-- Widget Header -->
          <div class="widget-header">
            <div class="widget-title">
              <h4 class="font-medium text-gray-900 dark:text-white">
                {{ widget.title }}
              </h4>
              <div v-if="editMode" class="widget-controls">
                <Button
                  icon="pi pi-cog"
                  severity="secondary"
                  text
                  size="small"
                  @click="editWidget(widget)"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  size="small"
                  @click="deleteWidget(widget)"
                />
              </div>
            </div>
            <div v-if="!editMode && widget.refreshInterval" class="widget-refresh">
              <Button
                icon="pi pi-refresh"
                severity="secondary"
                text
                size="small"
                @click="refreshWidget(widget)"
                :loading="widgetLoading[widget.id]"
              />
            </div>
          </div>

          <!-- Widget Content -->
          <div class="widget-content">
            <!-- Widget Loading -->
            <div v-if="widgetLoading[widget.id]" class="widget-loading">
              <ProgressSpinner size="small" />
              <span class="text-sm text-gray-600 dark:text-gray-400 ml-2">Loading...</span>
            </div>

            <!-- Widget Error -->
            <div v-else-if="widgetErrors[widget.id]" class="widget-error">
              <Message severity="error" :closable="false" class="m-0">
                <div class="text-sm">
                  <p class="font-medium">Widget Error</p>
                  <p class="text-xs mt-1">{{ widgetErrors[widget.id] }}</p>
                </div>
              </Message>
            </div>

            <!-- Widget Renderer -->
            <component
              v-else
              :is="getWidgetComponent(widget.type)"
              :widget="widget"
              :data="widgetData[widget.id]"
              :loading="widgetLoading[widget.id]"
              :edit-mode="editMode"
              @refresh="refreshWidget(widget)"
              @configure="editWidget(widget)"
            />
          </div>
        </div>
      </div>

      <!-- Add Widget Button (Edit Mode) -->
      <div v-if="editMode" class="dashboard-page__add-widget">
        <Button
          label="Add Widget"
          icon="pi pi-plus"
          severity="secondary"
          outlined
          @click="showAddWidgetDialog"
        />
      </div>
    </div>

    <!-- Widget Configuration Dialog -->
    <Dialog
      v-model:visible="showWidgetDialog"
      :header="widgetDialogMode === 'create' ? 'Add Widget' : 'Edit Widget'"
      modal
      dismissable-mask
      class="widget-config-dialog"
      :style="{ width: '800px' }"
    >
      <div class="widget-config-form">
        <!-- Widget configuration form would go here -->
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Widget configuration interface would be implemented here based on the widget type and schema.
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="Cancel"
            severity="secondary"
            outlined
            @click="cancelWidgetConfig"
          />
          <Button
            :label="widgetDialogMode === 'create' ? 'Add Widget' : 'Update Widget'"
            @click="saveWidgetConfig"
            :loading="saving"
          />
        </div>
      </template>
    </Dialog>

    <!-- Toast Messages -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

// PrimeVue Components
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import MultiSelect from 'primevue/multiselect'
import ProgressSpinner from 'primevue/progressspinner'
import Select from 'primevue/select'
import Toast from 'primevue/toast'

// Composables
import { useSchema } from '@/composables/useSchema'
import { useAccess } from '@/composables/useAccess'

// Widget Components
import StatWidget from '@/components/widgets/StatWidget.vue'
import ChartWidget from '@/components/widgets/ChartWidget.vue'
import TableWidget from '@/components/widgets/TableWidget.vue'
import ListWidget from '@/components/widgets/ListWidget.vue'

// Types
interface DashboardWidget {
  id: string
  type: 'stat' | 'chart' | 'table' | 'list'
  title: string
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  config: Record<string, any>
  refreshInterval?: number
  visible?: boolean
}

interface DashboardConfig {
  id: string
  name: string
  description?: string
  icon?: string
  layout: {
    columns: number
    gap: number
    responsive: boolean
    breakpoints?: Record<string, number>
  }
  widgets: DashboardWidget[]
  filters?: {
    dateRange?: {
      enabled: boolean
      defaultRange: string
    }
    customFilters?: Array<{
      field: string
      type: string
      label: string
      options?: Array<{ label: string; value: string }>
    }>
  }
  access?: {
    roles?: string[]
    permissions?: {
      view?: string[]
      edit?: string[]
    }
  }
}

interface Props {
  dashboardId?: string
  config?: DashboardConfig
  showHeader?: boolean
  editable?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  editable: false,
  autoRefresh: true,
  refreshInterval: 300000 // 5 minutes
})

const emit = defineEmits<{
  dashboardChanged: [config: DashboardConfig]
  widgetClicked: [widget: DashboardWidget, data: any]
  error: [error: Error]
}>()

const route = useRoute()

// Composables
const { canPerform } = useAccess()

// Local State
const dashboardConfig = ref<DashboardConfig | null>(props.config || null)
const loading = ref(false)
const saving = ref(false)
const error = ref<Error | null>(null)
const editMode = ref(false)
const widgetData = reactive<Record<string, any>>({})
const widgetLoading = reactive<Record<string, boolean>>({})
const widgetErrors = reactive<Record<string, string>>({})
const refreshIntervals = reactive<Record<string, NodeJS.Timeout>>({})

// Filter State
const filterValues = reactive({
  dateRange: null as Date[] | null,
  custom: {} as Record<string, any>
})

// Widget Dialog State
const showWidgetDialog = ref(false)
const widgetDialogMode = ref<'create' | 'edit'>('create')
const selectedWidget = ref<DashboardWidget | null>(null)

// Computed Properties
const pageTitle = computed(() => {
  return dashboardConfig.value?.name || 'Dashboard'
})

const hasAccess = computed(() => {
  if (!dashboardConfig.value?.access) return true
  
  const access = dashboardConfig.value.access
  
  // Check role access
  if (access.roles?.length) {
    // This would use the actual user role checking
    // return hasAnyRole(access.roles)
  }
  
  // Check permission access
  if (access.permissions?.view?.length) {
    return access.permissions.view.some(permission => canPerform(permission))
  }
  
  return true
})

const canEdit = computed(() => {
  if (!props.editable || !hasAccess.value) return false
  
  const access = dashboardConfig.value?.access
  if (access?.permissions?.edit?.length) {
    return access.permissions.edit.some(permission => canPerform(permission))
  }
  
  return true
})

const visibleWidgets = computed(() => {
  if (!dashboardConfig.value?.widgets) return []
  return dashboardConfig.value.widgets
    .filter(widget => widget.visible !== false)
    .sort((a, b) => {
      if (a.position.y !== b.position.y) {
        return a.position.y - b.position.y
      }
      return a.position.x - b.position.x
    })
})

const filters = computed(() => dashboardConfig.value?.filters)

const hasFilters = computed(() => {
  return filters.value?.dateRange?.enabled || 
         (filters.value?.customFilters?.length ?? 0) > 0
})

const hasActiveFilters = computed(() => {
  if (filterValues.dateRange?.length) return true
  
  return Object.values(filterValues.custom).some(value => 
    value !== null && value !== undefined && value !== ''
  )
})

const gridStyles = computed(() => {
  if (!dashboardConfig.value?.layout) return {}
  
  const layout = dashboardConfig.value.layout
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
    gap: `${layout.gap}px`,
    padding: `${layout.gap}px`
  }
})

// Methods
const loadDashboard = async () => {
  if (!props.dashboardId && !props.config) {
    error.value = new Error('Dashboard ID or config is required')
    return
  }
  
  if (props.config) {
    dashboardConfig.value = props.config
    await loadAllWidgets()
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    // This would fetch the dashboard configuration from the API
    // const response = await fetch(`/api/dashboards/${props.dashboardId}`)
    // dashboardConfig.value = await response.json()
    
    // For demo purposes, using a mock configuration
    dashboardConfig.value = {
      id: props.dashboardId || 'demo',
      name: 'Demo Dashboard',
      description: 'A sample dashboard configuration',
      layout: {
        columns: 12,
        gap: 16,
        responsive: true
      },
      widgets: []
    }
    
    await loadAllWidgets()
  } catch (err) {
    error.value = err as Error
    emit('error', err as Error)
  } finally {
    loading.value = false
  }
}

const loadAllWidgets = async () => {
  if (!dashboardConfig.value?.widgets) return
  
  const promises = dashboardConfig.value.widgets.map(widget => loadWidgetData(widget))
  await Promise.allSettled(promises)
}

const loadWidgetData = async (widget: DashboardWidget) => {
  if (!widget.config?.dataSource) return
  
  widgetLoading[widget.id] = true
  widgetErrors[widget.id] = ''
  
  try {
    // Apply filters to data source URL
    const url = buildDataSourceUrl(widget.config.dataSource)
    
    // This would fetch data from the widget's data source
    // const response = await fetch(url)
    // const data = await response.json()
    
    // Mock data for demo
    widgetData[widget.id] = generateMockData(widget.type)
  } catch (err) {
    widgetErrors[widget.id] = (err as Error).message
  } finally {
    widgetLoading[widget.id] = false
  }
}

const buildDataSourceUrl = (baseUrl: string): string => {
  const url = new URL(baseUrl, window.location.origin)
  
  // Add date range filter
  if (filterValues.dateRange?.length === 2) {
    url.searchParams.set('start_date', filterValues.dateRange[0].toISOString())
    url.searchParams.set('end_date', filterValues.dateRange[1].toISOString())
  }
  
  // Add custom filters
  Object.entries(filterValues.custom).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, Array.isArray(value) ? value.join(',') : String(value))
    }
  })
  
  return url.toString()
}

const generateMockData = (widgetType: string) => {
  switch (widgetType) {
    case 'stat':
      return {
        value: Math.floor(Math.random() * 10000),
        label: 'Sample Stat',
        trend: {
          value: Math.floor(Math.random() * 20) - 10,
          direction: Math.random() > 0.5 ? 'up' : 'down'
        }
      }
    
    case 'chart':
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Sample Data',
          data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 100))
        }]
      }
    
    case 'table':
      return Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: Math.floor(Math.random() * 1000),
        status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)]
      }))
    
    case 'list':
      return Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        title: `List Item ${i + 1}`,
        subtitle: `Subtitle ${i + 1}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000)
      }))
    
    default:
      return {}
  }
}

const getWidgetStyles = (widget: DashboardWidget) => {
  return {
    gridColumn: `${widget.position.x + 1} / span ${widget.position.width}`,
    gridRow: `${widget.position.y + 1} / span ${widget.position.height}`,
    minHeight: `${widget.position.height * 200}px`
  }
}

const getWidgetComponent = (type: string) => {
  const components = {
    stat: StatWidget,
    chart: ChartWidget,
    table: TableWidget,
    list: ListWidget
  }
  return components[type as keyof typeof components] || 'div'
}

const refreshDashboard = async () => {
  await loadAllWidgets()
}

const refreshWidget = async (widget: DashboardWidget) => {
  await loadWidgetData(widget)
}

const setupAutoRefresh = () => {
  if (!props.autoRefresh || !dashboardConfig.value?.widgets) return
  
  dashboardConfig.value.widgets.forEach(widget => {
    if (widget.refreshInterval && widget.refreshInterval > 0) {
      refreshIntervals[widget.id] = setInterval(() => {
        refreshWidget(widget)
      }, widget.refreshInterval * 1000)
    }
  })
}

const clearAutoRefresh = () => {
  Object.values(refreshIntervals).forEach(interval => {
    clearInterval(interval)
  })
  Object.keys(refreshIntervals).forEach(key => {
    delete refreshIntervals[key]
  })
}

// Filter Methods
const onFilterChange = () => {
  // Debounce filter changes
  setTimeout(() => {
    loadAllWidgets()
  }, 300)
}

const clearFilters = () => {
  filterValues.dateRange = null
  Object.keys(filterValues.custom).forEach(key => {
    filterValues.custom[key] = null
  })
  loadAllWidgets()
}

// Edit Mode Methods
const enableEditMode = () => {
  if (!canEdit.value) return
  editMode.value = true
  clearAutoRefresh()
}

const cancelEdit = () => {
  editMode.value = false
  setupAutoRefresh()
}

const saveDashboard = async () => {
  if (!dashboardConfig.value) return
  
  saving.value = true
  
  try {
    // This would save the dashboard configuration
    // await fetch(`/api/dashboards/${dashboardConfig.value.id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(dashboardConfig.value)
    // })
    
    emit('dashboardChanged', dashboardConfig.value)
    editMode.value = false
    setupAutoRefresh()
  } catch (err) {
    error.value = err as Error
  } finally {
    saving.value = false
  }
}

// Widget Management Methods
const showAddWidgetDialog = () => {
  widgetDialogMode.value = 'create'
  selectedWidget.value = null
  showWidgetDialog.value = true
}

const editWidget = (widget: DashboardWidget) => {
  widgetDialogMode.value = 'edit'
  selectedWidget.value = widget
  showWidgetDialog.value = true
}

const deleteWidget = (widget: DashboardWidget) => {
  if (!dashboardConfig.value) return
  
  const index = dashboardConfig.value.widgets.findIndex(w => w.id === widget.id)
  if (index > -1) {
    dashboardConfig.value.widgets.splice(index, 1)
    delete widgetData[widget.id]
    delete widgetLoading[widget.id]
    delete widgetErrors[widget.id]
  }
}

const cancelWidgetConfig = () => {
  showWidgetDialog.value = false
  selectedWidget.value = null
}

const saveWidgetConfig = async () => {
  // Widget configuration save logic would go here
  showWidgetDialog.value = false
  selectedWidget.value = null
}

// Lifecycle
onMounted(() => {
  loadDashboard()
})

onUnmounted(() => {
  clearAutoRefresh()
})

// Watchers
watch(() => props.config, (newConfig) => {
  if (newConfig) {
    dashboardConfig.value = newConfig
    loadAllWidgets()
  }
}, { deep: true })

watch(() => props.dashboardId, (newId) => {
  if (newId) {
    loadDashboard()
  }
})

watch(() => editMode.value, (isEditing) => {
  if (isEditing) {
    clearAutoRefresh()
  } else {
    setupAutoRefresh()
  }
})
</script>

<style scoped>
.dashboard-page {
  @apply h-full flex flex-col bg-gray-50 dark:bg-gray-900;
}

.dashboard-page__header {
  @apply border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4;
}

.dashboard-page__title-section {
  @apply flex items-center justify-between mb-4;
}

.dashboard-page__actions {
  @apply flex items-center gap-2;
}

.dashboard-page__filters {
  @apply mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700;
}

.filter-item {
  @apply flex flex-col;
}

.dashboard-page__loading,
.dashboard-page__error,
.dashboard-page__no-access {
  @apply p-6;
}

.dashboard-page__content {
  @apply flex-1 overflow-auto;
}

.dashboard-page__empty {
  @apply flex items-center justify-center h-full;
}

.dashboard-grid {
  @apply min-h-full;
}

.widget-container {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-shadow duration-200;
}

.widget-container:hover {
  @apply shadow-md;
}

.widget-container--editing {
  @apply ring-2 ring-primary-500 dark:ring-primary-400;
}

.widget-container--error {
  @apply border-red-300 dark:border-red-600;
}

.widget-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900;
}

.widget-title {
  @apply flex items-center justify-between flex-1;
}

.widget-controls {
  @apply flex items-center gap-1 ml-2;
}

.widget-content {
  @apply p-4 h-full;
}

.widget-loading {
  @apply flex items-center justify-center h-32;
}

.widget-error {
  @apply h-32 flex items-center;
}

.dashboard-page__add-widget {
  @apply p-6 flex justify-center;
}

.widget-config-dialog {
  --p-dialog-header-padding: 1.5rem;
}

/* Responsive Grid */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(8, 1fr) !important;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(4, 1fr) !important;
    padding: 8px !important;
    gap: 8px !important;
  }
  
  .dashboard-page__header {
    @apply px-4 py-3;
  }
  
  .dashboard-page__title-section {
    @apply flex-col items-start gap-3;
  }
  
  .dashboard-page__filters {
    @apply p-3;
  }
  
  .filter-item {
    @apply w-full;
  }
}

@media (max-width: 480px) {
  .dashboard-grid {
    grid-template-columns: 1fr !important;
  }
  
  .widget-container {
    grid-column: 1 !important;
    min-height: 200px !important;
  }
}
</style>