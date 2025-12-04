/**
 * Access control service for Dhool ERP system
 * Implements three-layer access control: Subscription, Role permissions, and ABAC field policies
 */

import type {
  AccessContext,
  SubscriptionPlan,
  UserRole,
  ABACPolicy,
  ABACCondition,
  Permission,
  FieldAccess,
  DocumentAccess,
  CrudAction,
  DataScope,
  ModuleAccess
} from '@/types/access'

export class AccessService {
  private subscriptionPlans: Map<string, SubscriptionPlan> = new Map()
  private userRoles: Map<string, UserRole> = new Map()
  private abacPolicies: Map<string, ABACPolicy[]> = new Map()
  private moduleConfig: Map<string, ModuleAccess> = new Map()

  /**
   * Layer 1: Check subscription-level access
   * Verifies if the user's subscription plan includes the required module/feature
   */
  checkSubscription(context: AccessContext, moduleId: string, feature?: string): boolean {
    const { subscription } = context
    
    if (subscription.status !== 'active') {
      return false
    }

    const plan = subscription.plan
    
    // Check module access
    if (!plan.modules.includes(moduleId)) {
      return false
    }

    // Check feature access if specified
    if (feature && !plan.features.includes(feature)) {
      return false
    }

    // Check usage limits
    if (plan.limits) {
      const usage = subscription.usage
      
      if (plan.limits.users && usage.users >= plan.limits.users) {
        return false
      }
      
      if (plan.limits.documents && usage.documents >= plan.limits.documents) {
        return false
      }
      
      if (plan.limits.apiCalls && usage.apiCalls >= plan.limits.apiCalls) {
        return false
      }
    }

    return true
  }

  /**
   * Layer 2: Check role-based permissions with data scope
   * Evaluates CRUD permissions and data access scope based on user roles
   */
  checkPermission(context: AccessContext, docType: string, action: CrudAction): {
    allowed: boolean
    scope: DataScope
    conditions?: Record<string, any>
  } {
    const { user, document } = context
    let highestScope: DataScope = 'own'
    let allowed = false
    let conditions: Record<string, any> = {}

    // Evaluate permissions from all user roles
    for (const roleId of user.roles) {
      const role = this.userRoles.get(roleId)
      if (!role) continue

      const permissions = role.permissions[docType] || []
      
      for (const permission of permissions) {
        if (permission.action === action && permission.allowed) {
          allowed = true
          
          // Use the highest scope available
          if (this.getScopeLevel(permission.scope) > this.getScopeLevel(highestScope)) {
            highestScope = permission.scope
          }
          
          // Merge conditions
          if (permission.conditions) {
            conditions = { ...conditions, ...permission.conditions }
          }
        }
      }
    }

    // Apply scope filtering
    if (allowed && document) {
      allowed = this.checkScopeAccess(context, document, highestScope)
    }

    return {
      allowed,
      scope: highestScope,
      conditions: Object.keys(conditions).length > 0 ? conditions : undefined
    }
  }

  /**
   * Layer 3: Evaluate ABAC field-level policies
   * Applies attribute-based access control for fine-grained field permissions
   */
  evaluateABAC(context: AccessContext, docType: string, field: string): FieldAccess {
    const policies = this.abacPolicies.get(`${docType}.${field}`) || []
    const fieldAccess: FieldAccess = {
      readable: false,
      writable: false,
      required: false
    }

    // Sort policies by priority (higher priority first)
    const sortedPolicies = policies
      .filter(policy => policy.active !== false)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    for (const policy of sortedPolicies) {
      if (this.evaluateConditions(context, policy.conditions)) {
        switch (policy.access) {
          case 'read':
            fieldAccess.readable = true
            break
          case 'write':
            fieldAccess.readable = true
            fieldAccess.writable = true
            break
          case 'none':
            fieldAccess.readable = false
            fieldAccess.writable = false
            break
        }
        
        // Set policy as source
        fieldAccess.source = policy.name
        fieldAccess.conditions = policy.conditions
        
        // Higher priority policy wins
        break
      }
    }

    return fieldAccess
  }

  /**
   * Filter document fields based on access permissions
   * Returns only fields the user can access with their permission levels
   */
  filterFields(context: AccessContext, docType: string, fields: string[], mode: 'read' | 'write' = 'read'): string[] {
    return fields.filter(field => {
      const access = this.evaluateABAC(context, docType, field)
      return mode === 'read' ? access.readable : access.writable
    })
  }

  /**
   * Filter actions based on user permissions
   * Returns only actions the user is authorized to perform
   */
  filterActions(context: AccessContext, docType: string, actions: string[]): string[] {
    const crudActions: Record<string, CrudAction> = {
      'create': 'create',
      'read': 'read',
      'view': 'read',
      'edit': 'update',
      'update': 'update',
      'delete': 'delete',
      'remove': 'delete'
    }

    return actions.filter(action => {
      const crudAction = crudActions[action.toLowerCase()]
      
      if (crudAction) {
        const permission = this.checkPermission(context, docType, crudAction)
        return permission.allowed
      }
      
      // Allow non-CRUD actions by default (can be customized)
      return true
    })
  }

