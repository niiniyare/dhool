<template>
  <div class="document-page">
    <!-- Page Header -->
    <div v-if="showHeader" class="document-page__header">
      <div class="document-page__title-section">
        <div class="flex items-center gap-3">
          <i v-if="schema?.icon" :class="schema.icon" class="text-2xl text-gray-600 dark:text-gray-400" />
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ pageTitle }}
            </h1>
            <p v-if="schema?.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ schema.description }}
            </p>
          </div>
        </div>
        
        <!-- Page Actions -->
        <div class="document-page__actions">
          <slot name="header-actions" />
        </div>
      </div>
      
      <!-- Breadcrumb -->
      <nav v-if="breadcrumbs.length > 0" class="document-page__breadcrumb">
        <ol class="flex items-center space-x-2 text-sm">
          <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center">
            <router-link
              v-if="crumb.to && index < breadcrumbs.length - 1"
              :to="crumb.to"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {{ crumb.label }}
            </router-link>
            <span v-else class="text-gray-900 dark:text-white font-medium">
              {{ crumb.label }}
            </span>
            <i v-if="index < breadcrumbs.length - 1" class="pi pi-angle-right text-gray-400 mx-2" />
          </li>
        </ol>
      </nav>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !schema" class="document-page__loading">
      <div class="flex flex-col items-center justify-center py-12">
        <ProgressSpinner />
        <p class="text-gray-600 dark:text-gray-400 mt-3">Loading document schema...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="document-page__error">
      <Message severity="error" :closable="false">
        <template #icon>
          <i class="pi pi-exclamation-triangle" />
        </template>
        <div>
          <h3 class="font-medium">Failed to load document schema</h3>
          <p class="text-sm mt-1">{{ error.message }}</p>
          <Button 
            label="Retry" 
            size="small" 
            severity="secondary" 
            @click="reloadSchema" 
            class="mt-2"
          />
        </div>
      </Message>
    </div>

    <!-- No Access State -->
    <div v-else-if="!isModuleAccessible && schema" class="document-page__no-access">
      <Message severity="warn" :closable="false">
        <template #icon>
          <i class="pi pi-lock" />
        </template>
        <div>
          <h3 class="font-medium">Access Restricted</h3>
          <p class="text-sm mt-1">
            You don't have access to the {{ schema.module }} module required for this document type.
          </p>
        </div>
      </Message>
    </div>

    <!-- Main Content -->
    <div v-else-if="schema" class="document-page__content">
      <!-- List View -->
      <div v-if="currentView === 'list'" class="document-page__list">
        <DataTableCrud
          :docType="docType"
          :columns="displayColumns"
          :toolbarActions="displayToolbarActions"
          :rowActions="displayRowActions"
          :showToolbar="showToolbar"
          :searchable="searchable"
          :filterable="filterable"
          :selectionMode="selectionMode"
          :lazy="lazy"
          :showGridlines="showGridlines"
          :stripedRows="stripedRows"
          :tableSize="tableSize"
          :pageSizeOptions="pageSizeOptions"
          :defaultPageSize="defaultPageSize"
          :emptyIcon="emptyIcon"
          :emptyTitle="emptyTitle"
          :emptyDescription="emptyDescription"
          :emptyAction="emptyAction"
          @select="onItemsSelected"
          @action="onAction"
          @create="onCreateItem"
          @edit="onEditItem"
          @delete="onDeleteItem"
          @bulkDelete="onBulkDeleteItems"
        />
      </div>

      <!-- Form View (Create/Edit) -->
      <Drawer
        v-model:visible="showFormDrawer"
        :header="formTitle"
        position="right"
        class="document-form-drawer"
        :style="{ width: formWidth }"
        :dismissableMask="!formHasChanges"
        :closeOnEscape="!formHasChanges"
        @hide="onFormDrawerHide"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <i v-if="schema.icon" :class="schema.icon" class="text-lg" />
            <div>
              <h3 class="font-medium">{{ formTitle }}</h3>
              <p v-if="formSubtitle" class="text-sm text-gray-600 dark:text-gray-400">
                {{ formSubtitle }}
              </p>
            </div>
          </div>
        </template>

        <div class="document-form">
          <!-- Form Content Slot -->
          <slot 
            name="form-content"
            :schema="schema"
            :fields="accessibleFields"
            :sections="visibleSections"
            :formData="formData"
            :formMode="formMode"
            :formErrors="formErrors"
            :isSubmitting="isSubmitting"
            :onFieldChange="onFieldChange"
            :onSubmit="onFormSubmit"
            :onCancel="onFormCancel"
          >
            <!-- Default Form Implementation using FormBuilder -->
            <FormBuilder
              :schema="formBuilderSchema"
              v-model="formData"
              :mode="formMode"
              :loading="isSubmitting"
              :show-cancel-button="true"
              :submit-label="formMode === 'create' ? 'Create' : 'Update'"
              @submit="onFormSubmit"
              @cancel="onFormCancel"
              @field-change="onFieldChange"
              @validation-change="onValidationChange"
            >
              <!-- Custom form actions for view mode -->
              <template v-if="formMode === 'view'" #form-actions>
                <div class="form-actions flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-2">
                    <Button 
                      v-if="canPerform('update')" 
                      label="Edit" 
                      icon="pi pi-pencil" 
                      severity="secondary" 
                      @click="switchToEditMode"
                    />
                  </div>

                  <div class="flex items-center gap-2">
                    <Button 
                      label="Close" 
                      severity="secondary" 
                      outlined 
                      @click="onFormCancel"
                    />
                  </div>
                </div>
              </template>
            </FormBuilder>
          </slot>
        </div>
      </Drawer>

      <!-- Detail View (if separate from form) -->
      <div v-if="currentView === 'detail'" class="document-page__detail">
        <slot 
          name="detail-content"
          :item="selectedItem"
          :schema="schema"
          :fields="accessibleFields"
          :sections="visibleSections"
        >
          <!-- Default Detail View -->
          <div class="document-detail">
            <div class="document-detail__header flex items-center justify-between mb-6">
              <div>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ getDetailTitle() }}
                </h2>
              </div>
              <div class="flex items-center gap-2">
                <Button label="Edit" icon="pi pi-pencil" @click="onEditItem(selectedItem)" />
                <Button label="Back to List" icon="pi pi-arrow-left" severity="secondary" @click="backToList" />
              </div>
            </div>
            
            <!-- Detail sections would go here -->
            <div class="space-y-6">
              <!-- Implementation for detail view sections -->
            </div>
          </div>
        </slot>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmDialog />

    <!-- Toast Messages -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'

