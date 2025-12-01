export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiError {
  message: string
  code?: string
  field?: string
  details?: Record<string, any>
}

export interface RefreshTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
}