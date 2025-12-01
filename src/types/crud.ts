/**
 * CRUD Operation Types for Dhool ERP
 * 
 * Comprehensive type definitions for CRUD operations, composables, and data management.
 * These types provide full type safety for all CRUD-related functionality.
 * 
 * @fileoverview CRUD operation type definitions
 * @version 1.0.0
 */

import type { Ref, MaybeRef } from 'vue'
import type { ApiError, ListParams as BaseListParams, PaginatedResponse } from './api'

/**
 * Extended list parameters for CRUD operations with additional filtering and selection options
 */
export interface CrudListParams extends Omit<BaseListParams, 'page' | 'limit'> {
  /** Page number (1-based) */
  page?: number
  /** Number of items per page */
  limit?: number
  /** Search query string */
  search?: string
  /** Fields to search in */
  searchFields?: string[]
  /** Field-based filters */
  filters?: Record<string, any>
  /** Sort field name */
  sort?: string
  /** Sort direction */
  order?: 'asc' | 'desc'
  /** Specific fields to include in response */
  fields?: string[]
  /** Fields to exclude from response */
  exclude?: string[]
  /** Related data to include (joins/populate) */
  include?: string[]
}

/**
 * CRUD operation status types
 */
export type CrudOperationStatus = 'idle' | 'loading' | 'success' | 'error'

/**
 * CRUD operation types
 */
export type CrudOperation = 'create' | 'read' | 'update' | 'delete' | 'list' | 'bulk-delete'

/**
 * CRUD operation result with status tracking
 */
export interface CrudOperationResult<T = any> {
  /** Operation status */
  status: CrudOperationStatus
  /** Result data (if successful) */
  data?: T
  /** Error information (if failed) */
  error?: ApiError
  /** Operation metadata */
  meta?: {
    /** Operation start time */
    startTime: number
    /** Operation end time */
    endTime?: number
    /** Operation duration in milliseconds */
    duration?: number
    /** Affected items count */
    affectedItems?: number
  }
}

/**
 * Bulk operation configuration
 */
export interface BulkOperationConfig {
  /** Whether to stop processing on first error */
  stopOnError?: boolean
  /** Batch size for processing items */
  batchSize?: number
  /** Whether to show progress notifications */
  showProgress?: boolean
  /** Custom progress callback */
  onProgress?: (completed: number, total: number) => void
}

/**
 * Comprehensive CRUD operations interface with full type safety
 */
export interface CrudOperations<T extends Record<string, any> = any> {
  // ============= Reactive State =============
  
  /** Array of items from the current list */
  items: Ref<T[]>
  
  /** Loading state for any ongoing operation */
  loading: Ref<boolean>
  
  /** Currently selected item */
  selectedItem: Ref<T | null>
  
  /** Total number of items available */
  totalItems: Ref<number>
  
  /** Current page number (1-based) */
  currentPage: Ref<number>
  
  /** Total number of pages */
  totalPages: Ref<number>
  
  /** Whether there are more pages after current */
  hasNext: Ref<boolean>
  
  /** Whether there are pages before current */
  hasPrev: Ref<boolean>
  
  /** Current error state */
  error: Ref<ApiError | null>
  
  /** Current operation being performed */
  currentOperation: Ref<CrudOperation | null>
  
  /** Last parameters used for fetchList (for refresh functionality) */
  lastParams: Ref<CrudListParams>
  
  // ============= List Operations =============
  
  /**
   * Fetch a paginated list of items
   * @param params - Query parameters for filtering, pagination, and sorting
   * @returns Promise that resolves when the operation completes
   */
  fetchList: (params?: CrudListParams) => Promise<void>
  
  /**
   * Refresh the current list with the same parameters
   * @returns Promise that resolves when refresh completes
   */
  refresh: () => Promise<void>
  
  // ============= Single Item Operations =============
  
  /**
   * Fetch a single item by ID
   * @param id - Unique identifier of the item
   * @returns Promise that resolves to the item or null if not found/error
   */
  fetchOne: (id: string) => Promise<T | null>
  
  /**
   * Create a new item
   * @param data - Partial data for the new item
   * @returns Promise that resolves to the created item or null on error
   */
  create: (data: Partial<T>) => Promise<T | null>
  
  /**
   * Update an existing item
   * @param id - Unique identifier of the item to update
   * @param data - Partial data with updated fields
   * @returns Promise that resolves to the updated item or null on error
   */
  update: (id: string, data: Partial<T>) => Promise<T | null>
  
  /**
   * Delete a single item
   * @param id - Unique identifier of the item to delete
   * @returns Promise that resolves to true if successful, false on error
   */
  remove: (id: string) => Promise<boolean>
  
  // ============= Bulk Operations =============
  
  /**
   * Delete multiple items at once
   * @param ids - Array of unique identifiers to delete
   * @param config - Optional configuration for bulk operation
   * @returns Promise that resolves to the number of successfully deleted items
   */
  bulkDelete: (ids: string[], config?: BulkOperationConfig) => Promise<number>
  
  /**
   * Create multiple items at once
   * @param items - Array of partial data objects to create
   * @param config - Optional configuration for bulk operation
   * @returns Promise that resolves to array of created items
   */
  bulkCreate?: (items: Partial<T>[], config?: BulkOperationConfig) => Promise<T[]>
  
  /**
   * Update multiple items at once
   * @param updates - Array of objects with id and data to update
   * @param config - Optional configuration for bulk operation
   * @returns Promise that resolves to array of updated items
   */
  bulkUpdate?: (updates: Array<{ id: string; data: Partial<T> }>, config?: BulkOperationConfig) => Promise<T[]>
  
