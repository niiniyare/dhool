/**
 * Access control type definitions for Dhool ERP system
 * Defines permissions, roles, and access control policies
 */

/**
 * CRUD operation types
 */
export type CrudAction = 'create' | 'read' | 'update' | 'delete'

/**
 * Data access scope levels
 */
export type DataScope = 'own' | 'team' | 'department' | 'all'

/**
 * Permission status types
 */
export type PermissionStatus = 'granted' | 'denied' | 'conditional'

/**
 * Individual permission definition
 */
export interface Permission {
  /** CRUD action being permitted */
  action: CrudAction
  /** Whether permission is allowed */
  allowed: boolean
  /** Data scope for this permission */
  scope: DataScope
  /** Additional conditions for permission */
  conditions?: Record<string, any>
  /** Permission priority (higher numbers take precedence) */
  priority?: number
  /** Permission source (role, user, etc.) */
  source?: string
}

/**
 * Subscription plan configuration
 */
export interface SubscriptionPlan {
  /** Plan identifier */
  id: string
  /** Plan display name */
  name: string
  /** Plan description */
  description?: string
  /** Modules included in this plan */
  modules: string[]
  /** Feature flags enabled */
  features: string[]
  /** Usage limits */
  limits: {
    /** Maximum number of users */
    users?: number
    /** Storage limit in GB */
    storage?: number
    /** API calls per month */
    apiCalls?: number
    /** Custom fields per document */
    customFields?: number
    /** Documents per month */
    documents?: number
  }
  /** Plan pricing */
  pricing?: {
    /** Monthly price */
    monthly?: number
    /** Annual price */
    annual?: number
    /** Currency code */
    currency?: string
  }
  /** Plan tier level */
  tier: 'free' | 'starter' | 'professional' | 'enterprise'
  /** Whether plan is active */
  active?: boolean
}

/**
 * User role definition
 */
export interface UserRole {
  /** Role identifier */
  id: string
  /** Role display name */
  name: string
  /** Role description */
  description?: string
  /** Module this role belongs to */
  module?: string
  /** Role permissions by document type */
  permissions: Record<string, Permission[]>
  /** Role hierarchy level */
  level?: number
  /** Whether role is system-defined */
  system?: boolean
  /** Role inheritance */
  inherits?: string[]
  /** Role color for UI */
  color?: string
}

/**
 * ABAC condition definition
 */
export interface ABACCondition {
  /** Condition identifier */
  id: string
  /** Field or attribute to evaluate */
  attribute: string
  /** Comparison operator */
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'contains' | 'startswith' | 'endswith' | 'regex'
  /** Value to compare against */
  value: any
  /** Logical operator for combining conditions */
  logic?: 'and' | 'or'
  /** Nested conditions */
  conditions?: ABACCondition[]
}

/**
 * ABAC policy definition
 */
export interface ABACPolicy {
  /** Policy identifier */
  id: string
  /** Policy name */
  name: string
  /** Policy description */
  description?: string
  /** Document type this policy applies to */
  docType: string
  /** Field this policy applies to */
  field: string
  /** Policy conditions */
  conditions: ABACCondition[]
  /** Access level granted when conditions are met */
  access: 'read' | 'write' | 'none'
  /** Policy priority (higher numbers take precedence) */
  priority?: number
  /** Whether policy is active */
  active?: boolean
  /** Policy effective date range */
  effectiveDate?: {
    start?: string
    end?: string
  }
}

/**
 * Access evaluation context
 */
export interface AccessContext {
  /** Current user information */
  user: {
    id: string
    roles: string[]
    department?: string
    team?: string
    attributes?: Record<string, any>
  }
  /** Current subscription information */
  subscription: {
    plan: SubscriptionPlan
    status: 'active' | 'inactive' | 'expired' | 'suspended'
    usage: Record<string, number>
  }
  /** Document being accessed */
  document?: {
    id?: string
    type: string
    data?: Record<string, any>
    owner?: string
    team?: string
    department?: string
    state?: string
  }
  /** Field being accessed */
  field?: string
  /** Requested action */
  action: CrudAction
  /** Additional context */
  metadata?: Record<string, any>
  /** Request timestamp */
  timestamp?: string
  /** Request IP address */
  ip?: string
  /** User agent */
  userAgent?: string
}

