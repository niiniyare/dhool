/**
 * Dhool ERP Type System
 * 
 * Central export point for all TypeScript type definitions used throughout the Dhool ERP system.
 * This file provides organized re-exports of all types with conflict resolution where needed.
 * 
 * @fileoverview Main type definitions for schema-driven ERP system
 * @version 1.0.0
 */

// Schema Types - Document structure and field definitions
export type {
  FieldType,
  FieldValidation,
  SelectOption,
  DependencyConfig,
  FieldSchema,
  ColumnSchema,
  ActionSchema,
  FormSection,
  FormView,
  ListView,
  ApiConfig,
  DashboardWidget,
  DocumentSchema,
  DashboardSchema
} from './schema'

// Access Control Types - Permissions and security
export type {
  CrudAction,
  DataScope,
  PermissionStatus,
  Permission,
  SubscriptionPlan,
  UserRole,
  ABACCondition,
  ABACPolicy,
  AccessContext,
  FieldAccess,
  DocumentAccess,
  AccessAuditLog,
  AccessRule,
  ModuleAccess,
  TeamAccess,
  DepartmentAccess
} from './access'

// API Types - Request/response and HTTP interfaces
export type {
  HttpMethod,
  ApiStatus,
  ApiResponse,
  PaginatedResponse,
  ApiError,
  ValidationError,
  ListParams,
  FilterExpression,
  BulkRequest,
  BulkResponse,
  BulkItemResult,
  UploadRequest,
  UploadResponse,
  ExportRequest,
  ExportResponse,
  WebSocketMessage,
  NotificationMessage,
  HealthResponse
} from './api'

// CRUD Types - Composable and operation types
export type {
  CrudListParams,
  CrudOperationStatus,
  CrudOperation,
  CrudOperationResult,
  BulkOperationConfig,
  CrudOperations,
  CrudConfig,
  UseCrudReturn,
  CrudComposable,
  CrudPaginationInfo,
  CrudFilterConfig,
  CrudSortConfig,
  CrudSearchConfig,
  CrudExportConfig,
  CrudAuditInfo,
  CrudRealTimeConfig,
  CrudCacheConfig
} from './crud'

// Re-export all types from individual modules
export * from './schema'
export * from './access'
export * from './api'
export * from './crud'

// Type Guards and Utility Types

/**
 * Type guard to check if a value is a valid FieldType
 */
export function isFieldType(value: string): value is FieldType {
  return [
    'text', 'textarea', 'email', 'password', 'number', 'currency', 'percent',
    'date', 'datetime', 'time', 'boolean', 'select', 'multiselect', 'autocomplete',
    'file', 'image', 'link', 'table', 'json', 'color', 'rating', 'slider',
    'editor', 'code'
  ].includes(value)
}

/**
 * Type guard to check if a value is a valid CrudAction
 */
export function isCrudAction(value: string): value is CrudAction {
  return ['create', 'read', 'update', 'delete'].includes(value)
}

/**
 * Type guard to check if a value is a valid DataScope
 */
export function isDataScope(value: string): value is DataScope {
  return ['own', 'team', 'department', 'all'].includes(value)
}

/**
 * Type guard to check if an object is an ApiError
 */
export function isApiError(value: any): value is ApiError {
  return value && typeof value === 'object' && 'code' in value && 'message' in value
}

/**
 * Type guard to check if an API response indicates success
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } {
  return response.status === 'success' && response.data !== undefined
}

/**
 * Type guard to check if an API response indicates an error
 */
export function isErrorResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { error: ApiError } {
  return response.status === 'error' && response.error !== undefined
}

// Utility Types

/**
 * Extract field names from a DocumentSchema
 */
export type DocumentFieldNames<T extends DocumentSchema> = T['formView']['fields'][number]['name']

/**
 * Extract field type from a FieldSchema by name
 */
export type FieldTypeByName<T extends FieldSchema[], K extends string> = 
  Extract<T[number], { name: K }>['type']

/**
 * Create a typed data object based on DocumentSchema fields
 */
export type DocumentData<T extends DocumentSchema> = {
  [K in DocumentFieldNames<T>]?: any
}

/**
 * Permission map for a specific document type
 */
export type DocumentPermissions = Record<CrudAction, boolean>

/**
 * Field access map for document fields
 */
export type DocumentFieldAccess<T extends DocumentSchema> = {
  [K in DocumentFieldNames<T>]?: FieldAccess
}

/**
 * Create a filters object type based on DocumentSchema fields
 */
export type DocumentFilters<T extends DocumentSchema> = {
  [K in DocumentFieldNames<T>]?: any
}

/**
 * Extract available actions from ActionSchema array
 */
export type AvailableActions<T extends ActionSchema[]> = T[number]['id']

/**
 * Create a strongly-typed list params for a document type
 */
export type TypedListParams<T extends DocumentSchema> = Omit<ListParams, 'filters'> & {
  filters?: DocumentFilters<T>
}

/**
 * Create a strongly-typed API response for a document type
 */
export type DocumentApiResponse<T extends DocumentSchema> = ApiResponse<DocumentData<T>>

/**
 * Create a strongly-typed paginated response for a document type
 */
export type DocumentPaginatedResponse<T extends DocumentSchema> = ApiResponse<PaginatedResponse<DocumentData<T>>>

// Common Type Combinations

/**
 * Complete access information for a document
 */
export interface CompleteDocumentAccess<T extends DocumentSchema = DocumentSchema> {
  document: DocumentAccess
  fields: DocumentFieldAccess<T>
  subscription: {
    plan: SubscriptionPlan
    limits: SubscriptionPlan['limits']
    features: string[]
  }
  user: {
    roles: UserRole[]
    permissions: DocumentPermissions
    scope: DataScope
  }
}

/**
 * Document operation context with full type safety
 */
export interface DocumentOperationContext<T extends DocumentSchema = DocumentSchema> {
  schema: T
  access: CompleteDocumentAccess<T>
  data?: DocumentData<T>
  action: CrudAction
  field?: DocumentFieldNames<T>
}

/**
 * Form field configuration with runtime access control
 */
export interface FormFieldConfig<T extends DocumentSchema = DocumentSchema> {
  schema: FieldSchema
  access: FieldAccess
  value?: any
  validation?: FieldValidation
  dependencies?: DependencyConfig[]
}

/**
 * List column configuration with access control
 */
export interface ListColumnConfig {
  schema: ColumnSchema
  access: FieldAccess
  sortable: boolean
  filterable: boolean
  visible: boolean
}

// Import the actual types for type checking
import type { FieldType, FieldValidation, DependencyConfig, FieldSchema, ColumnSchema, ActionSchema, DocumentSchema } from './schema'
import type { CrudAction, DataScope, FieldAccess } from './access'
import type { ApiError, ApiResponse } from './api'