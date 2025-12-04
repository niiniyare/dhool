export interface ValidationError {
  path: string
  message: string
  severity: 'error' | 'warning'
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

export interface SchemaField {
  name: string
  label: string
  type: string
  required?: boolean
  validation?: Record<string, any>
  options?: Array<{ label: string; value: string }>
  dependencies?: {
    field: string
    value: string
  }
  access?: {
    subscription?: string[]
  }
}

export interface SchemaAction {
  id: string
  label: string
  icon?: string
  action: string
  variant?: string
  severity?: string
  confirmation?: boolean
}

export interface Schema {
  name: string
  label: string
  labelPlural?: string
  icon?: string
  module: string
  api: {
    baseEndpoint: string
    endpoints?: Record<string, string>
    pagination?: {
      pageSize?: number
      pageSizeOptions?: number[]
    }
  }
  listView?: {
    columns: any[]
    filters?: any[]
    searchFields?: string[]
    toolbarActions?: SchemaAction[]
    rowActions?: SchemaAction[]
    pagination?: {
      defaultPageSize?: number
      pageSizeOptions?: number[]
    }
  }
  formView?: {
    sections: Array<{
      title: string
      description?: string
      columns?: number
      fields: string[]
    }>
    fields: SchemaField[]
  }
  access?: {
    requiredModule?: string
    permissions?: Record<string, string[]>
    fieldAccess?: Record<string, any>
    dataScope?: Record<string, string>
    conditions?: Record<string, any>
  }
}

const VALID_FIELD_TYPES = [
  'text', 'email', 'phone', 'password', 'number', 'date', 'datetime',
  'time', 'select', 'multiselect', 'checkbox', 'radio', 'textarea',
  'file', 'image', 'link', 'badge', 'currency', 'url'
]

const VALID_ACTION_TYPES = [
  'create', 'view', 'edit', 'delete', 'export', 'import',
  'duplicate', 'archive', 'restore', 'approve', 'reject'
]

const REQUIRED_ROOT_FIELDS = ['name', 'label', 'module', 'api']

export class SchemaValidator {
  validateSchema(schema: unknown): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationError[] = []

    if (!schema || typeof schema !== 'object') {
      errors.push({
        path: 'root',
        message: 'Schema must be a valid object',
        severity: 'error'
      })
      return { isValid: false, errors, warnings }
    }

    const schemaObj = schema as Record<string, any>

    this.validateRootStructure(schemaObj, errors)
    this.validateApi(schemaObj.api, errors)
    
    if (schemaObj.listView) {
      this.validateListView(schemaObj.listView, errors, warnings)
    }
    
    if (schemaObj.formView) {
      this.validateFormView(schemaObj.formView, errors, warnings)
    }
    
    if (schemaObj.access) {
      this.validateAccess(schemaObj.access, errors, warnings)
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  private validateRootStructure(schema: Record<string, any>, errors: ValidationError[]): void {
    for (const field of REQUIRED_ROOT_FIELDS) {
      if (!schema[field]) {
        errors.push({
          path: field,
          message: `Required field '${field}' is missing`,
          severity: 'error'
        })
      }
    }

    if (schema.name && typeof schema.name !== 'string') {
      errors.push({
        path: 'name',
        message: 'Schema name must be a string',
        severity: 'error'
      })
    }

    if (schema.name && !/^[a-z][a-z0-9_]*$/.test(schema.name)) {
      errors.push({
        path: 'name',
        message: 'Schema name must be lowercase alphanumeric with underscores',
        severity: 'error'
      })
    }

    if (schema.label && typeof schema.label !== 'string') {
      errors.push({
        path: 'label',
        message: 'Schema label must be a string',
        severity: 'error'
      })
    }

    if (schema.module && typeof schema.module !== 'string') {
      errors.push({
        path: 'module',
        message: 'Schema module must be a string',
        severity: 'error'
      })
    }
  }

  private validateApi(api: any, errors: ValidationError[]): void {
    if (!api) {
      errors.push({
        path: 'api',
        message: 'API configuration is required',
        severity: 'error'
      })
      return
    }

    if (!api.baseEndpoint) {
      errors.push({
        path: 'api.baseEndpoint',
        message: 'API baseEndpoint is required',
        severity: 'error'
      })
    }

    if (api.baseEndpoint && !api.baseEndpoint.startsWith('/api/')) {
      errors.push({
        path: 'api.baseEndpoint',
        message: 'API baseEndpoint should start with /api/',
        severity: 'error'
      })
    }

    if (api.endpoints && typeof api.endpoints !== 'object') {
      errors.push({
        path: 'api.endpoints',
        message: 'API endpoints must be an object',
        severity: 'error'
      })
    }
  }

  private validateListView(listView: any, errors: ValidationError[], warnings: ValidationError[]): void {
    if (!listView.columns || !Array.isArray(listView.columns)) {
      errors.push({
        path: 'listView.columns',
        message: 'List view columns must be an array',
        severity: 'error'
      })
      return
    }

    listView.columns.forEach((column: any, index: number) => {
      if (!column.field) {
        errors.push({
          path: `listView.columns[${index}].field`,
          message: 'Column field is required',
          severity: 'error'
        })
      }

      if (!column.header) {
        errors.push({
          path: `listView.columns[${index}].header`,
          message: 'Column header is required',
          severity: 'error'
        })
      }

      if (!column.type) {
        warnings.push({
          path: `listView.columns[${index}].type`,
          message: 'Column type is recommended',
          severity: 'warning'
        })
      }
    })

    if (listView.toolbarActions) {
      this.validateActions(listView.toolbarActions, 'listView.toolbarActions', errors)
    }

    if (listView.rowActions) {
      this.validateActions(listView.rowActions, 'listView.rowActions', errors)
    }
  }

  private validateFormView(formView: any, errors: ValidationError[], warnings: ValidationError[]): void {
    if (!formView.fields || !Array.isArray(formView.fields)) {
      errors.push({
        path: 'formView.fields',
        message: 'Form view fields must be an array',
        severity: 'error'
      })
      return
    }

    const fieldNames = new Set<string>()

    formView.fields.forEach((field: any, index: number) => {
      this.validateField(field, `formView.fields[${index}]`, errors, warnings)
      
      if (field.name) {
        if (fieldNames.has(field.name)) {
          errors.push({
            path: `formView.fields[${index}].name`,
            message: `Duplicate field name '${field.name}'`,
            severity: 'error'
          })
        }
        fieldNames.add(field.name)
      }
    })

    if (formView.sections && Array.isArray(formView.sections)) {
      this.validateSections(formView.sections, Array.from(fieldNames), errors, warnings)
    }
  }

  private validateField(field: any, path: string, errors: ValidationError[], warnings: ValidationError[]): void {
    if (!field.name) {
      errors.push({
        path: `${path}.name`,
        message: 'Field name is required',
        severity: 'error'
      })
    }

    if (!field.label) {
      errors.push({
        path: `${path}.label`,
        message: 'Field label is required',
        severity: 'error'
      })
    }

    if (!field.type) {
      errors.push({
        path: `${path}.type`,
        message: 'Field type is required',
        severity: 'error'
      })
    } else if (!VALID_FIELD_TYPES.includes(field.type)) {
      errors.push({
        path: `${path}.type`,
        message: `Invalid field type '${field.type}'. Valid types: ${VALID_FIELD_TYPES.join(', ')}`,
        severity: 'error'
      })
    }

    if (field.name && !/^[a-z][a-z0-9_]*$/.test(field.name)) {
      errors.push({
        path: `${path}.name`,
        message: 'Field name must be lowercase alphanumeric with underscores',
        severity: 'error'
      })
    }

    if ((field.type === 'select' || field.type === 'multiselect') && !field.options) {
      errors.push({
        path: `${path}.options`,
        message: `Field type '${field.type}' requires options array`,
        severity: 'error'
      })
    }

    if (field.options && !Array.isArray(field.options)) {
      errors.push({
        path: `${path}.options`,
        message: 'Field options must be an array',
        severity: 'error'
      })
    }

    if (field.validation && typeof field.validation !== 'object') {
      errors.push({
        path: `${path}.validation`,
        message: 'Field validation must be an object',
        severity: 'error'
      })
    }

    if (field.dependencies) {
      this.validateFieldDependencies(field.dependencies, `${path}.dependencies`, errors)
    }
  }

  private validateFieldDependencies(dependencies: any, path: string, errors: ValidationError[]): void {
    if (!dependencies.field) {
      errors.push({
        path: `${path}.field`,
        message: 'Dependencies must specify a field',
        severity: 'error'
      })
    }

    if (dependencies.value === undefined) {
      errors.push({
        path: `${path}.value`,
        message: 'Dependencies must specify a value',
        severity: 'error'
      })
    }
  }

  private validateSections(sections: any[], fieldNames: string[], errors: ValidationError[], warnings: ValidationError[]): void {
    const usedFields = new Set<string>()

    sections.forEach((section, index) => {
      if (!section.title) {
        errors.push({
          path: `formView.sections[${index}].title`,
          message: 'Section title is required',
          severity: 'error'
        })
      }

      if (!section.fields || !Array.isArray(section.fields)) {
        errors.push({
          path: `formView.sections[${index}].fields`,
          message: 'Section fields must be an array',
          severity: 'error'
        })
        return
      }

      section.fields.forEach((fieldName: string) => {
        if (!fieldNames.includes(fieldName)) {
          errors.push({
            path: `formView.sections[${index}].fields`,
            message: `Field '${fieldName}' referenced in section but not defined in fields array`,
            severity: 'error'
          })
        }

        if (usedFields.has(fieldName)) {
          warnings.push({
            path: `formView.sections[${index}].fields`,
            message: `Field '${fieldName}' is used in multiple sections`,
            severity: 'warning'
          })
        }
        usedFields.add(fieldName)
      })
    })

    fieldNames.forEach(fieldName => {
      if (!usedFields.has(fieldName)) {
        warnings.push({
          path: 'formView.sections',
          message: `Field '${fieldName}' is defined but not used in any section`,
          severity: 'warning'
        })
      }
    })
  }

  private validateActions(actions: any[], path: string, errors: ValidationError[]): void {
    if (!Array.isArray(actions)) {
      errors.push({
        path,
        message: 'Actions must be an array',
        severity: 'error'
      })
      return
    }

    const actionIds = new Set<string>()

    actions.forEach((action, index) => {
      if (!action.id) {
        errors.push({
          path: `${path}[${index}].id`,
          message: 'Action id is required',
          severity: 'error'
        })
      }

      if (!action.label) {
        errors.push({
          path: `${path}[${index}].label`,
          message: 'Action label is required',
          severity: 'error'
        })
      }

      if (!action.action) {
        errors.push({
          path: `${path}[${index}].action`,
          message: 'Action type is required',
          severity: 'error'
        })
      } else if (!VALID_ACTION_TYPES.includes(action.action)) {
        errors.push({
          path: `${path}[${index}].action`,
          message: `Invalid action type '${action.action}'. Valid types: ${VALID_ACTION_TYPES.join(', ')}`,
          severity: 'error'
        })
      }

      if (action.id) {
        if (actionIds.has(action.id)) {
          errors.push({
            path: `${path}[${index}].id`,
            message: `Duplicate action id '${action.id}'`,
            severity: 'error'
          })
        }
        actionIds.add(action.id)
      }
    })
  }

  private validateAccess(access: any, errors: ValidationError[], warnings: ValidationError[]): void {
    if (access.permissions && typeof access.permissions !== 'object') {
      errors.push({
        path: 'access.permissions',
        message: 'Access permissions must be an object',
        severity: 'error'
      })
    }

    if (access.fieldAccess && typeof access.fieldAccess !== 'object') {
      errors.push({
        path: 'access.fieldAccess',
        message: 'Field access must be an object',
        severity: 'error'
      })
    }

    if (access.dataScope && typeof access.dataScope !== 'object') {
      errors.push({
        path: 'access.dataScope',
        message: 'Data scope must be an object',
        severity: 'error'
      })
    }

    if (access.conditions && typeof access.conditions !== 'object') {
      errors.push({
        path: 'access.conditions',
        message: 'Access conditions must be an object',
        severity: 'error'
      })
    }

    if (access.permissions) {
      const validPermissions = ['create', 'read', 'update', 'delete', 'export', 'import']
      Object.keys(access.permissions).forEach(permission => {
        if (!validPermissions.includes(permission)) {
          warnings.push({
            path: `access.permissions.${permission}`,
            message: `Unknown permission '${permission}'. Standard permissions: ${validPermissions.join(', ')}`,
            severity: 'warning'
          })
        }

        if (!Array.isArray(access.permissions[permission])) {
          errors.push({
            path: `access.permissions.${permission}`,
            message: `Permission '${permission}' must be an array of roles`,
            severity: 'error'
          })
        }
      })
    }
  }
}

export const validateSchema = (schema: unknown): ValidationResult => {
  const validator = new SchemaValidator()
  return validator.validateSchema(schema)
}