/**
 * Field access information
 */
export interface FieldAccess {
  /** Whether field is readable */
  readable: boolean
  /** Whether field is writable */
  writable: boolean
  /** Whether field is required */
  required: boolean
  /** Access conditions */
  conditions?: ABACCondition[]
  /** Access source (role, policy, etc.) */
  source?: string
}

/**
 * Document access information
 */
export interface DocumentAccess {
  /** CRUD permissions */
  permissions: Record<CrudAction, boolean>
  /** Data scope */
  scope: DataScope
  /** Field-level access */
  fields: Record<string, FieldAccess>
  /** Available actions */
  actions: string[]
  /** Access conditions */
  conditions?: ABACCondition[]
  /** Whether access is conditional */
  conditional: boolean
}

/**
 * Access audit log entry
 */
export interface AccessAuditLog {
  /** Log entry ID */
  id: string
  /** User who performed the action */
  userId: string
  /** Action performed */
  action: CrudAction | 'login' | 'logout' | 'view'
  /** Resource accessed */
  resource: {
    type: 'document' | 'field' | 'action'
    id: string
    name: string
  }
  /** Access result */
  result: 'granted' | 'denied'
  /** Reason for access decision */
  reason?: string
  /** Request context */
  context: Pick<AccessContext, 'timestamp' | 'ip' | 'userAgent'>
  /** Additional metadata */
  metadata?: Record<string, any>
}

/**
 * Access rule definition
 */
export interface AccessRule {
  /** Rule identifier */
  id: string
  /** Rule name */
  name: string
  /** Rule description */
  description?: string
  /** Rule type */
  type: 'allow' | 'deny'
  /** Rule priority */
  priority: number
  /** Rule conditions */
  conditions: ABACCondition[]
  /** Rule targets */
  targets: {
    /** Document types */
    docTypes?: string[]
    /** Fields */
    fields?: string[]
    /** Actions */
    actions?: CrudAction[]
    /** Roles */
    roles?: string[]
    /** Users */
    users?: string[]
  }
  /** Rule effects */
  effects: {
    /** Permissions to grant/deny */
    permissions?: Permission[]
    /** Data scope override */
    scope?: DataScope
    /** Field access overrides */
    fieldAccess?: Record<string, Partial<FieldAccess>>
  }
  /** Whether rule is active */
  active: boolean
  /** Rule effective date range */
  effectiveDate?: {
    start?: string
    end?: string
  }
}

/**
 * Module access configuration
 */
export interface ModuleAccess {
  /** Module identifier */
  moduleId: string
  /** Module display name */
  name: string
  /** Whether module is available */
  available: boolean
  /** Module features and their availability */
  features: Record<string, boolean>
  /** Module usage limits */
  limits?: Record<string, number>
  /** Module subscription requirements */
  requirements?: {
    /** Minimum plan tier required */
    minTier?: SubscriptionPlan['tier']
    /** Required features */
    features?: string[]
  }
}

/**
 * Team access configuration
 */
export interface TeamAccess {
  /** Team identifier */
  teamId: string
  /** Team name */
  name: string
  /** Team members */
  members: string[]
  /** Team leader */
  leader?: string
  /** Team permissions */
  permissions: Record<string, Permission[]>
  /** Team data scope */
  dataScope: DataScope
  /** Team access rules */
  rules?: AccessRule[]
}

/**
 * Department access configuration
 */
export interface DepartmentAccess {
  /** Department identifier */
  departmentId: string
  /** Department name */
  name: string
  /** Department teams */
  teams: string[]
  /** Department head */
  head?: string
  /** Department permissions */
  permissions: Record<string, Permission[]>
  /** Department data scope */
  dataScope: DataScope
  /** Department access rules */
  rules?: AccessRule[]
}