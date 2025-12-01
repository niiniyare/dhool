import { api } from './api'
import type { 
  DocumentSchema, 
  SchemaFieldSchema, 
  DependencyConfig, 
  SchemaCache,
  FieldType 
} from '@/types/schema'

export class SchemaService {
  private cache = new Map<string, SchemaCache>()
  private readonly DEFAULT_TTL = 10 * 60 * 1000 // 10 minutes in milliseconds

  async loadSchema(docType: string): Promise<DocumentSchema> {
    const cachedSchema = this.getCachedSchema(docType)
    if (cachedSchema) {
      return cachedSchema
    }

    try {
      const response = await api.get<DocumentSchema>(`/schemas/${docType}`)
      const schema = response.data
      
      this.setCachedSchema(docType, schema)
      return schema
    } catch (error) {
      console.warn(`Failed to load schema from API for ${docType}, trying local fallback:`, error)
      return this.loadLocalSchema(docType)
    }
  }

  getSchema(docType: string): DocumentSchema | null {
    const cachedSchema = this.getCachedSchema(docType)
    return cachedSchema
  }

  validateSchema(schema: unknown): boolean {
    if (!schema || typeof schema !== 'object') {
      return false
    }

    const s = schema as Record<string, unknown>

    // Check required top-level properties
    const requiredFields = ['name', 'label', 'module', 'api', 'listView', 'formView', 'access']
    if (!requiredFields.every(field => field in s)) {
      return false
    }

    // Validate API config
    if (!s.api?.baseEndpoint) {
      return false
    }

    // Validate listView
    if (!Array.isArray(s.listView?.columns) || 
        !Array.isArray(s.listView?.toolbarActions) || 
        !Array.isArray(s.listView?.rowActions)) {
      return false
    }

    // Validate formView
    if (!Array.isArray(s.formView?.sections) || 
        !s.formView?.fields || 
        typeof s.formView.fields !== 'object') {
      return false
    }

    // Validate each field schema
    for (const [fieldName, field] of Object.entries(s.formView.fields)) {
      if (!this.validateFieldSchema(field)) {
        console.warn(`Invalid field schema for ${fieldName}`)
        return false
      }
    }

    return true
  }

  generateDefaults(schema: DocumentSchema): Record<string, unknown> {
    const defaults: Record<string, unknown> = {}

    for (const [fieldName, field] of Object.entries(schema.formView.fields)) {
      if (field.defaultValue !== undefined) {
        defaults[fieldName] = field.defaultValue
      } else {
        defaults[fieldName] = this.getFieldTypeDefault(field.type)
      }
    }

    return defaults
  }

  getFieldDependencies(field: SchemaFieldSchema): DependencyConfig[] {
    return field.dependencies || []
  }

  invalidateCache(docType?: string): void {
    if (docType) {
      this.cache.delete(docType)
    } else {
      this.cache.clear()
    }
  }

  private getCachedSchema(docType: string): DocumentSchema | null {
    const cached = this.cache.get(docType)
    if (!cached) {
      return null
    }

    const now = Date.now()
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(docType)
      return null
    }

    return cached.data
  }

  private setCachedSchema(docType: string, schema: DocumentSchema, ttl?: number): void {
    this.cache.set(docType, {
      data: schema,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL
    })
  }

  private async loadLocalSchema(docType: string): Promise<DocumentSchema> {
    try {
      const response = await fetch(`/src/schemas/documents/${docType}.json`)
      if (!response.ok) {
        throw new Error(`Failed to load local schema: ${response.statusText}`)
      }
      
      const schema = await response.json()
      
      if (!this.validateSchema(schema)) {
        throw new Error(`Invalid schema format for ${docType}`)
      }

      this.setCachedSchema(docType, schema)
      return schema as DocumentSchema
    } catch (error) {
      throw new Error(`Schema not found for doctype: ${docType}. Error: ${error}`)
    }
  }

  private validateFieldSchema(field: unknown): boolean {
    if (!field || typeof field !== 'object') {
      return false
    }

    const f = field as Record<string, unknown>

    // Check required properties
    if (!f.name || !f.type || !f.label) {
      return false
    }

    // Validate field type
    const validTypes: FieldType[] = [
      'text', 'textarea', 'email', 'password', 'number', 'date', 'datetime',
      'boolean', 'select', 'multiselect', 'file', 'image', 'currency', 'json'
    ]
    
    if (!validTypes.includes(f.type)) {
      return false
    }

    // Validate select/multiselect options
    if ((f.type === 'select' || f.type === 'multiselect') && f.options) {
      if (!Array.isArray(f.options)) {
        return false
      }
      
      for (const option of f.options) {
        if (!option.label || option.value === undefined) {
          return false
        }
      }
    }

    // Validate dependencies if present
    if (f.dependencies && Array.isArray(f.dependencies)) {
      for (const dep of f.dependencies) {
        if (!this.validateDependency(dep)) {
          return false
        }
      }
    }

    return true
  }

  private validateDependency(dependency: unknown): boolean {
    if (!dependency || typeof dependency !== 'object') {
      return false
    }

    const d = dependency as Record<string, unknown>

    if (!d.field || !d.condition || !d.action) {
      return false
    }

    const validConditions = ['equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than']
    const validActions = ['show', 'hide', 'require', 'optional', 'enable', 'disable']

    return validConditions.includes(d.condition) && validActions.includes(d.action)
  }

  private getFieldTypeDefault(type: FieldType): unknown {
    switch (type) {
      case 'text':
      case 'textarea':
      case 'email':
      case 'password':
        return ''
      case 'number':
      case 'currency':
        return 0
      case 'boolean':
        return false
      case 'date':
      case 'datetime':
        return null
      case 'select':
        return null
      case 'multiselect':
        return []
      case 'file':
      case 'image':
        return null
      case 'json':
        return {}
      default:
        return null
    }
  }

  // Utility method to refresh schema from server
  async refreshSchema(docType: string): Promise<DocumentSchema> {
    this.invalidateCache(docType)
    return this.loadSchema(docType)
  }

  // Get all cached schema names
  getCachedSchemaNames(): string[] {
    return Array.from(this.cache.keys())
  }

  // Get cache stats
  getCacheStats(): { size: number; schemas: Array<{ name: string; age: number; ttl: number }> } {
    const now = Date.now()
    const schemas = Array.from(this.cache.entries()).map(([name, cached]) => ({
      name,
      age: now - cached.timestamp,
      ttl: cached.ttl
    }))

    return {
      size: this.cache.size,
      schemas
    }
  }
}

export const schemaService = new SchemaService()