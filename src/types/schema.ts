/**
 * Schema type definitions for Dhool ERP system
 * Defines field types, document schemas, and UI configuration
 */

/**
 * Supported field types in the schema system
 */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'password'
  | 'number'
  | 'currency'
  | 'percent'
  | 'date'
  | 'datetime'
  | 'time'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'autocomplete'
  | 'file'
  | 'image'
  | 'link'
  | 'table'
  | 'json'
  | 'color'
  | 'rating'
  | 'slider'
  | 'editor'
  | 'code'

/**
 * Field validation configuration
 */
export interface FieldValidation {
  /** Whether field is required */
  required?: boolean
  /** Minimum length for text fields */
  minLength?: number
  /** Maximum length for text fields */
  maxLength?: number
  /** Minimum value for numeric fields */
  min?: number
  /** Maximum value for numeric fields */
  max?: number
  /** Regular expression pattern */
  pattern?: string
  /** Custom validation function name */
  validator?: string
  /** Custom error message */
  message?: string
}

/**
 * Select field option definition
 */
export interface SelectOption {
  /** Option value */
  value: string | number
  /** Display label */
  label: string
  /** Option description */
  description?: string
  /** Option icon */
  icon?: string
  /** Whether option is disabled */
  disabled?: boolean
  /** CSS class for styling */
  class?: string
}

/**
 * Dependency configuration for conditional fields
 */
export interface DependencyConfig {
  /** Field that this field depends on */
  field: string
  /** Condition operator */
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'contains'
  /** Value(s) to compare against */
  value: any
  /** Action to take when condition is met */
  action: 'show' | 'hide' | 'require' | 'optional' | 'readonly' | 'editable'
}

/**
 * Complete field schema definition
 */
export interface FieldSchema {
  /** Field name/key */
  name: string
  /** Display label */
  label: string
  /** Field type */
  type: FieldType
  /** Field description/help text */
  description?: string
  /** Default value */
  default?: any
  /** Placeholder text */
  placeholder?: string
  /** Field validation rules */
  validation?: FieldValidation
  /** Options for select/multiselect fields */
  options?: SelectOption[]
  /** Data source for autocomplete fields */
  dataSource?: string
  /** Whether field is read-only */
  readonly?: boolean
  /** Whether field is hidden in forms */
  hidden?: boolean
  /** CSS classes for styling */
  class?: string
  /** Field width (1-12 for grid system) */
  width?: number
  /** Field dependencies for conditional logic */
  depends?: DependencyConfig[]
  /** Field grouping */
  group?: string
  /** Display order within group */
  order?: number
  /** Custom component props */
  props?: Record<string, any>
  /** Format configuration for display */
  format?: {
    /** Number format options */
    number?: Intl.NumberFormatOptions
    /** Date format string */
    date?: string
    /** Currency code */
    currency?: string
  }
}

/**
 * Column configuration for list views
 */
export interface ColumnSchema {
  /** Column field name */
  field: string
  /** Column header label */
  header: string
  /** Column data type for sorting/filtering */
  type?: FieldType
  /** Whether column is sortable */
  sortable?: boolean
  /** Whether column is filterable */
  filterable?: boolean
  /** Column width */
  width?: string | number
  /** Column alignment */
  align?: 'left' | 'center' | 'right'
  /** Custom format function */
  format?: string
  /** Whether column is frozen */
  frozen?: boolean
  /** Custom CSS classes */
  class?: string
  /** Whether column is hidden by default */
  hidden?: boolean
}

/**
 * Action configuration for buttons and menu items
 */
export interface ActionSchema {
  /** Action identifier */
  id: string
  /** Display label */
  label: string
  /** Action icon */
  icon?: string
  /** Action type */
  type: 'button' | 'link' | 'dropdown' | 'separator'
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'outline'
  /** Action handler function name */
  handler?: string
  /** URL for link actions */
  url?: string
  /** Whether action opens in new window */
  target?: '_blank' | '_self'
  /** Action visibility condition */
  condition?: string
  /** Action permissions required */
  permissions?: string[]
  /** Whether action is disabled */
  disabled?: boolean
  /** Confirmation message before action */
  confirm?: string
  /** Child actions for dropdown */
  children?: ActionSchema[]
  /** Custom CSS classes */
  class?: string
}

/**
 * Form section configuration
 */
export interface FormSection {
  /** Section identifier */
  id: string
  /** Section title */
  title: string
  /** Section description */
  description?: string
  /** Fields in this section */
  fields: string[]
  /** Whether section is collapsible */
  collapsible?: boolean
  /** Whether section is collapsed by default */
  collapsed?: boolean
  /** Section visibility condition */
  condition?: string
  /** Number of columns for field layout */
  columns?: number
  /** Custom CSS classes */
  class?: string
}

