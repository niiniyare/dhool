/**
 * Access control composable for Dhool ERP system
 * Provides reactive access control functionality with CRUD permissions and field-level access
 */

import { ref, computed, type Ref } from 'vue'
import { accessService } from '@/services/access'
import type {
  AccessContext,
  SubscriptionPlan,
  CrudAction,
  FieldAccess,
  DocumentAccess,
  ModuleAccess
} from '@/types/access'

// Global reactive state
const currentContext = ref<AccessContext | null>(null)
const subscription = ref<SubscriptionPlan | null>(null)

export function useAccess() {
  /**
   * Set the current access context (user, subscription, document)
   */
  const setContext = (context: AccessContext) => {
    currentContext.value = context
    subscription.value = context.subscription.plan
  }

  /**
   * Check if user can perform a CRUD action on a document type
   */
  const canCreate = computed(() => (docType: string) => {
    if (!currentContext.value) return false
    return accessService.checkPermission(currentContext.value, docType, 'create').allowed
  })

  const canRead = computed(() => (docType: string) => {
    if (!currentContext.value) return false
    return accessService.checkPermission(currentContext.value, docType, 'read').allowed
  })

  const canUpdate = computed(() => (docType: string) => {
    if (!currentContext.value) return false
    return accessService.checkPermission(currentContext.value, docType, 'update').allowed
  })

  const canDelete = computed(() => (docType: string) => {
    if (!currentContext.value) return false
    return accessService.checkPermission(currentContext.value, docType, 'delete').allowed
  })

  /**
   * Check if user can access a specific field
   */
  const canAccessField = computed(() => (docType: string, field: string, mode: 'read' | 'write' = 'read') => {
    if (!currentContext.value) return false
    
    const fieldAccess = accessService.evaluateABAC(currentContext.value, docType, field)
    return mode === 'read' ? fieldAccess.readable : fieldAccess.writable
  })

  /**
   * Check if user has access to a module
   */
  const hasModule = computed(() => (moduleId: string) => {
    if (!currentContext.value) return false
    return accessService.hasModuleAccess(currentContext.value, moduleId)
  })

  /**
   * Get field access details for a specific field
   */
  const getFieldAccess = (docType: string, field: string): FieldAccess | null => {
    if (!currentContext.value) return null
    return accessService.evaluateABAC(currentContext.value, docType, field)
  }

  /**
   * Get complete document access information
   */
  const getDocumentAccess = (docType: string, fields: string[]): DocumentAccess | null => {
    if (!currentContext.value) return null
    return accessService.getDocumentAccess(currentContext.value, docType, fields)
  }

  /**
   * Filter fields based on access permissions
   */
  const filterFields = (docType: string, fields: string[], mode: 'read' | 'write' = 'read'): string[] => {
    if (!currentContext.value) return []
    return accessService.filterFields(currentContext.value, docType, fields, mode)
  }

  /**
   * Filter actions based on user permissions
   */
  const filterActions = (docType: string, actions: string[]): string[] => {
    if (!currentContext.value) return []
    return accessService.filterActions(currentContext.value, docType, actions)
  }

  /**
   * Check if user can perform a specific action
   */
  const canPerformAction = (docType: string, action: CrudAction): boolean => {
    if (!currentContext.value) return false
    return accessService.checkPermission(currentContext.value, docType, action).allowed
  }

  /**
   * Get the data scope for a specific action
   */
  const getDataScope = (docType: string, action: CrudAction) => {
    if (!currentContext.value) return 'own'
    return accessService.checkPermission(currentContext.value, docType, action).scope
  }

  /**
   * Check subscription plan access
   */
  const checkSubscriptionAccess = (moduleId: string, feature?: string): boolean => {
    if (!currentContext.value) return false
    return accessService.checkSubscription(currentContext.value, moduleId, feature)
  }

  /**
   * Initialize access service with configuration data
   */
  const loadAccessConfig = async (config: {
    subscriptionPlans?: any[]
    userRoles?: any[]
    abacPolicies?: any[]
    moduleConfig?: ModuleAccess[]
  }) => {
    if (config.subscriptionPlans) {
      accessService.loadSubscriptionPlans(config.subscriptionPlans)
    }
    if (config.userRoles) {
      accessService.loadUserRoles(config.userRoles)
    }
    if (config.abacPolicies) {
      accessService.loadABACPolicies(config.abacPolicies)
    }
    if (config.moduleConfig) {
      accessService.loadModuleConfig(config.moduleConfig)
    }
  }

  return {
    // Reactive state
    subscription: subscription as Ref<SubscriptionPlan | null>,
    
    // Context management
    setContext,
    
    // CRUD permissions (reactive)
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    
    // Field access (reactive)
    canAccessField,
    
    // Module access (reactive)
    hasModule,
    
    // Non-reactive methods for more detailed access information
    getFieldAccess,
    getDocumentAccess,
    filterFields,
    filterActions,
    canPerformAction,
    getDataScope,
    checkSubscriptionAccess,
    
    // Configuration
    loadAccessConfig
  }
}