// PrimeVue Components
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

// Composables
import { useCrud } from '@/composables/useCrud'
import { useSchema } from '@/composables/useSchema'
import { useAccess } from '@/composables/useAccess'

// Components
import DataTableCrud from '@/components/organisms/DataTableCrud.vue'
import FieldRenderer from '@/components/renderers/FieldRenderer.vue'
import FormBuilder from '@/components/organisms/FormBuilder.vue'

// Types
import type { DocumentSchema, FieldSchema, ActionSchema } from '@/types/schema'

interface Props {
  docType: string
  initialView?: 'list' | 'detail' | 'form'
  itemId?: string
  showHeader?: boolean
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
  formWidth?: string
  emptyIcon?: string
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ActionSchema
  breadcrumbs?: Array<{ label: string; to?: string }>
  customColumns?: any[]
  customToolbarActions?: ActionSchema[]
  customRowActions?: ActionSchema[]
}

const props = withDefaults(defineProps<Props>(), {
  initialView: 'list',
  itemId: undefined,
  showHeader: true,
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
  formWidth: '800px',
  emptyIcon: 'pi pi-inbox',
  emptyTitle: 'No data found',
  emptyDescription: 'There are no records to display.',
  emptyAction: undefined,
  breadcrumbs: () => [],
  customColumns: () => [],
  customToolbarActions: () => [],
  customRowActions: () => []
})

const emit = defineEmits<{
  itemSelected: [item: any]
  itemCreated: [item: any]
  itemUpdated: [item: any]
  itemDeleted: [item: any]
  bulkDeleted: [items: any[]]
  viewChanged: [view: string]
  action: [action: string, data?: any]
}>()

const route = useRoute()
const router = useRouter()
const confirm = useConfirm()

// Composables
const {
  schema,
  loading: schemaLoading,
  error,
  fields: accessibleFields,
  columns: accessibleColumns,
  toolbarActions: schemaToolbarActions,
  rowActions: schemaRowActions,
  visibleSections,
  isModuleAccessible,
  getField,
  isFieldEditable,
  generateDefaults,
  reload: reloadSchema
} = useSchema(computed(() => props.docType))

const {
  items,
  loading: crudLoading,
  selectedItem,
  create,
  update,
  remove,
  bulkDelete,
  fetchOne,
  canPerform
} = useCrud(computed(() => props.docType))

