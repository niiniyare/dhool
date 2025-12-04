<template>
  <Dialog
    v-model:visible="visible"
    :header="dialogTitle"
    modal
    dismissable-mask
    class="widget-config-dialog"
    :style="{ width: '900px', maxWidth: '95vw' }"
    @show="onDialogShow"
    @hide="onDialogHide"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <i :class="getWidgetIcon(widgetForm.type)" class="text-xl text-primary-500" />
        <div>
          <h3 class="font-semibold text-lg">{{ dialogTitle }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ getWidgetDescription(widgetForm.type) }}
          </p>
        </div>
      </div>
    </template>

    <div class="widget-config-content">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- Basic Widget Settings -->
        <div class="config-section">
          <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Basic Settings</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Widget Type -->
            <div class="form-field">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Widget Type *
              </label>
              <Select
                v-model="widgetForm.type"
                :options="widgetTypes"
                option-label="label"
                option-value="value"
                placeholder="Select widget type"
                :disabled="mode === 'edit'"
                class="w-full"
                @update:model-value="onWidgetTypeChange"
              />
            </div>

            <!-- Widget Title -->
            <div class="form-field">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <InputText
                v-model="widgetForm.title"
                placeholder="Enter widget title"
                class="w-full"
                :invalid="!!errors.title"
              />
              <small v-if="errors.title" class="text-red-500 mt-1">{{ errors.title }}</small>
            </div>
          </div>
        </div>

        <!-- Widget Position & Size -->
        <div class="config-section">
          <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Layout & Position</h4>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <!-- Grid Position -->
            <div class="form-field">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Column
              </label>
              <InputNumber
                v-model="widgetForm.position.x"
                :min="0"
                :max="11"
                placeholder="0"
                class="w-full"
              />
            </div>

            <div class="form-field">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Row
              </label>
              <InputNumber
                v-model="widgetForm.position.y"
                :min="0"
                placeholder="0"
                class="w-full"
              />
            </div>

            <!-- Grid Size -->
            <div class="form-field">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Width (cols)
              </label>
              <InputNumber
                v-model="widgetForm.position.width"
                :min="1"
                :max="12"
                placeholder="1"
                class="w-full"
              />
            </div>

            <div class="form-field">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Height (rows)
              </label>
              <InputNumber
                v-model="widgetForm.position.height"
                :min="1"
                :max="10"
                placeholder="1"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Widget-Specific Configuration -->
        <div v-if="widgetForm.type" class="config-section">
          <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
            {{ getWidgetConfigTitle(widgetForm.type) }}
          </h4>

          <!-- Stat Widget Configuration -->
          <div v-if="widgetForm.type === 'stat'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-field">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Source URL *
                </label>
                <InputText
                  v-model="widgetForm.config.dataSource"
                  placeholder="/api/stats/revenue"
                  class="w-full"
                  :invalid="!!errors.dataSource"
                />
                <small v-if="errors.dataSource" class="text-red-500 mt-1">{{ errors.dataSource }}</small>
              </div>

              <div class="form-field">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Format
                </label>
                <Select
                  v-model="widgetForm.config.format"
                  :options="statFormats"
                  option-label="label"
                  option-value="value"
                  placeholder="Select format"
                  class="w-full"
                />
              </div>

              <div class="form-field">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon
                </label>
                <InputText
                  v-model="widgetForm.config.icon"
                  placeholder="pi pi-dollar"
                  class="w-full"
                />
              </div>

              <div class="form-field">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <Select
                  v-model="widgetForm.config.color"
                  :options="colorOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select color"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- Chart Widget Configuration -->
          <div v-if="widgetForm.type === 'chart'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-field">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Source URL *
                </label>
                <InputText
                  v-model="widgetForm.config.dataSource"
                  placeholder="/api/charts/sales"
                  class="w-full"
                  :invalid="!!errors.dataSource"
                />
                <small v-if="errors.dataSource" class="text-red-500 mt-1">{{ errors.dataSource }}</small>
              </div>

              <div class="form-field">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chart Type *
                </label>
                <Select
                  v-model="widgetForm.config.chartType"
                  :options="chartTypes"
                  option-label="label"
                  option-value="value"
                  placeholder="Select chart type"
                  class="w-full"
                  :invalid="!!errors.chartType"
                />
                <small v-if="errors.chartType" class="text-red-500 mt-1">{{ errors.chartType }}</small>
              </div>

              <div class="form-field">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  X-Axis Field
                </label>
                <InputText
                  v-model="widgetForm.config.xAxis"
                  placeholder="date"
                  class="w-full"
                />
              </div>

              <div class="form-field">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Y-Axis Field
                </label>
                <InputText
                  v-model="widgetForm.config.yAxis"
                  placeholder="value"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- Table Widget Configuration -->
          <div v-if="widgetForm.type === 'table'" class="space-y-4">
            <div class="form-field">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Source URL *
              </label>
              <InputText
                v-model="widgetForm.config.dataSource"
                placeholder="/api/tables/recent-orders"
                class="w-full"
                :invalid="!!errors.dataSource"
              />
              <small v-if="errors.dataSource" class="text-red-500 mt-1">{{ errors.dataSource }}</small>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-field">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Page Size
                </label>
                <InputNumber
                  v-model="widgetForm.config.pageSize"
                  :min="1"
                  :max="50"
                  placeholder="5"
                  class="w-full"
                />
              </div>

              <div class="form-field flex items-center gap-3 pt-6">
                <Checkbox
                  v-model="widgetForm.config.striped"
                  inputId="striped"
                  binary
                />
                <label for="striped" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Striped Rows
                </label>
              </div>
            </div>

            <!-- Table Columns Configuration -->
            <div class="form-field">
              <div class="flex items-center justify-between mb-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Columns *
                </label>
                <Button
                  label="Add Column"
                  icon="pi pi-plus"
                  size="small"
                  severity="secondary"
                  outlined
                  @click="addTableColumn"
                />
              </div>

              <div class="space-y-3">
                <div
                  v-for="(column, index) in widgetForm.config.columns"
                  :key="index"
                  class="table-column-config p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Field
                      </label>
                      <InputText
                        v-model="column.field"
                        placeholder="fieldName"
                        class="w-full"
                        size="small"
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Header
                      </label>
                      <InputText
                        v-model="column.header"
                        placeholder="Column Title"
                        class="w-full"
                        size="small"
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Format
                      </label>
                      <Select
                        v-model="column.format"
                        :options="columnFormats"
                        option-label="label"
                        option-value="value"
                        placeholder="Format"
                        class="w-full"
                        size="small"
                      />
                    </div>

                    <div class="flex items-end gap-2">
                      <div class="flex-1">
                        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Width
                        </label>
                        <InputText
                          v-model="column.width"
                          placeholder="100px"
                          class="w-full"
                          size="small"
                        />
                      </div>
                      <Button
                        icon="pi pi-trash"
                        severity="danger"
                        text
                        size="small"
                        @click="removeTableColumn(index)"
                      />
                    </div>
                  </div>

                  <div class="flex items-center gap-4 mt-3">
                    <div class="flex items-center gap-2">
                      <Checkbox
                        v-model="column.sortable"
                        :inputId="`sortable-${index}`"
                        binary
                      />
                      <label :for="`sortable-${index}`" class="text-xs text-gray-600 dark:text-gray-400">
                        Sortable
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- List Widget Configuration -->
          <div v-if="widgetForm.type === 'list'" class="space-y-4">
            <div class="form-field">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Source URL *
              </label>
              <InputText
                v-model="widgetForm.config.dataSource"
                placeholder="/api/lists/recent-activities"
                class="w-full"
                :invalid="!!errors.dataSource"
              />
              <small v-if="errors.dataSource" class="text-red-500 mt-1">{{ errors.dataSource }}</small>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-field">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Items
                </label>
                <InputNumber
                  v-model="widgetForm.config.maxItems"
                  :min="1"
                  :max="100"
                  placeholder="10"
                  class="w-full"
                />
              </div>

              <div class="form-field flex items-center gap-3 pt-6">
                <Checkbox
                  v-model="widgetForm.config.showAvatar"
                  inputId="showAvatar"
                  binary
                />
                <label for="showAvatar" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show Avatar
                </label>
              </div>
            </div>

            <!-- Item Template Configuration -->
            <div class="form-field">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Item Template *
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Title Field *
                  </label>
                  <InputText
                    v-model="widgetForm.config.itemTemplate.title"
                    placeholder="title"
                    class="w-full"
                    :invalid="!!errors.titleField"
                  />
                  <small v-if="errors.titleField" class="text-red-500 mt-1">{{ errors.titleField }}</small>
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Subtitle Field
                  </label>
                  <InputText
                    v-model="widgetForm.config.itemTemplate.subtitle"
                    placeholder="subtitle"
                    class="w-full"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Description Field
                  </label>
                  <InputText
                    v-model="widgetForm.config.itemTemplate.description"
                    placeholder="description"
                    class="w-full"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Avatar Field
                  </label>
                  <InputText
                    v-model="widgetForm.config.itemTemplate.avatar"
                    placeholder="avatar"
                    class="w-full"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Timestamp Field
                  </label>
                  <InputText
                    v-model="widgetForm.config.itemTemplate.timestamp"
                    placeholder="createdAt"
                    class="w-full"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Status Field
                  </label>
                  <InputText
                    v-model="widgetForm.config.itemTemplate.status"
                    placeholder="status"
                    class="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced Settings -->
        <div class="config-section">
          <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Advanced Settings</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-field">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Auto Refresh (seconds)
              </label>
              <InputNumber
                v-model="widgetForm.refreshInterval"
                :min="0"
                :max="3600"
                placeholder="0 (disabled)"
                class="w-full"
              />
              <small class="text-gray-500 dark:text-gray-400 mt-1">
                0 to disable auto-refresh
              </small>
            </div>

            <div class="form-field flex items-center gap-3 pt-6">
              <Checkbox
                v-model="widgetForm.visible"
                inputId="visible"
                binary
              />
              <label for="visible" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Widget Visible
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>

    <template #footer>
      <div class="flex justify-between">
        <div>
          <Button
            v-if="mode === 'edit'"
            label="Delete Widget"
            icon="pi pi-trash"
            severity="danger"
            text
            @click="onDelete"
          />
        </div>
        <div class="flex gap-2">
          <Button
            label="Cancel"
            severity="secondary"
            outlined
            @click="onCancel"
          />
          <Button
            :label="mode === 'create' ? 'Add Widget' : 'Update Widget'"
            icon="pi pi-check"
            @click="onSubmit"
            :loading="saving"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'

