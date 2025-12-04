import { api } from './api'
import type { 
  DocumentSchema, 
  FieldSchema, 
  DependencyConfig,
  FieldType 
} from '@/types/schema'

interface SchemaCache {
  data: DocumentSchema
  timestamp: number
  ttl: number
}

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
    if (!s.api || typeof s.api !== 'object' || !(s.api as any).baseEndpoint) {
      return false
    }

    // Validate listView
    if (!s.listView || typeof s.listView !== 'object') {
      return false
    }
    
    const listView = s.listView as any
    if (!Array.isArray(listView.columns)) {
      return false
    }

    // Validate formView
    if (!s.formView || typeof s.formView !== 'object') {
      return false
    }
    
    const formView = s.formView as any
    if (!Array.isArray(formView.sections) || !Array.isArray(formView.fields)) {
      return false
    }

    // Validate each field schema
    for (const field of formView.fields) {
      if (!this.validateFieldSchema(field)) {
        console.warn(`Invalid field schema for ${field.name || 'unknown'}`)
        return false
      }
    }

    return true
  }

  generateDefaults(schema: DocumentSchema): Record<string, unknown> {
    const defaults: Record<string, unknown> = {}

    for (const field of schema.formView.fields) {
      if (field.default !== undefined) {
        defaults[field.name] = field.default
      } else {
        defaults[field.name] = this.getFieldTypeDefault(field.type)
      }
    }

    return defaults
  }

  getFieldDependencies(field: FieldSchema): DependencyConfig[] {
    return field.depends || []
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
      'boolean', 'select', 'multiselect', 'file', 'image', 'currency', 'json',
      'time', 'percent', 'autocomplete', 'link', 'table', 'color', 'rating',
      'slider', 'editor', 'code'
    ]
    
    if (!validTypes.includes(f.type as FieldType)) {
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
    if (f.depends && Array.isArray(f.depends)) {
      for (const dep of f.depends) {
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

    if (!d.field || !d.operator || !d.action) {
      return false
    }

    const validOperators = ['=', '!=', '>', '<', '>=', '<=', 'in', 'not_in', 'contains']
    const validActions = ['show', 'hide', 'require', 'optional', 'readonly', 'editable']

    return validOperators.includes(d.operator as string) && validActions.includes(d.action as string)
  }

  private getFieldTypeDefault(type: FieldType): unknown {
    switch (type) {
      case 'text':
      case 'textarea':
      case 'email':
      case 'password':
      case 'color':
      case 'editor':
      case 'code':
        return ''
      case 'number':
      case 'currency':
      case 'percent':
      case 'rating':
      case 'slider':
        return 0
      case 'boolean':
        return false
      case 'date':
      case 'datetime':
      case 'time':
        return null
      case 'select':
      case 'autocomplete':
      case 'link':
        return null
      case 'multiselect':
        return []
      case 'file':
      case 'image':
        return null
      case 'json':
      case 'table':
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