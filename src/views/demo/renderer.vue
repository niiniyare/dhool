<template>
  <div class="renderer-demo">
    <div class="renderer-demo__header">
      <div class="flex items-center gap-3 mb-4">
        <i class="pi pi-code text-2xl text-blue-600" />
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Schema Renderer Demo
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Live schema editor with real-time preview
          </p>
        </div>
      </div>
    </div>

    <div class="renderer-demo__content">
      <Splitter :layout="'horizontal'">
        <!-- Schema Editor Panel -->
        <SplitterPanel :size="50" :min-size="30">
          <div class="editor-panel">
            <div class="editor-panel__header">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Schema Editor
                </h2>
                <div class="flex items-center gap-2">
                  <Dropdown
                    v-model="selectedTemplate"
                    :options="templateOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Load Template"
                    class="w-48"
                    @change="loadTemplate"
                  />
                  <Button
                    icon="pi pi-refresh"
                    severity="secondary"
                    outlined
                    @click="resetSchema"
                    v-tooltip="'Reset to default'"
                  />
                  <Button
                    icon="pi pi-download"
                    severity="secondary"
                    outlined
                    @click="downloadSchema"
                    v-tooltip="'Download schema'"
                  />
                </div>
              </div>
            </div>

            <div class="editor-panel__content">
              <!-- JSON Editor -->
              <div class="json-editor-container">
                <Textarea
                  v-model="schemaJson"
                  :auto-resize="true"
                  :rows="30"
                  class="json-editor"
                  placeholder="Enter your schema JSON here..."
                  @input="updateSchema"
                />
              </div>

              <!-- Validation Messages -->
              <div v-if="validationError" class="validation-error mt-3">
                <Message severity="error" :closable="false">
                  <template #icon>
                    <i class="pi pi-exclamation-triangle" />
                  </template>
                  <div>
                    <h4 class="font-medium">Schema Validation Error</h4>
                    <pre class="text-xs mt-1 whitespace-pre-wrap">{{ validationError }}</pre>
                  </div>
                </Message>
              </div>

              <div v-if="!validationError && parsedSchema" class="validation-success mt-3">
                <Message severity="success" :closable="false">
                  <template #icon>
                    <i class="pi pi-check-circle" />
                  </template>
                  <div>
                    <h4 class="font-medium">Schema Valid</h4>
                    <p class="text-xs mt-1">
                      {{ Object.keys(parsedSchema.formView?.fields || {}).length }} fields,
                      {{ parsedSchema.listView?.columns?.length || 0 }} columns defined
                    </p>
                  </div>
                </Message>
              </div>
            </div>
          </div>
        </SplitterPanel>

        <!-- Preview Panel -->
        <SplitterPanel :size="50" :min-size="30">
          <div class="preview-panel">
            <div class="preview-panel__header">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Live Preview
                </h2>
                <div class="flex items-center gap-2">
                  <SelectButton
                    v-model="previewMode"
                    :options="previewModes"
                    option-label="label"
                    option-value="value"
                    size="small"
                  />
                </div>
              </div>
            </div>

            <div class="preview-panel__content">
              <!-- Schema Preview -->
              <div v-if="!validationError && parsedSchema" class="schema-preview">
                <!-- List View Preview -->
                <div v-if="previewMode === 'list'" class="list-preview">
                  <DocumentPage
                    :doc-type="parsedSchema.name"
                    :key="schemaKey"
                    :show-header="false"
                    @error="handlePreviewError"
                  />
                </div>

                <!-- Form View Preview -->
                <div v-else-if="previewMode === 'form'" class="form-preview">
                  <div class="form-preview-container p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div class="mb-4">
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {{ parsedSchema.label }} Form Preview
                      </h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Interactive form based on your schema
                      </p>
                    </div>
                    
                    <FormBuilder
                      v-if="formBuilderSchema"
                      :schema="formBuilderSchema"
                      v-model="formData"
                      mode="create"
                      :show-cancel-button="false"
                      @submit="handleFormSubmit"
                      @field-change="handleFormFieldChange"
                    />
                  </div>
                </div>

                <!-- Schema Structure Preview -->
                <div v-else-if="previewMode === 'structure'" class="structure-preview">
                  <div class="space-y-6">
                    <!-- Schema Overview -->
                    <Card>
                      <template #title>
                        <div class="flex items-center gap-2">
                          <i :class="parsedSchema.icon || 'pi pi-file'" />
                          Schema Overview
                        </div>
                      </template>
                      <template #content>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Name:</strong> {{ parsedSchema.name }}
                          </div>
                          <div>
                            <strong>Label:</strong> {{ parsedSchema.label }}
                          </div>
                          <div>
                            <strong>Module:</strong> {{ parsedSchema.module }}
                          </div>
                          <div>
                            <strong>Fields:</strong> {{ Object.keys(parsedSchema.formView?.fields || {}).length }}
                          </div>
                        </div>
                      </template>
                    </Card>

                    <!-- Fields Preview -->
                    <Card>
                      <template #title>Form Fields</template>
                      <template #content>
                        <div class="space-y-3">
                          <div
                            v-for="field in parsedSchema.formView?.fields || []"
                            :key="field.name"
                            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div>
                              <div class="font-medium">{{ field.label }}</div>
                              <div class="text-sm text-gray-600 dark:text-gray-400">
                                {{ field.name }} ({{ field.type }})
                                <Badge v-if="field.required" value="Required" severity="danger" class="ml-2" />
                              </div>
                            </div>
                            <Badge :value="field.type" severity="secondary" />
                          </div>
                        </div>
                      </template>
                    </Card>

                    <!-- Columns Preview -->
                    <Card v-if="parsedSchema.listView?.columns">
                      <template #title>List Columns</template>
                      <template #content>
                        <div class="space-y-3">
                          <div
                            v-for="column in parsedSchema.listView.columns"
                            :key="column.field"
                            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div>
                              <div class="font-medium">{{ column.header }}</div>
                              <div class="text-sm text-gray-600 dark:text-gray-400">
                                {{ column.field }} ({{ column.type }})
                              </div>
                            </div>
                            <div class="flex gap-2">
                              <Badge v-if="column.sortable" value="Sortable" severity="success" />
                              <Badge v-if="column.filter" value="Filterable" severity="info" />
                              <Badge :value="column.type" severity="secondary" />
                            </div>
                          </div>
                        </div>
                      </template>
                    </Card>
                  </div>
                </div>
              </div>

              <!-- Error State -->
              <div v-else-if="validationError" class="preview-error">
                <div class="flex flex-col items-center justify-center py-12 text-center">
                  <i class="pi pi-exclamation-triangle text-4xl text-red-500 mb-4" />
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Cannot Preview Schema
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                    Please fix the JSON syntax errors in the schema editor to see the preview.
                  </p>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="preview-empty">
                <div class="flex flex-col items-center justify-center py-12 text-center">
                  <i class="pi pi-code text-4xl text-gray-400 mb-4" />
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Start Editing
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                    Enter a valid JSON schema in the editor to see the live preview here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useToast } from 'primevue/usetoast'