interface WidgetFormData {
  id?: string
  type: string
  title: string
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  config: Record<string, any>
  refreshInterval?: number
  visible: boolean
}

interface Props {
  visible: boolean
  widget?: any
  mode: 'create' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  widget: null,
  mode: 'create'
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  save: [widget: WidgetFormData]
  delete: [widgetId: string]
}>()

// State
const saving = ref(false)
const errors = reactive<Record<string, string>>({})

// Form data
const widgetForm = reactive<WidgetFormData>({
  type: '',
  title: '',
  position: { x: 0, y: 0, width: 3, height: 2 },
  config: {},
  refreshInterval: 0,
  visible: true
})

// Configuration options
const widgetTypes = [
  { label: 'Statistics Card', value: 'stat', icon: 'pi pi-chart-line' },
  { label: 'Chart', value: 'chart', icon: 'pi pi-chart-bar' },
  { label: 'Data Table', value: 'table', icon: 'pi pi-table' },
  { label: 'List', value: 'list', icon: 'pi pi-list' }
]

const statFormats = [
  { label: 'Number', value: 'number' },
  { label: 'Currency', value: 'currency' },
  { label: 'Percentage', value: 'percentage' },
  { label: 'Bytes', value: 'bytes' }
]

const chartTypes = [
  { label: 'Line Chart', value: 'line' },
  { label: 'Bar Chart', value: 'bar' },
  { label: 'Pie Chart', value: 'pie' },
  { label: 'Doughnut Chart', value: 'doughnut' },
  { label: 'Area Chart', value: 'area' },
  { label: 'Scatter Plot', value: 'scatter' }
]

