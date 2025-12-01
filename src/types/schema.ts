export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'date' 
  | 'datetime' 
  | 'boolean' 
  | 'select' 
  | 'multiselect' 
  | 'file' 
  | 'image' 
  | 'currency' 
  | 'json'

export interface DependencyConfig {
  field: string
  condition: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than'
  value: unknown
  action: 'show' | 'hide' | 'require' | 'optional' | 'enable' | 'disable'
}

export interface FieldValidation {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'url' | 'custom'
  value?: any
  message?: string
}

export interface SelectOption {
  label: string
  value: unknown
  disabled?: boolean
}

export interface SchemaFieldSchema {
  name: string
  type: FieldType
  label: string
  description?: string
  required?: boolean
  defaultValue?: unknown
  placeholder?: string
  
  // UI specific properties
  span?: number
  order?: number
  group?: string
  
  // Field type specific properties
  options?: SelectOption[]
  multiple?: boolean
  maxLength?: number
  minLength?: number
  min?: number
  max?: number
  step?: number
  accept?: string
  
  // Validation
  validations?: FieldValidation[]
  
  // Dependencies
  dependencies?: DependencyConfig[]
  
  // Access control (from existing type)
  access?: import('./access').ABACPolicy[]
}

export interface FormSection {
  id: string
  title: string
  description?: string
  collapsible?: boolean
  collapsed?: boolean
  span?: number
  fields: string[]
}

export interface ListColumn {
  field: string
  label: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  format?: 'date' | 'datetime' | 'currency' | 'number' | 'boolean'
}

export interface SchemaActionSchema {
  id: string
  label: string
  icon?: string
  type: 'button' | 'link' | 'dropdown'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  position: 'toolbar' | 'row' | 'form'
  
  // Navigation or API call
  action?: 'navigate' | 'api' | 'dialog' | 'download' | 'custom'
  target?: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  
  // Permissions
  requires?: string[]
  access?: import('./access').ABACPolicy[]
}

export interface ApiConfig {
  baseEndpoint: string
  endpoints?: {
    list?: string
    create?: string
    read?: string
    update?: string
    delete?: string
    bulk?: string
  }
  
  // Custom headers or parameters
  headers?: Record<string, string>
  params?: Record<string, unknown>
}

export interface ListView {
  columns: ListColumn[]
  defaultSort?: string
  defaultSortOrder?: 'asc' | 'desc'
  pageSize?: number
  searchable?: boolean
  filterable?: boolean
  exportable?: boolean
  
  toolbarActions: SchemaActionSchema[]
  rowActions: SchemaActionSchema[]
}

export interface FormView {
  sections: FormSection[]
  fields: Record<string, SchemaFieldSchema>
  submitLabel?: string
  resetLabel?: string
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export interface AccessConfig {
  permissions: Record<string, import('./access').Permission>
  roles?: string[]
  abacPolicies?: import('./access').ABACPolicy[]
}

export interface DocumentSchema {
  name: string
  label: string
  description?: string
  module: string
  version?: string
  
  // API configuration
  api: ApiConfig
  
  // Views
  listView: ListView
  formView: FormView
  
  // Access control
  access: AccessConfig
  
  // Metadata
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  tags?: string[]
}

export interface SchemaCache {
  data: DocumentSchema
  timestamp: number
  ttl: number
}