// PrimeVue Components
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import SelectButton from 'primevue/selectbutton'
import Message from 'primevue/message'
import Card from 'primevue/card'
import Badge from 'primevue/badge'

// Components
import DocumentPage from '@/components/renderers/DocumentPage.vue'
import FormBuilder from '@/components/organisms/FormBuilder.vue'

// Types
import type { DocumentSchema } from '@/types/schema'

const toast = useToast()

// Templates
const templateOptions = [
  { label: 'Customer Schema', value: 'customer' },
  { label: 'Invoice Schema', value: 'invoice' },
  { label: 'Product Schema', value: 'product' },
  { label: 'Basic Schema', value: 'basic' }
]

const previewModes = [
  { label: 'List View', value: 'list' },
  { label: 'Form View', value: 'form' },
  { label: 'Structure', value: 'structure' }
]

// Local State
const selectedTemplate = ref('')
const previewMode = ref('structure')
const schemaJson = ref('')
const validationError = ref('')
const parsedSchema = ref<DocumentSchema | null>(null)
const schemaKey = ref(0)
const formData = ref<Record<string, any>>({})

// Default schema template
const defaultSchema = {
  "name": "example",
  "label": "Example Document",
  "labelPlural": "Example Documents",
  "icon": "pi pi-file",
  "module": "demo",
  "api": {
    "baseEndpoint": "/api/v1/examples"
  },
  "listView": {
    "columns": [
      {
        "field": "id",
        "header": "ID",
        "type": "text",
        "sortable": true,
        "width": "80px"
      },
      {
        "field": "name",
        "header": "Name",
        "type": "text",
        "sortable": true,
        "searchable": true,
        "filter": true
      },
      {
        "field": "status",
        "header": "Status",
        "type": "badge",
        "sortable": true,
        "filter": true,
        "filterType": "select",
        "filterOptions": [
          { "label": "Active", "value": "active" },
          { "label": "Inactive", "value": "inactive" }
        ]
      }
    ]
  },
  "formView": {
    "sections": [
      {
        "title": "Basic Information",
        "columns": 2,
        "fields": ["name", "description", "status"]
      }
    ],
    "fields": [
      {
        "name": "name",
        "label": "Name",
        "type": "text",
        "required": true,
        "placeholder": "Enter name"
      },
      {
        "name": "description",
        "label": "Description",
        "type": "textarea",
        "rows": 3,
        "placeholder": "Enter description"
      },
      {
        "name": "status",
        "label": "Status",
        "type": "select",
        "required": true,
        "options": [
          { "label": "Active", "value": "active" },
          { "label": "Inactive", "value": "inactive" }
        ],
        "default": "active"
      }
    ]
  }
}

