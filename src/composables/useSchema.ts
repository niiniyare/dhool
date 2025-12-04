import { ref, computed, toValue, type MaybeRef, type ComputedRef } from 'vue'
import { schemaService } from '@/services/schema'
import { useAccess } from '@/composables/useAccess'
import type { 
  DocumentSchema, 
  FieldSchema, 
  ColumnSchema, 
  ActionSchema 
} from '@/types/schema'

/**
 * Composable for loading and managing document schemas with access control
 * Provides caching, field filtering, and form defaults generation
 */
export function useSchema(docType: MaybeRef<string>) {
  const schema = ref<DocumentSchema | null>(null)
  const loading = ref(true)
  const error = ref<Error | null>(null)
  const { canAccessField, filterActions, hasModule } = useAccess()

  // Load schema with caching
  const loadSchema = async () => {
    const docTypeValue = toValue(docType)
    if (!docTypeValue) return

    loading.value = true
    error.value = null

    try {
      schema.value = await schemaService.loadSchema(docTypeValue)
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      schema.value = null
    } finally {
      loading.value = false
    }
  }

  // Filter fields based on access control
  const filterFields = (fields: FieldSchema[] | undefined) => {
    if (!fields) return {}
    
    const docTypeValue = toValue(docType)
    if (!docTypeValue) return {}

    const filteredFields: Record<string, FieldSchema> = {}
    
    for (const field of fields) {
      const fieldAccess = canAccessField.value(docTypeValue, field.name)
      if (fieldAccess.read) {
        filteredFields[field.name] = {
          ...field,
          // Add access metadata for UI components
          _access: fieldAccess
        } as FieldSchema & { _access: any }
      }
    }

    return filteredFields
  }

  // Filter columns based on access control
  const filterColumns = (columns: ColumnSchema[] | undefined) => {
    if (!columns) return []
    
    const docTypeValue = toValue(docType)
    if (!docTypeValue) return columns

    return columns.filter(column => {
      const fieldAccess = canAccessField.value(docTypeValue, column.field)
      return fieldAccess.read
    })
  }

  // Filter actions based on access control
  const filterSchemaActions = (actions: ActionSchema[] | undefined) => {
    if (!actions) return []
    
    const docTypeValue = toValue(docType)
    if (!docTypeValue) return actions

    return actions.filter(action => {
      // Check if user has required permissions for this action
      if (action.permissions) {
        const allowedActions = filterActions.value(docTypeValue, action.permissions)
        if (allowedActions.length !== action.permissions.length) {
          return false
        }
      }
      
      // TODO: Implement ABAC policy checking for action.access
      return true
    })
  }

  // Generate form defaults from schema
  const generateDefaults = (): Record<string, unknown> => {
    if (!schema.value) return {}
    return schemaService.generateDefaults(schema.value)
  }

  // Check if module is accessible
  const isModuleAccessible = computed(() => {
    if (!schema.value) return false
    return hasModule.value(schema.value.module)
  })

  // Computed properties for reactive access-filtered data
  const fields = computed(() => filterFields(schema.value?.formView.fields))
  
  const columns = computed(() => filterColumns(schema.value?.listView.columns))
  
  const toolbarActions = computed(() => filterSchemaActions(schema.value?.listView.toolbarActions))
  
  const rowActions = computed(() => filterSchemaActions(schema.value?.listView.rowActions))

  // Get field by name with access checking
  const getField = (fieldName: string): FieldSchema | null => {
    const filteredFields = fields.value
    return filteredFields[fieldName] || null
  }

  // Check if a specific field is editable
  const isFieldEditable = (fieldName: string): boolean => {
    const docTypeValue = toValue(docType)
    if (!docTypeValue) return false
    
    const fieldAccess = canAccessField.value(docTypeValue, fieldName)
    return fieldAccess.write
  }

  // Get fields for a specific section
  const getSectionFields = (sectionId: string): Record<string, FieldSchema> => {
    const section = schema.value?.formView.sections.find(s => s.id === sectionId)
    if (!section) return {}

    const sectionFields: Record<string, FieldSchema> = {}
    const allFields = fields.value

    for (const fieldName of section.fields) {
      if (allFields[fieldName]) {
        sectionFields[fieldName] = allFields[fieldName]
      }
    }

    return sectionFields
  }

  // Get visible sections (sections that have at least one accessible field)
  const visibleSections = computed(() => {
    if (!schema.value) return []
    
    return schema.value.formView.sections.filter(section => {
      const sectionFields = getSectionFields(section.id)
      return Object.keys(sectionFields).length > 0
    })
  })

  // Validate field value against schema
  const validateField = (fieldName: string, value: unknown): string | null => {
    const field = getField(fieldName)
    if (!field) return 'Field not found'

    // Required field validation
    if (field.required && (value === null || value === undefined || value === '')) {
      return `${field.label} is required`
    }

    // TODO: Implement other validation types (min, max, pattern, etc.)
    return null
  }

  // Initialize by loading schema
  loadSchema()

  return {
    // Core reactive state
    schema: computed(() => schema.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    
    // Access-filtered data
    fields,
    columns,
    toolbarActions,
    rowActions,
    visibleSections,
    
    // Utility methods
    getField,
    getSectionFields,
    isFieldEditable,
    validateField,
    generateDefaults,
    isModuleAccessible,
    
    // Schema management
    reload: loadSchema,
    refresh: async () => {
      const docTypeValue = toValue(docType)
      if (docTypeValue) {
        schema.value = await schemaService.refreshSchema(docTypeValue)
      }
    }
  }
}

export type UseSchemaReturn = ReturnType<typeof useSchema>