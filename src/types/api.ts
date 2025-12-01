/**
 * API type definitions for Dhool ERP system
 * Defines request/response structures, error handling, and HTTP interfaces
 */

/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'

/**
 * API response status types
 */
export type ApiStatus = 'success' | 'error' | 'warning' | 'info'

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
  /** Response status */
  status: ApiStatus
  /** HTTP status code */
  statusCode: number
  /** Response data */
  data?: T
  /** Response message */
  message?: string
  /** Additional metadata */
  meta?: {
    /** Request ID for tracking */
    requestId?: string
    /** Response timestamp */
    timestamp?: string
    /** API version */
    version?: string
    /** Execution time in milliseconds */
    executionTime?: number
  }
  /** Error details (if status is error) */
  error?: ApiError
  /** Validation errors */
  errors?: ValidationError[]
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T = any> {
  /** Array of items */
  items: T[]
  /** Current page number (1-based) */
  page: number
  /** Number of items per page */
  limit: number
  /** Total number of items */
  total: number
  /** Total number of pages */
  totalPages: number
  /** Whether there are more pages */
  hasNext: boolean
  /** Whether there are previous pages */
  hasPrev: boolean
  /** Next page number (null if no next page) */
  nextPage?: number | null
  /** Previous page number (null if no previous page) */
  prevPage?: number | null
  /** Pagination links */
  links?: {
    first?: string
    prev?: string
    next?: string
    last?: string
  }
}

/**
 * API error definition
 */
export interface ApiError {
  /** Error code */
  code: string
  /** Error message */
  message: string
  /** Detailed error description */
  details?: string
  /** Field that caused the error */
  field?: string
  /** Error stack trace (development only) */
  stack?: string
  /** Additional error context */
  context?: Record<string, any>
  /** Error severity level */
  severity?: 'low' | 'medium' | 'high' | 'critical'
  /** Error category */
  category?: 'validation' | 'authentication' | 'authorization' | 'business' | 'system' | 'network'
  /** Suggested action for user */
  suggestedAction?: string
  /** Help URL for error resolution */
  helpUrl?: string
}

/**
 * Validation error details
 */
export interface ValidationError {
  /** Field name that failed validation */
  field: string
  /** Validation rule that failed */
  rule: string
  /** Error message */
  message: string
  /** Value that failed validation */
  value?: any
  /** Additional validation context */
  context?: Record<string, any>
}

/**
 * Request parameters for list endpoints
 */
export interface ListParams {
  /** Page number (1-based) */
  page?: number
  /** Number of items per page */
  limit?: number
  /** Search query string */
  search?: string
  /** Search fields to query */
  searchFields?: string[]
  /** Sort field */
  sort?: string
  /** Sort order */
  order?: 'asc' | 'desc'
  /** Field filters */
  filters?: Record<string, any>
  /** Fields to include in response */
  fields?: string[]
  /** Fields to exclude from response */
  exclude?: string[]
  /** Related data to include */
  include?: string[]
  /** Date range filters */
  dateRange?: {
    field: string
    start?: string
    end?: string
  }
  /** Advanced filter expressions */
  where?: FilterExpression[]
}

/**
 * Filter expression for advanced queries
 */
export interface FilterExpression {
  /** Field to filter on */
  field: string
  /** Filter operator */
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'contains' | 'startswith' | 'endswith' | 'is_null' | 'is_not_null'
  /** Filter value */
  value: any
  /** Logical operator for combining expressions */
  logic?: 'and' | 'or'
}

/**
 * Bulk operation request
 */
export interface BulkRequest<T = any> {
  /** Operation type */
  operation: 'create' | 'update' | 'delete'
  /** Items to process */
  items: T[]
  /** Bulk operation options */
  options?: {
    /** Whether to stop on first error */
    stopOnError?: boolean
    /** Batch size for processing */
    batchSize?: number
    /** Whether to return detailed results */
    returnResults?: boolean
  }
}

/**
 * Bulk operation response
 */
export interface BulkResponse<T = any> {
  /** Total items processed */
  total: number
  /** Successfully processed items */
  success: number
  /** Failed items */
  failed: number
  /** Skipped items */
  skipped?: number
  /** Detailed results */
  results?: BulkItemResult<T>[]
  /** Processing summary */
  summary?: {
    /** Processing time in milliseconds */
    processingTime: number
    /** Batch information */
    batches: number
    /** Start time */
    startTime: string
    /** End time */
    endTime: string
  }
}

/**
 * Individual bulk operation item result
 */
export interface BulkItemResult<T = any> {
  /** Item index in original request */
  index: number
  /** Operation status */
  status: 'success' | 'error' | 'skipped'
  /** Processed item data */
  data?: T
  /** Error information (if failed) */
  error?: ApiError
  /** Item ID (if available) */
  id?: string
}

