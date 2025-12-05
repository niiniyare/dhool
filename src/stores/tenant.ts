import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/services/api'

export interface TenantSubscription {
  id: string
  planId: string
  planName: string
  status: 'active' | 'inactive' | 'suspended' | 'cancelled'
  features: string[]
  limits: Record<string, number>
  startDate: string
  endDate?: string
  autoRenew: boolean
  billingCycle: 'monthly' | 'yearly'
}

export interface Tenant {
  id: string
  name: string
  slug: string
  domain?: string
  logo?: string
  timezone: string
  currency: string
  language: string
  settings: Record<string, any>
  subscription: TenantSubscription
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive' | 'suspended'
  ownerId: string
  metadata: Record<string, any>
}

export interface TenantSettings {
  general: {
    companyName: string
    address?: string
    phone?: string
    email?: string
    website?: string
  }
  localization: {
    timezone: string
    currency: string
    language: string
    dateFormat: string
    timeFormat: string
  }
  branding: {
    logo?: string
    primaryColor: string
    secondaryColor: string
    favicon?: string
  }
  features: {
    modules: string[]
    integrations: string[]
  }
  security: {
    passwordPolicy: Record<string, any>
    sessionTimeout: number
    twoFactorRequired: boolean
  }
}

export const useTenantStore = defineStore('tenant', () => {
  // State
  const tenant = ref<Tenant | null>(null)
  const tenants = ref<Tenant[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const switchingTenant = ref(false)

  // Getters
  const currentTenantId = computed(() => tenant.value?.id || null)
  
  const isActive = computed(() => tenant.value?.status === 'active')
  
  const subscriptionStatus = computed(() => tenant.value?.subscription?.status || 'inactive')
  
  const isSubscriptionActive = computed(() => 
    tenant.value?.subscription?.status === 'active'
  )
  
  const availableFeatures = computed(() => 
    tenant.value?.subscription?.features || []
  )
  
  const subscriptionLimits = computed(() => 
    tenant.value?.subscription?.limits || {}
  )
  
  const tenantSettings = computed(() => 
    tenant.value?.settings as TenantSettings | null
  )
  
  const hasFeature = computed(() => {
    return (feature: string): boolean => {
      return availableFeatures.value.includes(feature)
    }
  })
  
  const isWithinLimit = computed(() => {
    return (limitKey: string, currentUsage: number): boolean => {
      const limit = subscriptionLimits.value[limitKey]
      return limit ? currentUsage < limit : false
    }
  })
  
  const displayName = computed(() => {
    return tenant.value?.name || 'Unknown Tenant'
  })

  // Actions
  async function fetchTenants(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await api.get<Tenant[]>('/tenants')
      tenants.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch tenants'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrentTenant(): Promise<void> {
    const tenantId = localStorage.getItem('tenant_id')
    if (!tenantId) {
      throw new Error('No tenant ID found')
    }

    loading.value = true
    error.value = null

    try {
      const response = await api.get<Tenant>(`/tenants/${tenantId}`)
      tenant.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch tenant'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function switchTenant(tenantId: string): Promise<void> {
    switchingTenant.value = true
    error.value = null

    try {
      // Update tenant ID in API service and localStorage
      api.setTenantId(tenantId)
      
      // Fetch the new tenant data
      await fetchCurrentTenant()
      
      // TODO: You might want to refresh user permissions/roles for the new tenant
      // This could involve calling a method from the auth store
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to switch tenant'
      // Revert tenant ID if switch failed
      const previousTenantId = tenant.value?.id
      if (previousTenantId) {
        api.setTenantId(previousTenantId)
      }
      throw err
    } finally {
      switchingTenant.value = false
    }
  }

  async function updateTenantSettings(settings: Partial<TenantSettings>): Promise<void> {
    if (!tenant.value) {
      throw new Error('No tenant selected')
    }

    loading.value = true
    error.value = null

    try {
      const response = await api.patch<Tenant>(`/tenants/${tenant.value.id}/settings`, settings)
      tenant.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update tenant settings'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTenant(updates: Partial<Tenant>): Promise<void> {
    if (!tenant.value) {
      throw new Error('No tenant selected')
    }

    loading.value = true
    error.value = null

    try {
      const response = await api.patch<Tenant>(`/tenants/${tenant.value.id}`, updates)
      tenant.value = response.data
      
      // Update tenant in list if it exists
      const tenantIndex = tenants.value.findIndex(t => t.id === tenant.value!.id)
      if (tenantIndex !== -1) {
        tenants.value[tenantIndex] = tenant.value
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update tenant'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function uploadLogo(file: File): Promise<void> {
    if (!tenant.value) {
      throw new Error('No tenant selected')
    }

    loading.value = true
    error.value = null

    try {
      const response = await api.upload<{ logoUrl: string }>(
        `/tenants/${tenant.value.id}/logo`,
        file
      )
      
      // Update tenant with new logo URL
      if (tenant.value.settings) {
        tenant.value.settings.branding = {
          ...tenant.value.settings.branding,
          logo: response.data.logoUrl
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to upload logo'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getSubscriptionUsage(): Promise<Record<string, number>> {
    if (!tenant.value) {
      throw new Error('No tenant selected')
    }

    try {
      const response = await api.get<Record<string, number>>(
        `/tenants/${tenant.value.id}/subscription/usage`
      )
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch subscription usage'
      throw err
    }
  }

  function initializeTenant(): void {
    const tenantId = localStorage.getItem('tenant_id')
    
    if (tenantId) {
      fetchCurrentTenant().catch(err => {
        console.warn('Failed to fetch tenant on initialization:', err)
        clearTenant()
      })
    }
  }

  function clearTenant(): void {
    tenant.value = null
    tenants.value = []
    error.value = null
    localStorage.removeItem('tenant_id')
  }

  function setTenant(newTenant: Tenant): void {
    tenant.value = newTenant
    api.setTenantId(newTenant.id)
  }

  function getSettingValue(path: string, defaultValue: any = null): any {
    if (!tenantSettings.value) return defaultValue
    
    const keys = path.split('.')
    let current: any = tenantSettings.value
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        return defaultValue
      }
    }
    
    return current ?? defaultValue
  }

  return {
    // State
    tenant,
    tenants,
    loading,
    error,
    switchingTenant,

    // Getters
    currentTenantId,
    isActive,
    subscriptionStatus,
    isSubscriptionActive,
    availableFeatures,
    subscriptionLimits,
    tenantSettings,
    hasFeature,
    isWithinLimit,
    displayName,

    // Actions
    fetchTenants,
    fetchCurrentTenant,
    switchTenant,
    updateTenantSettings,
    updateTenant,
    uploadLogo,
    getSubscriptionUsage,
    initializeTenant,
    clearTenant,
    setTenant,
    getSettingValue
  }
})