import axios, { type AxiosInstance, type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { ApiResponse, PaginatedResponse, ApiError, RefreshTokenResponse } from '@/types/api'

interface RequestConfig extends AxiosRequestConfig {
  _retry?: boolean
}

class ApiService {
  private client: AxiosInstance
  private refreshPromise: Promise<string> | null = null

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.setupRequestInterceptor()
    this.setupResponseInterceptor()
  }

  private setupRequestInterceptor(): void {
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        const tenantId = this.getTenantId()

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        if (tenantId) {
          config.headers['X-Tenant-ID'] = tenantId
        }

        if (import.meta.env.DEV) {
          console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            headers: config.headers,
            data: config.data
          })
        }

        return config
      },
      (error) => {
        if (import.meta.env.DEV) {
          console.error('❌ Request Error:', error)
        }
        return Promise.reject(error)
      }
    )
  }

  private setupResponseInterceptor(): void {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (import.meta.env.DEV) {
          console.log('✅ API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data
          })
        }
        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as RequestConfig

        if (import.meta.env.DEV) {
          console.error('❌ API Error:', {
            status: error.response?.status,
            url: originalRequest?.url,
            message: error.message,
            data: error.response?.data
          })
        }

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const newToken = await this.refreshToken()
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.client(originalRequest)
            }
          } catch (refreshError) {
            this.handleAuthFailure()
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(this.handleError(error))
      }
    )
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    this.refreshPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
          `${import.meta.env.VITE_API_URL || '/api/v1'}/auth/refresh`,
          { refresh_token: refreshToken }
        )

        const { access_token, refresh_token: newRefreshToken } = response.data.data
        
        this.setToken(access_token)
        if (newRefreshToken) {
          this.setRefreshToken(newRefreshToken)
        }

        resolve(access_token)
      } catch (error) {
        reject(error)
      } finally {
        this.refreshPromise = null
      }
    })

    return this.refreshPromise
  }

  private handleError(error: AxiosError): ApiError {
    const response = error.response
    
    if (response?.data && typeof response.data === 'object' && 'message' in response.data) {
      return response.data as ApiError
    }

    return {
      message: error.message || 'An unexpected error occurred',
      code: error.code,
      details: response?.data as Record<string, any> | undefined
    }
  }

  private handleAuthFailure(): void {
    this.clearTokens()
    window.location.href = '/login'
  }

  private getToken(): string | null {
    return localStorage.getItem('access_token')
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token')
  }

  private getTenantId(): string | null {
    return localStorage.getItem('tenant_id')
  }

  private setToken(token: string): void {
    localStorage.setItem('access_token', token)
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token)
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  // Generic CRUD Methods
  
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config)
    return response.data
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config)
    return response.data
  }

  // Paginated requests
  async getPaginated<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const response = await this.client.get<ApiResponse<PaginatedResponse<T>>>(url, {
      ...config,
      params
    })
    return response.data
  }

  // File upload
  async upload<T = any>(
    url: string,
    file: File | FormData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = file instanceof File ? new FormData() : file
    
    if (file instanceof File) {
      formData.append('file', file)
    }

    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers
      }
    })
    return response.data
  }

  // Download file
  async download(url: string, filename?: string): Promise<void> {
    const response = await this.client.get(url, {
      responseType: 'blob'
    })

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }

  // Utility methods for external access
  public setAuthTokens(accessToken: string, refreshToken?: string): void {
    this.setToken(accessToken)
    if (refreshToken) {
      this.setRefreshToken(refreshToken)
    }
  }

  public setTenantId(tenantId: string): void {
    localStorage.setItem('tenant_id', tenantId)
  }

  public logout(): void {
    this.clearTokens()
    localStorage.removeItem('tenant_id')
  }

  public isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const api = new ApiService()