// Local State
const currentView = ref(props.initialView)
const showFormDrawer = ref(false)
const formMode = ref<'create' | 'edit' | 'view'>('create')
const formData = ref<Record<string, any>>({})
const formErrors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const formHasChanges = ref(false)
const selectedItems = ref<any[]>([])

// Computed Properties
const isLoading = computed(() => schemaLoading.value || crudLoading.value)

const pageTitle = computed(() => {
  switch (currentView.value) {
    case 'list':
      return (schema.value as any)?.labelPlural || schema.value?.label || 'Documents'
    case 'detail':
      return selectedItem.value ? `${schema.value?.label} - ${getItemDisplayName(selectedItem.value)}` : schema.value?.label || 'Document'
    case 'form':
      return formMode.value === 'create' 
        ? `New ${schema.value?.label || 'Document'}`
        : `Edit ${schema.value?.label || 'Document'}`
    default:
      return (schema.value as any)?.labelPlural || 'Documents'
  }
})

const formTitle = computed(() => {
  switch (formMode.value) {
    case 'create':
      return `New ${schema.value?.label || 'Document'}`
    case 'edit':
      return `Edit ${schema.value?.label || 'Document'}`
    case 'view':
      return schema.value?.label || 'Document'
    default:
      return 'Document'
  }
})

const formSubtitle = computed(() => {
  if (formMode.value === 'view' && selectedItem.value) {
    return getItemDisplayName(selectedItem.value)
  }
  return undefined
})

const displayColumns = computed(() => {
  return props.customColumns.length > 0 ? props.customColumns : accessibleColumns.value
})

const displayToolbarActions = computed(() => {
  return props.customToolbarActions.length > 0 ? props.customToolbarActions : schemaToolbarActions.value
})

const displayRowActions = computed(() => {
  return props.customRowActions.length > 0 ? props.customRowActions : schemaRowActions.value
})

const isFormValid = computed(() => {
  return Object.keys(formErrors.value).length === 0
})

const formBuilderSchema = computed(() => {
  if (!schema.value) return null
  
  return {
    name: schema.value.name,
    sections: visibleSections.value,
    fields: Object.values(accessibleFields.value),
    access: schema.value.access
  } as any
})

// Methods
const getItemDisplayName = (item: any): string => {
  if (!item) return ''
  
  // Try common display fields
  const displayFields = ['name', 'title', 'label', 'id']
  for (const field of displayFields) {
    if (item[field]) return item[field]
  }
  
  return `${schema.value?.label || 'Item'} ${item.id || ''}`
}

const getDetailTitle = (): string => {
  if (selectedItem.value) {
    return getItemDisplayName(selectedItem.value)
  }
  return schema.value?.label || 'Document'
}


// View Management
const setView = (view: 'list' | 'detail' | 'form') => {
  currentView.value = view
  emit('viewChanged', view)
}

const backToList = () => {
  selectedItem.value = null
  setView('list')
  
  // Update URL if needed
  if (route.params.id) {
    router.push({ name: route.name!, params: { ...route.params, id: undefined } })
  }
}

// Form Management
const openCreateForm = () => {
  formMode.value = 'create'
  formData.value = generateDefaults()
  formErrors.value = {}
  formHasChanges.value = false
  showFormDrawer.value = true
}

const openEditForm = (item: any) => {
  formMode.value = 'edit'
  formData.value = { ...item }
  formErrors.value = {}
  formHasChanges.value = false
  showFormDrawer.value = true
}

const openViewForm = (item: any) => {
  formMode.value = 'view'
  formData.value = { ...item }
  formErrors.value = {}
  formHasChanges.value = false
  showFormDrawer.value = true
}

const switchToEditMode = () => {
  if (formMode.value === 'view') {
    formMode.value = 'edit'
    formHasChanges.value = false
  }
}

const validateForm = (): boolean => {
  // FormBuilder handles validation now
  return Object.keys(formErrors.value).length === 0
}

// Event Handlers
const onItemsSelected = (items: any[]) => {
  selectedItems.value = items
}

const onAction = (action: string, data?: any) => {
  emit('action', action, data)
}

const onCreateItem = () => {
  openCreateForm()
}

const onEditItem = (item: any) => {
  openEditForm(item)
}