// Computed Properties
const formBuilderSchema = computed(() => {
  if (!parsedSchema.value) return null
  
  return {
    name: parsedSchema.value.name,
    sections: parsedSchema.value.formView?.sections || [],
    fields: parsedSchema.value.formView?.fields || []
  }
})

// Methods
const updateSchema = () => {
  validationError.value = ''
  parsedSchema.value = null
  
  if (!schemaJson.value.trim()) return
  
  try {
    const parsed = JSON.parse(schemaJson.value)
    parsedSchema.value = parsed
    schemaKey.value += 1
    
    // Generate default form data
    if (parsed.formView?.fields) {
      formData.value = {}
      parsed.formView.fields.forEach((field: any) => {
        if (field.default !== undefined) {
          formData.value[field.name] = field.default
        }
      })
    }
  } catch (error) {
    validationError.value = (error as Error).message
  }
}

const loadTemplate = async () => {
  if (!selectedTemplate.value) return
  
  try {
    // Load template schema from actual files
    const { default: templateSchema } = await import(`@/schemas/${selectedTemplate.value}.json`)
    schemaJson.value = JSON.stringify(templateSchema, null, 2)
    updateSchema()
    
    toast.add({
      severity: 'success',
      summary: 'Template Loaded',
      detail: `${selectedTemplate.value} schema template loaded successfully`,
      life: 3000
    })
  } catch (error) {
    console.error('Failed to load template:', error)
    toast.add({
      severity: 'error',
      summary: 'Failed to Load Template',
      detail: 'Could not load the selected schema template',
      life: 5000
    })
  }
}

const resetSchema = () => {
  schemaJson.value = JSON.stringify(defaultSchema, null, 2)
  selectedTemplate.value = ''
  updateSchema()
}

const downloadSchema = () => {
  if (!parsedSchema.value) {
    toast.add({
      severity: 'warn',
      summary: 'No Schema',
      detail: 'Please create a valid schema before downloading',
      life: 3000
    })
    return
  }
  
  const blob = new Blob([schemaJson.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${parsedSchema.value.name}-schema.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  toast.add({
    severity: 'success',
    summary: 'Schema Downloaded',
    detail: `${parsedSchema.value.name}-schema.json downloaded`,
    life: 3000
  })
}

const handlePreviewError = (error: any) => {
  console.error('Preview error:', error)
}

const handleFormSubmit = (data: any) => {
  toast.add({
    severity: 'info',
    summary: 'Form Submitted',
    detail: 'Form submission successful (preview mode)',
    life: 3000
  })
  console.log('Form data:', data)
}

const handleFormFieldChange = (fieldName: string, value: any) => {
  formData.value[fieldName] = value
}

// Initialize with default schema
resetSchema()

// Watch for template changes
watch(selectedTemplate, () => {
  if (selectedTemplate.value) {
    loadTemplate()
  }
})
</script>

<style scoped>
.renderer-demo {
  @apply h-full flex flex-col bg-gray-50 dark:bg-gray-900;
}

.renderer-demo__header {
  @apply bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4;
}

.renderer-demo__content {
  @apply flex-1;
}

.editor-panel,
.preview-panel {
  @apply h-full flex flex-col bg-white dark:bg-gray-800;
}

.editor-panel__header,
.preview-panel__header {
  @apply border-b border-gray-200 dark:border-gray-700 px-4 py-4;
}

.editor-panel__content,
.preview-panel__content {
  @apply flex-1 p-4 overflow-auto;
}

.json-editor-container {
  @apply relative;
}

.json-editor {
  @apply w-full font-mono text-sm;
}

.json-editor :deep(.p-inputtextarea) {
  @apply bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.validation-error,
.validation-success {
  @apply rounded-lg;
}

.schema-preview {
  @apply h-full;
}

.list-preview {
  @apply h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700;
}

.form-preview {
  @apply h-full overflow-auto;
}

.form-preview-container {
  @apply max-w-2xl mx-auto;
}

.structure-preview {
  @apply space-y-4;
}

.preview-error,
.preview-empty {
  @apply h-full flex items-center justify-center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .renderer-demo__header {
    @apply px-4 py-3;
  }
  
  .editor-panel__header,
  .preview-panel__header {
    @apply px-3 py-3;
  }
  
  .editor-panel__content,
  .preview-panel__content {
    @apply p-3;
  }
  
  .form-preview-container {
    @apply max-w-full;
  }
}

/* Splitter customization */
:deep(.p-splitter) {
  @apply border-0;
}

:deep(.p-splitter-gutter) {
  @apply bg-gray-200 dark:bg-gray-700;
}

:deep(.p-splitter-gutter-handle) {
  @apply bg-gray-400 dark:bg-gray-500;
}
</style>