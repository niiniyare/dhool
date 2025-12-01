import { computed, type ComputedRef } from 'vue'
import { useAccessStore, type FieldAccess, type SubscriptionInfo } from '@/stores/access'
import type { CrudAction } from '@/types/access'

/**
 * Composable for handling access control throughout the application
 * Provides permission checking for documents, fields, and modules
 */
export function useAccess() {
  const accessStore = useAccessStore()

  /**
   * Check if user can create documents of the given type
   */
  const canCreate = (docType: string): boolean => {
    return accessStore.hasPermission(docType, 'create')
  }

  /**
   * Check if user can read documents of the given type
   */
  const canRead = (docType: string): boolean => {
    return accessStore.hasPermission(docType, 'read')
  }

  /**
   * Check if user can update documents of the given type
   */
  const canUpdate = (docType: string): boolean => {
    return accessStore.hasPermission(docType, 'update')
  }

  /**
   * Check if user can delete documents of the given type
   */
  const canDelete = (docType: string): boolean => {
    return accessStore.hasPermission(docType, 'delete')
  }

  /**
   * Get field-level access permissions for a specific field in a document type
   */
  const canAccessField = (docType: string, field: string): FieldAccess => {
    return accessStore.getFieldAccess(docType, field)
  }

  /**
   * Check if user has access to a specific module
   */
  const hasModule = (moduleId: string): boolean => {
    return accessStore.canAccessModule(moduleId)
  }

  /**
   * Reactive subscription information
   */
  const subscription: ComputedRef<SubscriptionInfo> = computed(() => {
    return accessStore.subscription || {
      plan: {
        id: '',
        name: 'Free',
        modules: [],
        limits: {},
        features: []
      },
      status: 'inactive',
      usage: {}
    }
  })

  /**
   * Check multiple permissions at once for a document type
   */
  const getDocumentPermissions = (docType: string) => {
    return {
      canCreate: canCreate(docType),
      canRead: canRead(docType),
      canUpdate: canUpdate(docType),
      canDelete: canDelete(docType)
    }
  }

  /**
   * Check if user can perform any CRUD action on a document type
   */
  const hasAnyPermission = (docType: string): boolean => {
    const permissions = getDocumentPermissions(docType)
    return Object.values(permissions).some(permission => permission)
  }

  /**
   * Filter a list of actions based on user permissions
   */
  const filterActions = (docType: string, actions: string[]): string[] => {
    const actionMap: Record<string, () => boolean> = {
      'create': () => canCreate(docType),
      'read': () => canRead(docType),
      'update': () => canUpdate(docType),
      'delete': () => canDelete(docType),
      'edit': () => canUpdate(docType),
      'view': () => canRead(docType)
    }

    return actions.filter(action => {
      const checker = actionMap[action.toLowerCase()]
      return checker ? checker() : true // Allow non-CRUD actions by default
    })
  }

  return {
    // Primary permission methods
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canAccessField,
    hasModule,
    subscription,

    // Additional utility methods
    getDocumentPermissions,
    hasAnyPermission,
    filterActions,

    // Store access for advanced usage
    store: accessStore
  }
}