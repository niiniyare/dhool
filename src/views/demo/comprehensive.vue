<template>
  <div class="comprehensive-demo">
    <!-- Header -->
    <div class="demo-header mb-6">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Dhool Comprehensive Demo
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
        Experience all of Dhool's schema-driven components in one comprehensive demonstration.
        Switch between different demos to explore DocumentPage, DataTableCrud, FormBuilder, and Access Control.
      </p>
      
      <!-- Demo Selector -->
      <div class="flex flex-wrap gap-2 mb-4">
        <Button 
          v-for="demo in demoTypes" 
          :key="demo.id"
          :label="demo.label" 
          :icon="demo.icon"
          :severity="activeDemo === demo.id ? 'primary' : 'secondary'"
          :outlined="activeDemo !== demo.id"
          @click="switchDemo(demo.id)"
        />
      </div>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ totalEvents }}</div>
          <div class="text-sm text-blue-700 dark:text-blue-300">Total Events</div>
        </div>
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ Object.keys(mockData).length }}</div>
          <div class="text-sm text-green-700 dark:text-green-300">Records</div>
        </div>
        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ currentSchema?.formView?.fields?.length || 0 }}</div>
          <div class="text-sm text-purple-700 dark:text-purple-300">Form Fields</div>
        </div>
        <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ renderTime }}ms</div>
          <div class="text-sm text-orange-700 dark:text-orange-300">Render Time</div>
        </div>
      </div>
    </div>

    <!-- Configuration Panel -->
    <Card class="mb-6">
      <template #title>
        <i class="pi pi-cog mr-2"></i>
        {{ activeDemoConfig.title }} Configuration
      </template>
      <template #content>
        <!-- DocumentPage Config -->
        <div v-if="activeDemo === 'document-page'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Document Type</label>
            <Select 
              v-model="documentPageConfig.docType" 
              :options="availableDocTypes" 
              option-label="label" 
              option-value="value"
              placeholder="Select type"
              class="w-full"
              @change="onDocTypeChange"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">View Mode</label>
            <Select 
              v-model="documentPageConfig.initialView" 
              :options="viewModes" 
              option-label="label" 
              option-value="value"
              class="w-full"
            />
          </div>
          <div class="flex items-end">
            <div class="flex gap-2">
              <Checkbox v-model="documentPageConfig.showHeader" binary inputId="show-header" />
              <label for="show-header" class="text-sm">Show Header</label>
            </div>
          </div>
        </div>

        <!-- DataTableCrud Config -->
        <div v-else-if="activeDemo === 'data-table'" class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Table Size</label>
            <Select 
              v-model="dataTableConfig.tableSize" 
              :options="tableSizes" 
              option-label="label" 
              option-value="value"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Selection Mode</label>
            <Select 
              v-model="dataTableConfig.selectionMode" 
              :options="selectionModes" 
              option-label="label" 
              option-value="value"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Page Size</label>
            <Select 
              v-model="dataTableConfig.pageSize" 
              :options="pageSizes" 
              option-label="label" 
              option-value="value"
              class="w-full"
            />
          </div>
          <div class="flex items-end gap-4">
            <div class="flex items-center">
              <Checkbox v-model="dataTableConfig.lazy" binary inputId="lazy" />
              <label for="lazy" class="ml-2 text-sm">Lazy Loading</label>
            </div>
          </div>
        </div>

        <!-- FormBuilder Config -->
        <div v-else-if="activeDemo === 'form-builder'" class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Form Mode</label>
            <Select 
              v-model="formBuilderConfig.mode" 
              :options="formModes" 
              option-label="label" 
              option-value="value"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Layout</label>
            <Select 
              v-model="formBuilderConfig.layout" 
              :options="layouts" 
              option-label="label" 
              option-value="value"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Size</label>
            <Select 
              v-model="formBuilderConfig.size" 
              :options="sizes" 
              option-label="label" 
              option-value="value"
              class="w-full"
            />
          </div>
          <div class="flex items-end gap-4">
            <div class="flex items-center">
              <Checkbox v-model="formBuilderConfig.loading" binary inputId="form-loading" />
              <label for="form-loading" class="ml-2 text-sm">Loading</label>
            </div>
          </div>
        </div>

        <!-- Access Control Config -->
        <div v-else-if="activeDemo === 'access-control'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Subscription Plan</label>
            <Select 
              v-model="accessConfig.selectedPlan" 
              :options="demoPlans" 
              option-label="name" 
              option-value="id"
              placeholder="Select a plan"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">User Role</label>
            <Select 
              v-model="accessConfig.selectedRole" 
              :options="demoRoles" 
              option-label="name" 
              option-value="id"
              placeholder="Select a role"
              class="w-full"
            />
          </div>
        </div>

        <!-- Schema Type Selector (common) -->
        <div v-if="activeDemo !== 'access-control'" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium">Schema Type:</label>
            <div class="flex gap-2">
              <Button 
                v-for="schema in availableDocTypes" 
                :key="schema.value"
                :label="schema.label" 
                :icon="schema.icon"
                :severity="currentDocType === schema.value ? 'primary' : 'secondary'"
                :outlined="currentDocType !== schema.value"
                size="small"
                @click="switchDocType(schema.value)"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Demo Controls -->
    <div class="flex flex-wrap gap-3 mb-6">
      <Button 
        label="Reset Demo" 
        icon="pi pi-refresh" 
        @click="resetDemo"
      />
      <Button 
        label="Add Sample Data" 
        icon="pi pi-plus" 
        severity="success" 
        outlined 
        @click="addSampleData"
      />
      <Button 
        label="Clear All Data" 
        icon="pi pi-trash" 
        severity="danger" 
        outlined 
        @click="clearAllData"
      />
      <Button 
        label="Export Demo Data" 
        icon="pi pi-download" 
        severity="info" 
        outlined 
        @click="exportDemoData"
      />
      <Button 
        label="Toggle Loading" 
        icon="pi pi-spinner" 
        severity="help" 
        outlined 
        @click="toggleLoading"
      />
    </div>

    <!-- Main Demo Content -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Main Demo Area -->
      <div class="lg:col-span-3">
        <Card>
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i :class="activeDemoConfig.icon"></i>
                <span>{{ activeDemoConfig.title }}</span>
                <Tag :value="activeDemo" severity="info" />
              </div>
              <div class="flex items-center gap-2">
                <Tag v-if="isLoading" value="Loading..." severity="warn" />
                <Tag :value="`${getCurrentDataLength()} records`" severity="secondary" />
              </div>
            </div>
          </template>
          <template #content>
            <!-- DocumentPage Demo -->
            <DocumentPage
              v-if="activeDemo === 'document-page'"
              :doc-type="currentDocType"
              :initial-view="documentPageConfig.initialView"
              :show-header="documentPageConfig.showHeader"
              :breadcrumbs="breadcrumbs"
              @item-created="onItemCreated"
              @item-updated="onItemUpdated"
              @item-deleted="onItemDeleted"
              @view-changed="onViewChanged"
              @action="onAction"
            />

            <!-- DataTableCrud Demo -->
            <DataTableCrud
              v-else-if="activeDemo === 'data-table'"
              :doc-type="currentDocType"
              :show-toolbar="true"
              :searchable="true"
              :filterable="true"
              :selection-mode="dataTableConfig.selectionMode"
              :lazy="dataTableConfig.lazy"
              :show-gridlines="true"
              :striped-rows="false"
              :table-size="dataTableConfig.tableSize"
              :default-page-size="dataTableConfig.pageSize"
              @select="onItemsSelected"
              @action="onAction"
              @create="onCreateItem"
              @edit="onEditItem"
              @delete="onDeleteItem"
              @bulk-delete="onBulkDeleteItems"
            />

            <!-- FormBuilder Demo -->
            <FormBuilder
              v-else-if="activeDemo === 'form-builder'"
              :schema="formBuilderSchema"
              v-model="formData"
              :mode="formBuilderConfig.mode"
              :layout="formBuilderConfig.layout"
              :size="formBuilderConfig.size"
              :loading="formBuilderConfig.loading"
              :show-cancel-button="true"
              :submit-label="getSubmitLabel()"
              @submit="onFormSubmit"
              @cancel="onFormCancel"
              @field-change="onFieldChange"
              @validation-change="onValidationChange"
            />

            <!-- Access Control Demo -->
            <div v-else-if="activeDemo === 'access-control'" class="access-control-demo">
              <!-- Subscription Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <template #title>
                    <i class="pi pi-crown mr-2"></i>
                    Subscription Info
                  </template>
                  <template #content>
                    <div class="space-y-3">
                      <div class="flex justify-between">
                        <span class="text-600">Plan:</span>
                        <Tag :severity="getPlanSeverity(accessConfig.selectedPlan)">
                          {{ getCurrentPlan()?.name || 'Free' }}
                        </Tag>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-600">Users Limit:</span>
                        <span>{{ getCurrentPlan()?.limits?.users || 'N/A' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-600">Storage:</span>
                        <span>{{ getCurrentPlan()?.limits?.storage || 'N/A' }}GB</span>
                      </div>
                    </div>
                  </template>
                </Card>

                <Card>
                  <template #title>
                    <i class="pi pi-users mr-2"></i>
                    Current Role
                  </template>
                  <template #content>
                    <div class="space-y-3">
                      <div class="flex justify-between">
                        <span class="text-600">Role:</span>
                        <Tag :severity="getRoleSeverity(accessConfig.selectedRole)">
                          {{ getCurrentRole()?.name || 'User' }}
                        </Tag>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-600">Data Scope:</span>
                        <Tag severity="info">{{ getCurrentRole()?.dataScope || 'own' }}</Tag>
                      </div>
                    </div>
                  </template>
                </Card>
              </div>

              <!-- Permission Matrix -->
              <Card>
                <template #title>
                  <i class="pi pi-shield mr-2"></i>
                  Document Permissions
                </template>
                <template #content>
                  <DataTable :value="permissionMatrix" class="p-datatable-sm">
                    <Column field="docType" header="Document Type" class="font-medium">
                      <template #body="{ data }">
                        <div class="flex items-center gap-2">
                          <i :class="getDocTypeIcon(data.docType)"></i>
                          {{ data.docType }}
                        </div>
                      </template>
                    </Column>
                    <Column header="Create" class="text-center" style="width: 100px">
                      <template #body="{ data }">
                        <Tag :severity="data.permissions.canCreate ? 'success' : 'danger'">
                          {{ data.permissions.canCreate ? 'Yes' : 'No' }}
                        </Tag>
                      </template>
                    </Column>
                    <Column header="Read" class="text-center" style="width: 100px">
                      <template #body="{ data }">
                        <Tag :severity="data.permissions.canRead ? 'success' : 'danger'">
                          {{ data.permissions.canRead ? 'Yes' : 'No' }}
                        </Tag>
                      </template>
                    </Column>
                    <Column header="Update" class="text-center" style="width: 100px">
                      <template #body="{ data }">
                        <Tag :severity="data.permissions.canUpdate ? 'success' : 'danger'">
                          {{ data.permissions.canUpdate ? 'Yes' : 'No' }}
                        </Tag>
                      </template>
                    </Column>
                    <Column header="Delete" class="text-center" style="width: 100px">
                      <template #body="{ data }">
                        <Tag :severity="data.permissions.canDelete ? 'success' : 'danger'">
                          {{ data.permissions.canDelete ? 'Yes' : 'No' }}
                        </Tag>
                      </template>
                    </Column>
                  </DataTable>
                </template>
              </Card>
            </div>
          </template>
        </Card>
      </div>

      <!-- Information Panel -->
      <div class="space-y-6">
        <!-- Demo Status -->
        <Card>
          <template #title>
            <i class="pi pi-info-circle mr-2"></i>
            Demo Status
          </template>
          <template #content>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Active Demo:</span>
                <Tag :value="activeDemoConfig.title" severity="info" />
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Schema:</span>
                <span class="text-sm">{{ currentSchema?.name || 'None' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Records:</span>
                <span class="text-sm">{{ getCurrentDataLength() }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Events:</span>
                <span class="text-sm">{{ eventLog.length }}</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Form Status (Form Builder only) -->
        <Card v-if="activeDemo === 'form-builder'">
          <template #title>
            <i class="pi pi-list-check mr-2"></i>
            Form Status
          </template>
          <template #content>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Validation:</span>
                <Tag :value="isFormValid ? 'Valid' : 'Invalid'" :severity="isFormValid ? 'success' : 'danger'" />
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Fields:</span>
                <span class="text-sm">{{ totalFields }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Filled:</span>
                <span class="text-sm">{{ filledFields }}/{{ totalFields }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Errors:</span>
                <span class="text-sm text-red-500">{{ Object.keys(formErrors).length }}</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Event Log -->
        <Card>
          <template #title>
            <i class="pi pi-clock mr-2"></i>
            Event Log
          </template>
          <template #content>
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded max-h-64 overflow-y-auto">
              <div 
                v-for="(event, index) in eventLog.slice(0, 20)" 
                :key="index"
                class="mb-2 text-sm border-l-2 pl-3"
                :class="getEventBorderClass(event.type)"
              >
                <div class="flex items-center justify-between">
                  <span class="font-medium">{{ event.type }}</span>
                  <span class="text-xs text-gray-500">{{ event.timestamp }}</span>
                </div>
                <div class="text-gray-600 dark:text-gray-400">{{ event.message }}</div>
              </div>
              <div v-if="eventLog.length === 0" class="text-gray-500 italic">
                No events yet. Interact with the demo to see events here.
              </div>
            </div>
            <div class="flex justify-between items-center mt-3">
              <Button 
                label="Clear Log" 
                icon="pi pi-trash" 
                size="small" 
                severity="secondary" 
                text 
                @click="clearEventLog"
              />
              <span class="text-xs text-gray-500">{{ eventLog.length }} events</span>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Instructions Panel -->
    <Card class="mt-6">
      <template #title>
        <i class="pi pi-question-circle mr-2"></i>
        Demo Instructions
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium mb-3">Current Demo: {{ activeDemoConfig.title }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ activeDemoConfig.description }}</p>
            <ul class="space-y-1 text-sm">
              <li v-for="feature in activeDemoConfig.features" :key="feature" class="flex items-center gap-2">
                <i class="pi pi-check text-green-500"></i>
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium mb-3">How to Use</h4>
            <ul class="space-y-2 text-sm">
              <li><strong>1.</strong> Switch between different demos using the tabs at the top</li>
              <li><strong>2.</strong> Configure demo settings in the configuration panel</li>
              <li><strong>3.</strong> Switch between schemas (Customer, Product, Invoice) to see different data</li>
              <li><strong>4.</strong> Use demo controls to add sample data or reset the demo</li>
              <li><strong>5.</strong> Watch the event log to see real-time interactions</li>
              <li><strong>6.</strong> Export demo data to see the JSON structure</li>
            </ul>
          </div>
        </div>
      </template>
    </Card>

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'

// PrimeVue Components
import Button from 'primevue/button'
import Card from 'primevue/card'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// Our Components
import DocumentPage from '@/components/renderers/DocumentPage.vue'
import DataTableCrud from '@/components/organisms/DataTableCrud.vue'
import FormBuilder from '@/components/organisms/FormBuilder.vue'

// Schemas
import customerSchema from '@/schemas/customer.json'
import productSchema from '@/schemas/product.json'
import invoiceSchema from '@/schemas/invoice.json'

const route = useRoute()
const toast = useToast()

// Demo state
const activeDemo = ref('document-page')
const currentDocType = ref('customer')
const isLoading = ref(false)
const renderTime = ref(0)
const eventLog = ref([])

// Form state
const formData = ref({})
const formErrors = ref({})

// Configuration objects
const documentPageConfig = reactive({
  docType: 'customer',
  initialView: 'list',
  showHeader: true
})

const dataTableConfig = reactive({
  tableSize: 'normal',
  selectionMode: 'multiple',
  pageSize: 25,
  lazy: false
})

const formBuilderConfig = reactive({
  mode: 'create',
  layout: 'default',
  size: 'medium',
  loading: false
})

const accessConfig = reactive({
  selectedPlan: 'free',
  selectedRole: 'user'
})

// Mock data storage
const mockData = ref({
  customer: [],
  product: [],
  invoice: []
})

// Demo configuration
const demoTypes = [
  { id: 'document-page', label: 'DocumentPage', icon: 'pi pi-file' },
  { id: 'data-table', label: 'DataTable', icon: 'pi pi-table' },
  { id: 'form-builder', label: 'FormBuilder', icon: 'pi pi-list-check' },
  { id: 'access-control', label: 'Access Control', icon: 'pi pi-shield' }
]

const availableDocTypes = [
  { label: 'Customer', value: 'customer', icon: 'pi pi-users' },
  { label: 'Product', value: 'product', icon: 'pi pi-box' },
  { label: 'Invoice', value: 'invoice', icon: 'pi pi-file-edit' }
]

// Configuration options
const viewModes = [
  { label: 'List View', value: 'list' },
  { label: 'Detail View', value: 'detail' },
  { label: 'Form View', value: 'form' }
]

const tableSizes = [
  { label: 'Small', value: 'small' },
  { label: 'Normal', value: 'normal' },
  { label: 'Large', value: 'large' }
]

const selectionModes = [
  { label: 'Single', value: 'single' },
  { label: 'Multiple', value: 'multiple' },
  { label: 'None', value: null }
]

const pageSizes = [
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 }
]

const formModes = [
  { label: 'Create', value: 'create' },
  { label: 'Edit', value: 'edit' },
  { label: 'View', value: 'view' }
]

const layouts = [
  { label: 'Default', value: 'default' },
  { label: 'Compact', value: 'compact' },
  { label: 'Spacious', value: 'spacious' }
]

const sizes = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' }
]

// Access control demo data
const demoPlans = [
  {
    id: 'free',
    name: 'Free',
    modules: ['users', 'dashboard'],
    limits: { users: 3, storage: 1 }
  },
  {
    id: 'pro',
    name: 'Pro',
    modules: ['users', 'dashboard', 'projects', 'tasks'],
    limits: { users: 25, storage: 10 }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    modules: ['users', 'dashboard', 'projects', 'tasks', 'admin'],
    limits: { users: 500, storage: 100 }
  }
]

const demoRoles = [
  { id: 'user', name: 'User', dataScope: 'own' },
  { id: 'manager', name: 'Manager', dataScope: 'team' },
  { id: 'admin', name: 'Admin', dataScope: 'all' }
]

// Computed properties
const schemas = computed(() => ({
  customer: customerSchema,
  product: productSchema,
  invoice: invoiceSchema
}))

const currentSchema = computed(() => schemas.value[currentDocType.value])

const activeDemoConfig = computed(() => {
  const configs = {
    'document-page': {
      title: 'DocumentPage Demo',
      icon: 'pi pi-file',
      description: 'Complete schema-driven CRUD interface with list, form, and detail views.',
      features: [
        'Automatic UI generation from schemas',
        'Real-time validation',
        'Access control integration',
        'Multiple view modes'
      ]
    },
    'data-table': {
      title: 'DataTableCrud Demo', 
      icon: 'pi pi-table',
      description: 'Advanced table component with filtering, sorting, and bulk operations.',
      features: [
        'Dynamic column configuration',
        'Advanced search and filtering',
        'Bulk operations',
        'Live configuration'
      ]
    },
    'form-builder': {
      title: 'FormBuilder Demo',
      icon: 'pi pi-list-check', 
      description: 'Dynamic form generation from JSON schemas with validation.',
      features: [
        'Schema-driven form generation',
        'Real-time validation',
        'Multiple form modes',
        'Field dependencies'
      ]
    },
    'access-control': {
      title: 'Access Control Demo',
      icon: 'pi pi-shield',
      description: 'Three-layer access control system demonstration.',
      features: [
        'Subscription-level access',
        'Role-based permissions',
        'Field-level ABAC',
        'Interactive simulation'
      ]
    }
  }
  return configs[activeDemo.value] || configs['document-page']
})

const formBuilderSchema = computed(() => {
  if (!currentSchema.value) return null
  
  return {
    name: currentSchema.value.name,
    sections: currentSchema.value.formView.sections,
    fields: currentSchema.value.formView.fields
  }
})

const breadcrumbs = computed(() => [
  { label: 'Demo', to: '/demo' },
  { label: activeDemoConfig.value.title }
])

const totalEvents = computed(() => eventLog.value.length)

// Form validation computed properties
const isFormValid = computed(() => Object.keys(formErrors.value).length === 0)
const totalFields = computed(() => currentSchema.value?.formView?.fields?.length || 0)
const filledFields = computed(() => {
  return Object.values(formData.value).filter(value => 
    value !== null && value !== undefined && value !== ''
  ).length
})

const permissionMatrix = computed(() => {
  const docTypes = ['Customer', 'Product', 'Invoice']
  return docTypes.map(docType => ({
    docType,
    permissions: {
      canCreate: accessConfig.selectedRole !== 'user',
      canRead: true,
      canUpdate: accessConfig.selectedRole !== 'user',
      canDelete: accessConfig.selectedRole === 'admin'
    }
  }))
})

// Data generators
const generateCustomerData = () => [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.corp',
    phone: '+1-555-0123',
    type: 'company',
    status: 'active',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2', 
    name: 'Jane Doe',
    email: 'jane.doe@email.com',
    phone: '+1-555-0456',
    type: 'individual',
    status: 'active',
    createdAt: new Date('2024-01-20')
  }
]

const generateProductData = () => [
  {
    id: '1',
    name: 'Wireless Headphones',
    sku: 'WH-001',
    price: 199.99,
    category: 'Electronics',
    status: 'active',
    createdAt: new Date('2024-01-15')
  }
]

const generateInvoiceData = () => [
  {
    id: '1',
    invoice_number: 'INV-2024-001',
    customer_id: '1',
    status: 'paid',
    total: 1250.00,
    due_date: new Date('2024-02-15'),
    createdAt: new Date('2024-01-15')
  }
]

// Utility functions
const getCurrentDataLength = () => {
  return mockData.value[currentDocType.value]?.length || 0
}

const getCurrentPlan = () => {
  return demoPlans.find(p => p.id === accessConfig.selectedPlan)
}

const getCurrentRole = () => {
  return demoRoles.find(r => r.id === accessConfig.selectedRole)
}

const getPlanSeverity = (planId) => {
  switch (planId) {
    case 'enterprise': return 'success'
    case 'pro': return 'info'
    default: return 'secondary'
  }
}

const getRoleSeverity = (roleId) => {
  switch (roleId) {
    case 'admin': return 'success'
    case 'manager': return 'info'
    default: return 'secondary'
  }
}

const getDocTypeIcon = (docType) => {
  const icons = {
    'Customer': 'pi pi-users',
    'Product': 'pi pi-box',
    'Invoice': 'pi pi-file-edit'
  }
  return icons[docType] || 'pi pi-file'
}

const getSubmitLabel = () => {
  switch (formBuilderConfig.mode) {
    case 'create': return 'Create'
    case 'edit': return 'Update'
    case 'view': return 'Close'
    default: return 'Save'
  }
}

// Event logging
const addEvent = (type, message, data = null) => {
  const now = new Date()
  eventLog.value.unshift({
    timestamp: now.toLocaleTimeString(),
    type,
    message,
    data
  })
  
  // Keep only last 100 events
  if (eventLog.value.length > 100) {
    eventLog.value = eventLog.value.slice(0, 100)
  }
}

const getEventBorderClass = (type) => {
  const classes = {
    'Demo': 'border-purple-400',
    'Schema': 'border-blue-400',
    'Action': 'border-green-400',
    'Form': 'border-orange-400',
    'Error': 'border-red-400'
  }
  return classes[type] || 'border-gray-400'
}

const clearEventLog = () => {
  eventLog.value = []
}

// Demo control functions
const switchDemo = (demoId) => {
  activeDemo.value = demoId
  addEvent('Demo', `Switched to ${activeDemoConfig.value.title}`)
  measureRenderTime()
}

const switchDocType = (docType) => {
  currentDocType.value = docType
  documentPageConfig.docType = docType
  addEvent('Schema', `Switched to ${docType} schema`)
  resetFormData()
}

const onDocTypeChange = () => {
  switchDocType(documentPageConfig.docType)
}

const resetDemo = () => {
  // Reset all configurations
  Object.assign(documentPageConfig, {
    docType: 'customer',
    initialView: 'list', 
    showHeader: true
  })
  Object.assign(dataTableConfig, {
    tableSize: 'normal',
    selectionMode: 'multiple',
    pageSize: 25,
    lazy: false
  })
  Object.assign(formBuilderConfig, {
    mode: 'create',
    layout: 'default',
    size: 'medium',
    loading: false
  })
  Object.assign(accessConfig, {
    selectedPlan: 'free',
    selectedRole: 'user'
  })
  
  // Reset data
  currentDocType.value = 'customer'
  resetFormData()
  eventLog.value = []
  
  addEvent('Demo', 'Demo reset to initial state')
  toast.add({
    severity: 'info',
    summary: 'Demo Reset',
    detail: 'All settings and data have been reset',
    life: 3000
  })
}

const addSampleData = () => {
  let newData = []
  switch (currentDocType.value) {
    case 'customer':
      newData = generateCustomerData()
      break
    case 'product':
      newData = generateProductData()
      break
    case 'invoice':
      newData = generateInvoiceData()
      break
  }
  
  mockData.value[currentDocType.value] = [
    ...mockData.value[currentDocType.value],
    ...newData
  ]
  
  addEvent('Action', `Added ${newData.length} sample ${currentDocType.value} records`)
  toast.add({
    severity: 'success',
    summary: 'Sample Data Added',
    detail: `${newData.length} records added`,
    life: 3000
  })
}

const clearAllData = () => {
  const count = mockData.value[currentDocType.value]?.length || 0
  mockData.value[currentDocType.value] = []
  addEvent('Action', `Cleared ${count} records`)
  toast.add({
    severity: 'info',
    summary: 'Data Cleared',
    detail: `${count} records removed`,
    life: 3000
  })
}

const exportDemoData = () => {
  const exportData = {
    activeDemo: activeDemo.value,
    currentDocType: currentDocType.value,
    configurations: {
      documentPage: documentPageConfig,
      dataTable: dataTableConfig,
      formBuilder: formBuilderConfig,
      access: accessConfig
    },
    data: mockData.value,
    eventLog: eventLog.value
  }
  
  const dataStr = JSON.stringify(exportData, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'dhool-demo-export.json'
  link.click()
  
  addEvent('Action', 'Demo data exported')
  toast.add({
    severity: 'success',
    summary: 'Data Exported',
    detail: 'Demo data downloaded as JSON',
    life: 3000
  })
}

const toggleLoading = () => {
  isLoading.value = !isLoading.value
  addEvent('Demo', `Loading state: ${isLoading.value ? 'ON' : 'OFF'}`)
  
  if (isLoading.value) {
    setTimeout(() => {
      isLoading.value = false
      addEvent('Demo', 'Loading completed')
    }, 2000)
  }
}

const resetFormData = () => {
  formData.value = {}
  formErrors.value = {}
}

// Event handlers from components
const onItemCreated = (item) => {
  addEvent('Action', `Item created: ${item.name || item.id}`)
  toast.add({
    severity: 'success',
    summary: 'Item Created',
    detail: 'Item created successfully',
    life: 3000
  })
}

const onItemUpdated = (item) => {
  addEvent('Action', `Item updated: ${item.name || item.id}`)
  toast.add({
    severity: 'success',
    summary: 'Item Updated',
    detail: 'Item updated successfully', 
    life: 3000
  })
}

const onItemDeleted = (item) => {
  addEvent('Action', `Item deleted: ${item.name || item.id}`)
  toast.add({
    severity: 'info',
    summary: 'Item Deleted',
    detail: 'Item deleted successfully',
    life: 3000
  })
}

const onViewChanged = (view) => {
  addEvent('Action', `View changed to: ${view}`)
}

const onAction = (action, data) => {
  addEvent('Action', `Action performed: ${action.id || action}`)
}

const onItemsSelected = (items) => {
  addEvent('Action', `Selected ${items.length} items`)
}

const onCreateItem = () => {
  addEvent('Action', 'Create item requested')
}

const onEditItem = (item) => {
  addEvent('Action', `Edit item: ${item.name || item.id}`)
}

const onDeleteItem = (item) => {
  addEvent('Action', `Delete item: ${item.name || item.id}`)
}

const onBulkDeleteItems = (items) => {
  addEvent('Action', `Bulk delete: ${items.length} items`)
}

const onFormSubmit = (data) => {
  addEvent('Form', 'Form submitted', data)
  toast.add({
    severity: 'success',
    summary: 'Form Submitted',
    detail: 'Form data submitted successfully',
    life: 3000
  })
}

const onFormCancel = () => {
  addEvent('Form', 'Form cancelled')
}

const onFieldChange = (fieldName, value) => {
  addEvent('Form', `Field changed: ${fieldName}`)
}

const onValidationChange = (isValid, errors) => {
  formErrors.value = errors
  addEvent('Form', `Validation: ${isValid ? 'valid' : 'invalid'}`)
}

// Performance monitoring
const measureRenderTime = () => {
  const start = performance.now()
  setTimeout(() => {
    renderTime.value = Math.round(performance.now() - start)
  }, 0)
}

// Initialize
onMounted(() => {
  // Check for demo type in URL parameters
  const demoParam = route.query.demo as string
  if (demoParam && demoTypes.some(d => d.id === demoParam)) {
    activeDemo.value = demoParam
  }
  
  addEvent('Demo', 'Comprehensive demo initialized')
  addSampleData()
  measureRenderTime()
})

// Watch for changes
watch([activeDemo, currentDocType], measureRenderTime)
</script>

<style scoped>
.comprehensive-demo {
  @apply max-w-7xl mx-auto p-6;
}

.demo-header {
  @apply bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 rounded-xl p-6;
}

.access-control-demo {
  @apply space-y-6;
}

/* Ensure proper grid layouts */
.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Custom styling */
:deep(.p-card) {
  @apply shadow-sm border border-gray-200 dark:border-gray-700;
}

:deep(.p-tabview-nav) {
  @apply bg-gray-50 dark:bg-gray-800;
}
</style>