const columnFormats = [
  { label: 'Text', value: 'text' },
  { label: 'Number', value: 'number' },
  { label: 'Currency', value: 'currency' },
  { label: 'Percentage', value: 'percentage' },
  { label: 'Date', value: 'date' },
  { label: 'Date & Time', value: 'datetime' },
  { label: 'Badge', value: 'badge' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' }
]

const colorOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Primary', value: 'primary' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
  { label: 'Danger', value: 'danger' }
]

// Computed
const dialogTitle = computed(() => {
  return props.mode === 'create' ? 'Add New Widget' : 'Edit Widget'
})

// Methods
const getWidgetIcon = (type: string): string => {
  const typeConfig = widgetTypes.find(t => t.value === type)
  return typeConfig?.icon || 'pi pi-cog'
}

const getWidgetDescription = (type: string): string => {
  const descriptions = {
    stat: 'Display key metrics and statistics with trends',
    chart: 'Visualize data with various chart types',
    table: 'Show tabular data with columns and pagination',
    list: 'Display items in a structured list format'
  }
  return descriptions[type as keyof typeof descriptions] || ''
}

const getWidgetConfigTitle = (type: string): string => {
  const titles = {
    stat: 'Statistics Configuration',
    chart: 'Chart Configuration', 
    table: 'Table Configuration',
    list: 'List Configuration'
  }
  return titles[type as keyof typeof titles] || 'Configuration'
}

