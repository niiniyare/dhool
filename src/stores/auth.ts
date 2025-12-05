import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  roles: string[]
  permissions: string[]
  attributes: Record<string, any>
  lastLoginAt?: string
  emailVerifiedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthSession {
  token: string
  refreshToken?: string
  expiresAt: string
  userId: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const session = ref<AuthSession | null>(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAdmin = computed(() => {
    return user.value?.roles.includes('admin') || 
           user.value?.roles.includes('administrator') || false
  })

  const fullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName} ${user.value.lastName}`.trim()
  })

  const initials = computed(() => {
    if (!user.value) return ''
    const first = user.value.firstName?.charAt(0) || ''
    const last = user.value.lastName?.charAt(0) || ''
    return (first + last).toUpperCase()
  })

  const hasPermission = computed(() => {
    return (permission: string): boolean => {
      return user.value?.permissions.includes(permission) || false
    }
  })

  const hasRole = computed(() => {
    return (role: string): boolean => {
      return user.value?.roles.includes(role) || false
    }
  })

  // Actions
  async function login(credentials: LoginCredentials): Promise<void> {
    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      
      session.value = {
        token: data.token,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        userId: data.user.id
      }

      user.value = data.user
      isAuthenticated.value = true

      // Store session in localStorage if remember me is checked
      if (credentials.rememberMe) {
        localStorage.setItem('dhool_session', JSON.stringify(session.value))
      }

      // Store token for API requests
      localStorage.setItem('dhool_token', data.token)
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      if (session.value?.token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.value.token}`
          }
        })
      }
    } catch (err) {
      console.warn('Logout API call failed:', err)
    } finally {
      // Clear state regardless of API call success
      clearAuth()
      loading.value = false
    }
  }

  async function refreshToken(): Promise<boolean> {
    if (!session.value?.refreshToken) {
      return false
    }

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: session.value.refreshToken
        })
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      
      session.value = {
        token: data.token,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        userId: session.value.userId
      }

      localStorage.setItem('dhool_token', data.token)
      localStorage.setItem('dhool_session', JSON.stringify(session.value))

      return true
    } catch (err) {
      console.warn('Token refresh failed:', err)
      return false
    }
  }

  async function fetchProfile(): Promise<void> {
    if (!session.value?.token) {
      throw new Error('No authentication token available')
    }

    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${session.value.token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const userData = await response.json()
      user.value = userData
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(updates: Partial<User>): Promise<void> {
    if (!session.value?.token) {
      throw new Error('No authentication token available')
    }

    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.value.token}`
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedUser = await response.json()
      user.value = updatedUser
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
    if (!session.value?.token) {
      throw new Error('No authentication token available')
    }

    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.value.token}`
        },
        body: JSON.stringify({
          oldPassword,
          newPassword
        })
      })

      if (!response.ok) {
        throw new Error('Failed to change password')
      }
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to change password'
      throw err
    } finally {
      loading.value = false
    }
  }

  function initializeAuth(): void {
    // Check for stored session
    const storedSession = localStorage.getItem('dhool_session')
    const storedToken = localStorage.getItem('dhool_token')

    if (storedSession && storedToken) {
      try {
        const parsedSession = JSON.parse(storedSession)
        
        // Check if session is not expired
        if (new Date(parsedSession.expiresAt) > new Date()) {
          session.value = parsedSession
          isAuthenticated.value = true
          
          // Fetch current user profile
          fetchProfile().catch(err => {
            console.warn('Failed to fetch profile on initialization:', err)
            clearAuth()
          })
        } else {
          // Session expired, try to refresh
          session.value = parsedSession
          refreshToken().then(success => {
            if (success) {
              isAuthenticated.value = true
              fetchProfile().catch(err => {
                console.warn('Failed to fetch profile after refresh:', err)
                clearAuth()
              })
            } else {
              clearAuth()
            }
          })
        }
      } catch (err) {
        console.warn('Failed to parse stored session:', err)
        clearAuth()
      }
    }
  }

  function clearAuth(): void {
    user.value = null
    session.value = null
    isAuthenticated.value = false
    error.value = null
    
    localStorage.removeItem('dhool_session')
    localStorage.removeItem('dhool_token')
  }

  function getUserAttributes(): Record<string, any> {
    return user.value?.attributes || {}
  }

  function isTokenExpired(): boolean {
    if (!session.value?.expiresAt) {
      return true
    }
    
    return new Date(session.value.expiresAt) <= new Date()
  }

  return {
    // State
    user,
    session,
    isAuthenticated,
    loading,
    error,

    // Getters
    isAdmin,
    fullName,
    initials,
    hasPermission,
    hasRole,

    // Actions
    login,
    logout,
    refreshToken,
    fetchProfile,
    updateProfile,
    changePassword,
    initializeAuth,
    clearAuth,
    getUserAttributes,
    isTokenExpired
  }
})