/**
 * File upload request
 */
export interface UploadRequest {
  /** File to upload */
  file: File | Blob
  /** Upload directory */
  directory?: string
  /** File metadata */
  metadata?: {
    /** Original filename */
    filename?: string
    /** File description */
    description?: string
    /** File tags */
    tags?: string[]
    /** File category */
    category?: string
  }
  /** Upload options */
  options?: {
    /** Whether to generate thumbnails */
    generateThumbnails?: boolean
    /** Maximum file size in bytes */
    maxSize?: number
    /** Allowed file types */
    allowedTypes?: string[]
    /** Whether to overwrite existing files */
    overwrite?: boolean
  }
}

/**
 * File upload response
 */
export interface UploadResponse {
  /** Uploaded file ID */
  id: string
  /** Original filename */
  filename: string
  /** File URL */
  url: string
  /** File size in bytes */
  size: number
  /** File MIME type */
  mimeType: string
  /** Upload timestamp */
  uploadedAt: string
  /** File metadata */
  metadata?: {
    /** File dimensions (for images) */
    dimensions?: {
      width: number
      height: number
    }
    /** File duration (for videos/audio) */
    duration?: number
    /** Generated thumbnails */
    thumbnails?: {
      small?: string
      medium?: string
      large?: string
    }
  }
}

/**
 * Export request configuration
 */
export interface ExportRequest {
  /** Data source endpoint */
  source: string
  /** Export format */
  format: 'csv' | 'excel' | 'pdf' | 'json'
  /** Fields to export */
  fields?: string[]
  /** Export filters */
  filters?: ListParams
  /** Export options */
  options?: {
    /** File name */
    filename?: string
    /** Include headers (for CSV/Excel) */
    includeHeaders?: boolean
    /** Date format */
    dateFormat?: string
    /** Number format */
    numberFormat?: string
    /** Template ID (for PDF) */
    templateId?: string
  }
}

/**
 * Export response
 */
export interface ExportResponse {
  /** Export job ID */
  jobId: string
  /** Export status */
  status: 'pending' | 'processing' | 'completed' | 'failed'
  /** Download URL (when completed) */
  downloadUrl?: string
  /** File size in bytes */
  fileSize?: number
  /** Export progress percentage */
  progress?: number
  /** Estimated completion time */
  estimatedCompletion?: string
  /** Export metadata */
  metadata?: {
    /** Total records exported */
    recordCount?: number
    /** Export start time */
    startTime: string
    /** Export completion time */
    endTime?: string
    /** File format used */
    format: string
  }
}

/**
 * WebSocket message types
 */
export interface WebSocketMessage<T = any> {
  /** Message type */
  type: string
  /** Message payload */
  data: T
  /** Message ID for correlation */
  id?: string
  /** Timestamp */
  timestamp: string
  /** User ID (for authentication) */
  userId?: string
  /** Room/channel ID */
  room?: string
}

/**
 * Real-time notification message
 */
export interface NotificationMessage {
  /** Notification ID */
  id: string
  /** Notification title */
  title: string
  /** Notification message */
  message: string
  /** Notification type */
  type: 'info' | 'success' | 'warning' | 'error'
  /** Priority level */
  priority: 'low' | 'medium' | 'high'
  /** Target user ID */
  userId?: string
  /** Related document/resource */
  resource?: {
    type: string
    id: string
    name: string
  }
  /** Notification actions */
  actions?: {
    label: string
    action: string
    url?: string
  }[]
  /** Expiry timestamp */
  expiresAt?: string
  /** Read status */
  read?: boolean
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  /** New access token */
  access_token: string
  /** New refresh token (optional) */
  refresh_token?: string
  /** Token type */
  token_type?: string
  /** Expires in seconds */
  expires_in?: number
}

/**
 * Health check response
 */
export interface HealthResponse {
  /** Service status */
  status: 'healthy' | 'degraded' | 'unhealthy'
  /** Service version */
  version: string
  /** Uptime in seconds */
  uptime: number
  /** System timestamp */
  timestamp: string
  /** Service dependencies status */
  dependencies?: {
    database?: 'healthy' | 'degraded' | 'unhealthy'
    redis?: 'healthy' | 'degraded' | 'unhealthy'
    storage?: 'healthy' | 'degraded' | 'unhealthy'
    auth?: 'healthy' | 'degraded' | 'unhealthy'
  }
  /** System metrics */
  metrics?: {
    /** Memory usage percentage */
    memoryUsage?: number
    /** CPU usage percentage */
    cpuUsage?: number
    /** Active connections */
    activeConnections?: number
    /** Request rate per minute */
    requestRate?: number
  }
}