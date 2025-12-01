import type {
  Permission,
  SubscriptionPlan,
  UserRole,
  ABACPolicy,
  ABACCondition,
  AccessContext,
  FieldSchema,
  ActionSchema,
  CrudAction,
  DataScope
} from '@/types/access'

export class AccessService {
  private context: AccessContext

  constructor(context: AccessContext) {
    this.context = context
  }

  checkSubscription(moduleId: string): boolean {
    return this.context.subscription.modules.includes(moduleId)
  }

  checkPermission(docType: string, action: CrudAction): Permission {
    const defaultPermission: Permission = {
      action,
      allowed: false,
      scope: 'own'
    }

    if (!this.context.roles.length) {
      return defaultPermission
    }

    for (const role of this.context.roles) {
      const permission = role.permissions[`${docType}.${action}`] || role.permissions[action]
      
      if (permission?.allowed) {
        return {
          ...permission,
          scope: this.getHighestScope([permission.scope, role.dataScope])
        }
      }
    }

    return defaultPermission
  }

  evaluateABAC(policy: ABACPolicy, context: AccessContext = this.context): boolean {
    if (!policy.conditions.length) {
      return true
    }

    return policy.conditions.every(condition => 
      this.evaluateCondition(condition, context)
    )
  }

  filterFields(fields: FieldSchema[], context: AccessContext = this.context): FieldSchema[] {
    return fields.filter(field => {
      if (!field.access?.length) {
        return true
      }

      return field.access.some(policy => {
        if (policy.access === 'none') {
          return !this.evaluateABAC(policy, context)
        }
        return this.evaluateABAC(policy, context)
      })
    }).map(field => ({
      ...field,
      required: this.isFieldWritable(field, context) ? field.required : false
    }))
  }

  filterActions(actions: ActionSchema[], context: AccessContext = this.context): ActionSchema[] {
    return actions.filter(action => {
      if (!action.access?.length && !action.requires?.length) {
        return true
      }

      if (action.requires?.length) {
        const hasRequiredPermissions = action.requires.every(requirement => {
          const [docType, actionType] = requirement.split('.')
          const permission = this.checkPermission(docType, actionType as CrudAction)
          return permission.allowed
        })

        if (!hasRequiredPermissions) {
          return false
        }
      }

      if (action.access?.length) {
        return action.access.some(policy => this.evaluateABAC(policy, context))
      }

      return true
    })
  }

  getDataScope(docType: string): DataScope {
    if (!this.context.roles.length) {
      return 'own'
    }

    const scopes = this.context.roles
      .map(role => {
        const permission = role.permissions[`${docType}.read`] || role.permissions.read
        return permission?.scope || role.dataScope
      })
      .filter((scope): scope is DataScope => Boolean(scope))

    return this.getHighestScope(scopes)
  }

  private evaluateCondition(condition: ABACCondition, context: AccessContext): boolean {
    const { attribute, operator, value } = condition
    const actualValue = this.getAttributeValue(attribute, context)

    switch (operator) {
      case 'eq':
        return actualValue === value
      case 'ne':
        return actualValue !== value
      case 'gt':
        return actualValue > value
      case 'lt':
        return actualValue < value
      case 'gte':
        return actualValue >= value
      case 'lte':
        return actualValue <= value
      case 'in':
        return Array.isArray(value) && value.includes(actualValue)
      case 'nin':
        return Array.isArray(value) && !value.includes(actualValue)
      case 'contains':
        return String(actualValue).toLowerCase().includes(String(value).toLowerCase())
      default:
        return false
    }
  }

  private getAttributeValue(attribute: string, context: AccessContext): any {
    const [source, ...path] = attribute.split('.')
    
    let target: any
    switch (source) {
      case 'user':
        target = context.userAttributes
        break
      case 'record':
        target = context.currentRecord
        break
      case 'subscription':
        target = context.subscription
        break
      default:
        return undefined
    }

    return path.reduce((obj, key) => obj?.[key], target)
  }

  private getHighestScope(scopes: DataScope[]): DataScope {
    const scopeHierarchy: Record<DataScope, number> = {
      own: 1,
      team: 2,
      department: 3,
      all: 4
    }

    return scopes.reduce((highest, current) => 
      scopeHierarchy[current] > scopeHierarchy[highest] ? current : highest
    , 'own')
  }

  private isFieldWritable(field: FieldSchema, context: AccessContext): boolean {
    if (!field.access?.length) {
      return true
    }

    return field.access.some(policy => 
      policy.access === 'write' && this.evaluateABAC(policy, context)
    )
  }

  updateContext(newContext: Partial<AccessContext>): void {
    this.context = { ...this.context, ...newContext }
  }

  getCurrentContext(): AccessContext {
    return { ...this.context }
  }
}