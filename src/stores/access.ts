import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {
  Permission,
  SubscriptionPlan,
  UserRole,
  ABACPolicy,
  CrudAction,
  DataScope
} from '@/types/access'
import { AccessService } from '@/services/access'

// Additional types for the store
export interface SubscriptionInfo {
  plan: SubscriptionPlan
  status: 'active' | 'inactive' | 'expired'
  expiresAt?: string
  usage: Record<string, number>
}

export interface FieldAccess {
  readable: boolean
  writable: boolean
  required: boolean
}

export const useAccessStore = defineStore('access', () => {
  // State
  const subscription = ref<SubscriptionInfo | null>(null)
  const roles = ref<UserRole[]>([])
  const policies = ref<ABACPolicy[]>([])
  const permissions = ref<Map<string, Permission>>(new Map())
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Private service instance
  let accessService: AccessService | null = null

  // Getters
  const isAdmin = computed(() => {
    return roles.value.some(role => 
      role.name === 'admin' || role.name === 'administrator'
    )
  })

  const enabledModules = computed(() => {
    return subscription.value?.plan.modules || []
  })

  const currentPlan = computed(() => {
    return subscription.value?.plan || null
  })

  // Actions
  async function loadAccessData(): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      // TODO: Replace with actual API calls
      const [subscriptionData, rolesData, policiesData] = await Promise.all([
        // api.get('/user/subscription'),
        // api.get('/user/roles'),
        // api.get('/user/policies')
        Promise.resolve(null), // Placeholder
        Promise.resolve([]), // Placeholder
        Promise.resolve([]) // Placeholder
      ])

      subscription.value = subscriptionData
      roles.value = rolesData
      policies.value = policiesData

      // Initialize access service if we have valid subscription data
      if (subscription.value && roles.value.length > 0) {
        accessService = new AccessService({
          userId: '', // TODO: Get from auth store
          roles: roles.value,
          subscription: subscription.value.plan,
          userAttributes: {} // TODO: Get from auth store
        })
      }

      // Build permissions map for quick access
      buildPermissionsMap()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load access data'
      throw err
    } finally {
      loading.value = false
    }
  }

  function hasPermission(docType: string, action: CrudAction): boolean {
    const key = `${docType}.${action}`
    const permission = permissions.value.get(key)
    
    if (permission) {
      return permission.allowed
    }

    // Fallback to access service if available
    if (accessService) {
      const permission = accessService.checkPermission(docType, action)
      permissions.value.set(key, permission)
      return permission.allowed
    }

    return false
  }

  function canAccessModule(moduleId: string): boolean {
    if (!subscription.value) {
      return false
    }

    return enabledModules.value.includes(moduleId)
  }

  function getFieldAccess(docType: string, fieldName: string): FieldAccess {
    const defaultAccess: FieldAccess = {
      readable: false,
      writable: false,
      required: false
    }

    if (!accessService) {
      return defaultAccess
    }

    // Find field policies for this doctype and field
    const fieldPolicies = policies.value.filter(
      policy => policy.docType === docType && policy.field === fieldName
    )

    if (fieldPolicies.length === 0) {
      return {
        readable: true,
        writable: hasPermission(docType, 'update'),
        required: false
      }
    }

    const readable = fieldPolicies.some(policy => {
      if (policy.access === 'none') {
        return !accessService!.evaluateABAC(policy)
      }
      return policy.access === 'read' && accessService!.evaluateABAC(policy)
    })

    const writable = fieldPolicies.some(policy => 
      policy.access === 'write' && accessService!.evaluateABAC(policy)
    )

    return {
      readable,
      writable,
      required: false // Field schema would determine if required
    }
  }

  function getDataScope(docType: string): DataScope {
    if (!accessService) {
      return 'own'
    }
    return accessService.getDataScope(docType)
  }

  function updateContext(updates: {
    currentRecord?: Record<string, any>
    userAttributes?: Record<string, any>
  }): void {
    if (accessService) {
      accessService.updateContext(updates)
    }
  }

  function clearAccess(): void {
    subscription.value = null
    roles.value = []
    policies.value = []
    permissions.value.clear()
    accessService = null
    error.value = null
  }

  // Helper function to build permissions map
  function buildPermissionsMap(): void {
    permissions.value.clear()
    
    if (!accessService) {
      return
    }

    // Pre-compute common permissions for performance
    const commonDocTypes = ['user', 'role', 'company', 'project', 'task']
    const commonActions: CrudAction[] = ['create', 'read', 'update', 'delete']

    for (const docType of commonDocTypes) {
      for (const action of commonActions) {
        const permission = accessService.checkPermission(docType, action)
        permissions.value.set(`${docType}.${action}`, permission)
      }
    }
  }

  return {
    // State
    subscription,
    roles,
    policies,
    permissions,
    loading,
    error,

    // Getters
    isAdmin,
    enabledModules,
    currentPlan,

    // Actions
    loadAccessData,
    hasPermission,
    canAccessModule,
    getFieldAccess,
    getDataScope,
    updateContext,
    clearAccess
  }
})