  // ============= Utility Methods =============
  
  /**
   * Reset all state to initial values
   */
  reset: () => void
  
  /**
   * Set the currently selected item
   * @param item - Item to select or null to deselect
   */
  selectItem: (item: T | null) => void
  
  /**
   * Clear the current error state
   */
  clearError: () => void
  
  /**
   * Check if a specific operation is allowed for the current user
   * @param action - CRUD action to check permissions for
   * @returns Boolean indicating if the action is permitted
   */
  canPerform: (action: 'create' | 'read' | 'update' | 'delete') => boolean
  
  /**
   * Get the last operation result
   * @returns The result of the most recent operation
   */
  getLastResult?: () => CrudOperationResult<T> | null
}

/**
 * CRUD composable configuration options
 */
export interface CrudConfig {
  /** Default page size for list operations */
  defaultPageSize?: number
  
  /** Whether to automatically fetch list on composable creation */
  autoFetch?: boolean
  
  /** Default sort field */
  defaultSort?: string
  
  /** Default sort order */
  defaultOrder?: 'asc' | 'desc'
  
  /** Whether to show toast notifications for operations */
  showNotifications?: boolean
  
  /** Custom notification messages */
  notifications?: {
    create?: {
      success?: string
      error?: string
    }
    update?: {
      success?: string
      error?: string
    }
    delete?: {
      success?: string
      error?: string
    }
    fetch?: {
      error?: string
    }
  }
  
  /** Whether to optimistically update the UI */
  optimisticUpdates?: boolean
  
  /** Custom error handler */
  onError?: (error: ApiError, operation: CrudOperation) => void
  
  /** Custom success handler */
  onSuccess?: <T>(data: T, operation: CrudOperation) => void
}

/**
 * CRUD hook return type with proper generic typing
 */
export type UseCrudReturn<T extends Record<string, any> = any> = CrudOperations<T>

/**
 * Type for CRUD composable factory function
 */
export type CrudComposable = <T extends Record<string, any> = any>(
  docType: MaybeRef<string>,
  config?: CrudConfig
) => UseCrudReturn<T>

/**
 * Enhanced pagination information
 */
export interface CrudPaginationInfo extends Pick<PaginatedResponse, 'page' | 'limit' | 'total' | 'totalPages' | 'hasNext' | 'hasPrev'> {
  /** Items on current page */
  itemsOnPage: number
  
  /** Range of items being displayed */
  range: {
    start: number
    end: number
  }
  
  /** Available page size options */
  pageSizeOptions?: number[]
}

/**
 * Advanced filtering configuration
 */
export interface CrudFilterConfig {
  /** Field to filter on */
  field: string
  
  /** Filter operator */
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'startswith' | 'endswith' | 'in' | 'not_in' | 'is_null' | 'is_not_null'
  
  /** Filter value */
  value: any
  
  /** Display label for the filter */
  label?: string
  
  /** Whether this filter is user-removable */
  removable?: boolean
}

/**
 * Sorting configuration
 */
export interface CrudSortConfig {
  /** Field to sort by */
  field: string
  
  /** Sort direction */
  direction: 'asc' | 'desc'
  
  /** Display label for the sort option */
  label?: string
}

/**
 * Search configuration
 */
export interface CrudSearchConfig {
  /** Current search query */
  query: string
  
  /** Fields to search in */
  fields: string[]
  
  /** Search operator (contains, exact, etc.) */
  operator?: 'contains' | 'exact' | 'startswith' | 'endswith'
  
  /** Minimum query length to trigger search */
  minLength?: number
  
  /** Debounce delay in milliseconds */
  debounce?: number
}

/**
 * Export configuration for CRUD data
 */
export interface CrudExportConfig {
  /** Export format */
  format: 'csv' | 'excel' | 'pdf' | 'json'
  
  /** Fields to include in export */
  fields?: string[]
  
  /** Custom filename */
  filename?: string
  
  /** Whether to include headers */
  includeHeaders?: boolean
  
  /** Current filters to apply to export */
  filters?: CrudFilterConfig[]
  
  /** Maximum number of records to export */
  maxRecords?: number
}

/**
 * Audit trail information for CRUD operations
 */
export interface CrudAuditInfo {
  /** Operation that was performed */
  operation: CrudOperation
  
  /** User who performed the operation */
  userId: string
  
  /** Timestamp of the operation */
  timestamp: string
  
  /** Items affected by the operation */
  affectedItems: string[]
  
  /** Additional metadata */
  metadata?: Record<string, any>
}

/**
 * Real-time updates configuration
 */
export interface CrudRealTimeConfig {
  /** Whether to enable real-time updates */
  enabled: boolean
  
  /** WebSocket endpoint for real-time updates */
  endpoint?: string
  
  /** Events to listen for */
  events?: Array<'created' | 'updated' | 'deleted'>
  
  /** Callback for handling real-time updates */
  onUpdate?: (event: string, data: any) => void
}

/**
 * Cache configuration for CRUD operations
 */
export interface CrudCacheConfig {
  /** Whether to enable caching */
  enabled: boolean
  
  /** Cache TTL in milliseconds */
  ttl?: number
  
  /** Cache key prefix */
  keyPrefix?: string
  
  /** Whether to cache list results */
  cacheList?: boolean
  
  /** Whether to cache individual items */
  cacheItems?: boolean
  
  /** Cache invalidation strategy */
  invalidation?: 'manual' | 'auto' | 'ttl'
}