const onDeleteItem = async (item: any) => {
  confirm.require({
    message: `Are you sure you want to delete this ${schema.value?.label?.toLowerCase() || 'item'}?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: async () => {
      try {
        await remove(item.id)
        emit('itemDeleted', item)
      } catch (error) {
        console.error('Failed to delete item:', error)
      }
    }
  })
}

const onBulkDeleteItems = (items: any[]) => {
  confirm.require({
    message: `Are you sure you want to delete ${items.length} ${(schema.value as any)?.labelPlural?.toLowerCase() || 'items'}?`,
    header: 'Confirm Bulk Deletion',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete All',
      severity: 'danger'
    },
    accept: async () => {
      try {
        const ids = items.map(item => item.id)
        await bulkDelete(ids)
        emit('bulkDeleted', items)
      } catch (error) {
        console.error('Failed to bulk delete items:', error)
      }
    }
  })
}

const onFieldChange = (fieldName: string, value: any) => {
  formData.value[fieldName] = value
  formHasChanges.value = true
  
  // Clear field error if it exists
  if (formErrors.value[fieldName]) {
    delete formErrors.value[fieldName]
  }
}

const onValidationChange = (isValid: boolean, errors: Record<string, string>) => {
  formErrors.value = errors
}

const onFormSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    let result
    if (formMode.value === 'create') {
      result = await create(formData.value)
      if (result) {
        emit('itemCreated', result)
        showFormDrawer.value = false
      }
    } else if (formMode.value === 'edit') {
      result = await update(formData.value.id, formData.value)
      if (result) {
        emit('itemUpdated', result)
        showFormDrawer.value = false
      }
    }
  } catch (error) {
    console.error('Form submission failed:', error)
  } finally {
    isSubmitting.value = false
  }
}

const onFormCancel = () => {
  if (formHasChanges.value) {
    confirm.require({
      message: 'You have unsaved changes. Are you sure you want to close?',
      header: 'Unsaved Changes',
      icon: 'pi pi-exclamation-triangle',
      rejectProps: {
        label: 'Continue Editing',
        severity: 'secondary',
        outlined: true
      },
      acceptProps: {
        label: 'Discard Changes',
        severity: 'danger'
      },
      accept: () => {
        showFormDrawer.value = false
        formHasChanges.value = false
      }
    })
  } else {
    showFormDrawer.value = false
  }
}

const onFormDrawerHide = () => {
  if (formHasChanges.value) {
    // Prevent closing if there are unsaved changes
    nextTick(() => {
      showFormDrawer.value = true
    })
  } else {
    formHasChanges.value = false
  }
}

// Initialize
onMounted(async () => {
  // Load item if ID provided
  if (props.itemId && props.initialView === 'detail') {
    try {
      const item = await fetchOne(props.itemId)
      if (item) {
        selectedItem.value = item
        emit('itemSelected', item)
      }
    } catch (error) {
      console.error('Failed to load item:', error)
    }
  }
})

// Watch for route changes
watch(() => route.params.id, async (newId) => {
  if (newId && typeof newId === 'string') {
    try {
      const item = await fetchOne(newId)
      if (item) {
        selectedItem.value = item
        setView('detail')
        emit('itemSelected', item)
      }
    } catch (error) {
      console.error('Failed to load item:', error)
    }
  } else if (!newId) {
    selectedItem.value = null
    setView('list')
  }
})
</script>

<style scoped>
.document-page {
  @apply h-full flex flex-col;
}

.document-page__header {
  @apply border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4;
}

.document-page__title-section {
  @apply flex items-center justify-between mb-3;
}

.document-page__actions {
  @apply flex items-center gap-2;
}

.document-page__breadcrumb {
  @apply mt-2;
}

.document-page__loading,
.document-page__error,
.document-page__no-access {
  @apply p-6;
}

.document-page__content {
  @apply flex-1 flex flex-col;
}

.document-page__list {
  @apply flex-1;
}

.document-page__detail {
  @apply p-6;
}

.document-form {
  @apply p-6;
}


.form-actions {
  @apply sticky bottom-0 bg-white dark:bg-gray-800;
}

/* Custom drawer styles */
.document-form-drawer {
  --p-drawer-header-padding: 1.5rem;
}

.document-form-drawer :deep(.p-drawer-content) {
  @apply p-0;
}

.document-form-drawer :deep(.p-drawer-header) {
  @apply border-b border-gray-200 dark:border-gray-700;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .document-page__header {
    @apply px-4 py-3;
  }
  
  .document-page__title-section {
    @apply flex-col items-start gap-3;
  }
  
  .document-form {
    @apply p-4;
  }
  
  .form-actions {
    @apply flex-col gap-3;
  }
}
</style>