const initializeForm = () => {
  if (props.widget) {
    Object.assign(widgetForm, {
      id: props.widget.id,
      type: props.widget.type,
      title: props.widget.title,
      position: { ...props.widget.position },
      config: { ...props.widget.config },
      refreshInterval: props.widget.refreshInterval || 0,
      visible: props.widget.visible !== false
    })
  } else {
    Object.assign(widgetForm, {
      type: '',
      title: '',
      position: { x: 0, y: 0, width: 3, height: 2 },
      config: {},
      refreshInterval: 0,
      visible: true
    })
  }
  
  // Clear errors
  Object.keys(errors).forEach(key => delete errors[key])
}

const onWidgetTypeChange = (type: string) => {
  // Reset config when type changes
  widgetForm.config = {}
  
  // Set default configurations based on type
  switch (type) {
    case 'stat':
      widgetForm.config = {
        format: 'number',
        color: 'primary'
      }
      widgetForm.position = { ...widgetForm.position, width: 3, height: 2 }
      break
    
    case 'chart':
      widgetForm.config = {
        chartType: 'line'
      }
      widgetForm.position = { ...widgetForm.position, width: 6, height: 3 }
      break
    
    case 'table':
      widgetForm.config = {
        columns: [],
        pageSize: 5,
        striped: false
      }
      widgetForm.position = { ...widgetForm.position, width: 8, height: 4 }
      break
    
    case 'list':
      widgetForm.config = {
        itemTemplate: {
          title: ''
        },
        maxItems: 10,
        showAvatar: true
      }
      widgetForm.position = { ...widgetForm.position, width: 4, height: 4 }
      break
  }
}

const addTableColumn = () => {
  if (!widgetForm.config.columns) {
    widgetForm.config.columns = []
  }
  
  widgetForm.config.columns.push({
    field: '',
    header: '',
    sortable: false,
    format: 'text'
  })
}

const removeTableColumn = (index: number) => {
  widgetForm.config.columns.splice(index, 1)
}

const validateForm = (): boolean => {
  Object.keys(errors).forEach(key => delete errors[key])
  
  // Basic validation
  if (!widgetForm.title.trim()) {
    errors.title = 'Title is required'
  }
  
  if (!widgetForm.type) {
    errors.type = 'Widget type is required'
  }
  
  // Type-specific validation
  if (widgetForm.type === 'chart' && !widgetForm.config.chartType) {
    errors.chartType = 'Chart type is required'
  }
  
  if (['stat', 'chart', 'table', 'list'].includes(widgetForm.type) && !widgetForm.config.dataSource) {
    errors.dataSource = 'Data source URL is required'
  }
  
  if (widgetForm.type === 'list' && !widgetForm.config.itemTemplate?.title) {
    errors.titleField = 'Title field is required'
  }
  
  return Object.keys(errors).length === 0
}

const onSubmit = async () => {
  if (!validateForm()) return
  
  saving.value = true
  
  try {
    const widgetData = {
      ...widgetForm,
      id: widgetForm.id || `widget-${Date.now()}`
    }
    
    emit('save', widgetData)
  } finally {
    saving.value = false
  }
}

const onCancel = () => {
  emit('update:visible', false)
}

const onDelete = () => {
  if (widgetForm.id) {
    emit('delete', widgetForm.id)
  }
}

const onDialogShow = () => {
  initializeForm()
}

const onDialogHide = () => {
  // Dialog is closing
}

// Watchers
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    initializeForm()
  }
})
</script>

<style scoped>
.widget-config-dialog {
  --p-dialog-header-padding: 1.5rem;
}

.widget-config-content {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.config-section {
  @apply border-b border-gray-200 dark:border-gray-700 pb-6;
}

.config-section:last-child {
  @apply border-b-0 pb-0;
}

.form-field {
  @apply space-y-1;
}

.table-column-config {
  @apply bg-gray-50 dark:bg-gray-900;
}

/* Custom scrollbar */
.widget-config-content::-webkit-scrollbar {
  width: 6px;
}

.widget-config-content::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800 rounded;
}

.widget-config-content::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded;
}

.widget-config-content::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .widget-config-dialog {
    --p-dialog-width: 95vw;
    --p-dialog-max-height: 90vh;
  }
  
  .widget-config-content {
    max-height: 60vh;
  }
}
</style>