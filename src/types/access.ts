export type CrudAction = 'create' | 'read' | 'update' | 'delete'
export type DataScope = 'own' | 'team' | 'department' | 'all'

export interface Permission {
  action: CrudAction
  allowed: boolean
  scope: DataScope
  conditions?: Record<string, any>
}

export interface SubscriptionPlan {
  id: string
  name: string
  modules: string[]
  limits: Record<string, number>
  features: string[]
}

export interface UserRole {
  id: string
  name: string
  permissions: Record<string, Permission>
  dataScope: DataScope
}

export interface ABACPolicy {
  id: string
  docType: string
  field: string
  conditions: ABACCondition[]
  access: 'read' | 'write' | 'none'
}

export interface ABACCondition {
  attribute: string
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'nin' | 'contains'
  value: any
}

export interface AccessContext {
  userId: string
  roles: UserRole[]
  subscription: SubscriptionPlan
  currentRecord?: Record<string, any>
  userAttributes: Record<string, any>
}

export interface FieldSchema {
  name: string
  type: string
  label: string
  required?: boolean
  access?: ABACPolicy[]
}

export interface ActionSchema {
  id: string
  label: string
  icon?: string
  requires?: string[]
  access?: ABACPolicy[]
}