/**
 * Form view configuration
 */
export interface FormView {
  /** Form title */
  title?: string
  /** Form description */
  description?: string
  /** Form sections */
  sections: FormSection[]
  /** All form fields */
  fields: FieldSchema[]
  /** Form actions */
  actions?: ActionSchema[]
  /** Form layout mode */
  layout?: 'sections' | 'tabs' | 'accordion'
  /** Form validation mode */
  validation?: 'field' | 'section' | 'form'
}

/**
 * List view configuration
 */
export interface ListView {
  /** View title */
  title?: string
  /** View description */
  description?: string
  /** Table columns */
  columns: ColumnSchema[]
  /** Toolbar actions */
  toolbarActions?: ActionSchema[]
  /** Row actions */
  rowActions?: ActionSchema[]
  /** Default sort configuration */
  defaultSort?: {
    field: string
    order: 'asc' | 'desc'
  }
  /** Default filters */
  defaultFilters?: Record<string, any>
  /** Page size options */
  pageSizes?: number[]
  /** Default page size */
  defaultPageSize?: number
  /** Whether to show export options */
  exportable?: boolean
  /** Whether to show column selector */
  columnSelector?: boolean
  /** Whether rows are selectable */
  selectable?: boolean
  /** Selection mode */
  selectionMode?: 'single' | 'multiple'
}

/**
 * API endpoint configuration
 */
export interface ApiConfig {
  /** Base API endpoint */
  baseEndpoint: string
  /** List endpoint override */
  listEndpoint?: string
  /** Get endpoint override */
  getEndpoint?: string
  /** Create endpoint override */
  createEndpoint?: string
  /** Update endpoint override */
  updateEndpoint?: string
  /** Delete endpoint override */
  deleteEndpoint?: string
  /** Custom endpoints */
  customEndpoints?: Record<string, string>
  /** Request headers */
  headers?: Record<string, string>
  /** Request timeout */
  timeout?: number
}

/**
 * Dashboard widget configuration
 */
export interface DashboardWidget {
  /** Widget identifier */
  id: string
  /** Widget title */
  title: string
  /** Widget type */
  type: 'stat' | 'chart' | 'table' | 'list' | 'custom'
  /** Widget size */
  size: {
    width: number
    height: number
  }
  /** Widget position */
  position: {
    x: number
    y: number
  }
  /** Data source configuration */
  dataSource?: {
    endpoint: string
    params?: Record<string, any>
    transform?: string
  }
  /** Widget configuration */
  config?: Record<string, any>
  /** Widget permissions */
  permissions?: string[]
  /** Refresh interval in seconds */
  refreshInterval?: number
}

/**
 * Complete document schema definition
 */
export interface DocumentSchema {
  /** Document type identifier */
  name: string
  /** Display label */
  label: string
  /** Module this document belongs to */
  module: string
  /** Document description */
  description?: string
  /** Document icon */
  icon?: string
  /** API configuration */
  api: ApiConfig
  /** List view configuration */
  listView: ListView
  /** Form view configuration */
  formView: FormView
  /** Access control configuration */
  access?: {
    /** Document-level permissions */
    permissions?: Record<string, any>
    /** Field-level access rules */
    fields?: Record<string, any>
    /** Workflow states */
    states?: string[]
    /** State transitions */
    transitions?: Record<string, string[]>
  }
  /** Document metadata */
  meta?: {
    /** Creation timestamp */
    createdAt?: boolean
    /** Last modified timestamp */
    updatedAt?: boolean
    /** Creator user */
    createdBy?: boolean
    /** Last modifier user */
    updatedBy?: boolean
    /** Document version */
    version?: boolean
  }
  /** Custom hooks */
  hooks?: {
    /** Before create hook */
    beforeCreate?: string
    /** After create hook */
    afterCreate?: string
    /** Before update hook */
    beforeUpdate?: string
    /** After update hook */
    afterUpdate?: string
    /** Before delete hook */
    beforeDelete?: string
    /** After delete hook */
    afterDelete?: string
  }
}

/**
 * Dashboard schema definition
 */
export interface DashboardSchema {
  /** Dashboard identifier */
  id: string
  /** Dashboard title */
  title: string
  /** Dashboard description */
  description?: string
  /** Dashboard layout */
  layout: {
    /** Number of columns */
    columns: number
    /** Row height */
    rowHeight: number
    /** Grid margins */
    margin: [number, number]
    /** Container padding */
    padding: [number, number]
  }
  /** Dashboard widgets */
  widgets: DashboardWidget[]
  /** Dashboard permissions */
  permissions?: string[]
  /** Whether dashboard is public */
  public?: boolean
  /** Dashboard filters */
  filters?: FieldSchema[]
}