  /**
   * Get complete document access information
   * Returns comprehensive access details for a document
   */
  getDocumentAccess(context: AccessContext, docType: string, fields: string[]): DocumentAccess {
    const permissions: Record<CrudAction, boolean> = {
      create: this.checkPermission(context, docType, 'create').allowed,
      read: this.checkPermission(context, docType, 'read').allowed,
      update: this.checkPermission(context, docType, 'update').allowed,
      delete: this.checkPermission(context, docType, 'delete').allowed
    }

    const scope = this.checkPermission(context, docType, 'read').scope

    const fieldAccess: Record<string, FieldAccess> = {}
    for (const field of fields) {
      fieldAccess[field] = this.evaluateABAC(context, docType, field)
    }

    const availableActions = this.filterActions(context, docType, [
      'create', 'read', 'update', 'delete', 'export', 'print'
    ])

    return {
      permissions,
      scope,
      fields: fieldAccess,
      actions: availableActions,
      conditional: Object.values(fieldAccess).some(access => !!access.conditions)
    }
  }

  /**
   * Check if user has access to a module
   */
  hasModuleAccess(context: AccessContext, moduleId: string): boolean {
    // Check subscription first
    if (!this.checkSubscription(context, moduleId)) {
      return false
    }

    // Check module configuration
    const moduleAccess = this.moduleConfig.get(moduleId)
    if (moduleAccess && !moduleAccess.available) {
      return false
    }

    return true
  }

  /**
   * Load subscription plans
   */
  loadSubscriptionPlans(plans: SubscriptionPlan[]): void {
    this.subscriptionPlans.clear()
    for (const plan of plans) {
      this.subscriptionPlans.set(plan.id, plan)
    }
  }

  /**
   * Load user roles
   */
  loadUserRoles(roles: UserRole[]): void {
    this.userRoles.clear()
    for (const role of roles) {
      this.userRoles.set(role.id, role)
    }
  }

  /**
   * Load ABAC policies
   */
  loadABACPolicies(policies: ABACPolicy[]): void {
    this.abacPolicies.clear()
    for (const policy of policies) {
      const key = `${policy.docType}.${policy.field}`
      if (!this.abacPolicies.has(key)) {
        this.abacPolicies.set(key, [])
      }
      this.abacPolicies.get(key)!.push(policy)
    }
  }

  /**
   * Load module configuration
   */
  loadModuleConfig(modules: ModuleAccess[]): void {
    this.moduleConfig.clear()
    for (const module of modules) {
      this.moduleConfig.set(module.moduleId, module)
    }
  }

  /**
   * Private helper: Get numeric scope level for comparison
   */
  private getScopeLevel(scope: DataScope): number {
    const levels = { own: 1, team: 2, department: 3, all: 4 }
    return levels[scope] || 1
  }

  /**
   * Private helper: Check if user has access to document based on scope
   */
  private checkScopeAccess(context: AccessContext, document: any, scope: DataScope): boolean {
    const { user } = context

    switch (scope) {
      case 'own':
        return document.owner === user.id
      case 'team':
        return document.team === user.team || document.owner === user.id
      case 'department':
        return document.department === user.department || 
               document.team === user.team || 
               document.owner === user.id
      case 'all':
        return true
      default:
        return false
    }
  }

  /**
   * Private helper: Evaluate ABAC conditions
   */
  private evaluateConditions(context: AccessContext, conditions: ABACCondition[]): boolean {
    if (!conditions.length) return true

    return conditions.every(condition => this.evaluateCondition(context, condition))
  }

  /**
   * Private helper: Evaluate single ABAC condition
   */
  private evaluateCondition(context: AccessContext, condition: ABACCondition): boolean {
    const { user, document } = context
    
    // Get attribute value from context
    let attributeValue: any
    
    if (condition.attribute.startsWith('user.')) {
      const userAttr = condition.attribute.substring(5)
      attributeValue = user.attributes?.[userAttr] || (user as any)[userAttr]
    } else if (condition.attribute.startsWith('document.')) {
      const docAttr = condition.attribute.substring(9)
      attributeValue = document?.data?.[docAttr] || (document as any)?.[docAttr]
    } else {
      attributeValue = (context as any)[condition.attribute]
    }

    // Evaluate condition based on operator
    switch (condition.operator) {
      case '=':
        return attributeValue === condition.value
      case '!=':
        return attributeValue !== condition.value
      case '>':
        return attributeValue > condition.value
      case '<':
        return attributeValue < condition.value
      case '>=':
        return attributeValue >= condition.value
      case '<=':
        return attributeValue <= condition.value
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(attributeValue)
      case 'not_in':
        return Array.isArray(condition.value) && !condition.value.includes(attributeValue)
      case 'contains':
        return String(attributeValue).includes(String(condition.value))
      case 'startswith':
        return String(attributeValue).startsWith(String(condition.value))
      case 'endswith':
        return String(attributeValue).endsWith(String(condition.value))
      case 'regex':
        return new RegExp(String(condition.value)).test(String(attributeValue))
      default:
        return false
    }
  }
}

// Export singleton instance
export const accessService = new AccessService()