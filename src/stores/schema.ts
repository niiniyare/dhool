import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DocumentSchema } from '@/types/schema'

export const useSchemaStore = defineStore('schema', () => {
  const schemas = ref<Map<string, DocumentSchema>>(new Map())
  const isLoading = ref<Map<string, boolean>>(new Map())
  const errors = ref<Map<string, string>>(new Map())

  const getSchema = computed(() => (doctype: string): DocumentSchema | null => {
    return schemas.value.get(doctype) || null
  })

  const isSchemaLoading = computed(() => (doctype: string): boolean => {
    return isLoading.value.get(doctype) || false
  })

  const getSchemaError = computed(() => (doctype: string): string | null => {
    return errors.value.get(doctype) || null
  })

  async function loadSchema(doctype: string): Promise<DocumentSchema | null> {
    if (schemas.value.has(doctype)) {
      return schemas.value.get(doctype) || null
    }

    isLoading.value.set(doctype, true)
    errors.value.delete(doctype)

    try {
      const module = await import(`@/schemas/documents/${doctype}.json`)
      const schema = module.default as DocumentSchema
      
      schemas.value.set(doctype, schema)
      return schema
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load schema'
      errors.value.set(doctype, errorMessage)
      return null
    } finally {
      isLoading.value.set(doctype, false)
    }
  }

  async function preloadSchemas(doctypes: string[]): Promise<void> {
    await Promise.allSettled(
      doctypes.map(doctype => loadSchema(doctype))
    )
  }

  function clearSchemaCache(doctype?: string): void {
    if (doctype) {
      schemas.value.delete(doctype)
      isLoading.value.delete(doctype)
      errors.value.delete(doctype)
    } else {
      schemas.value.clear()
      isLoading.value.clear()
      errors.value.clear()
    }
  }

  function getCachedSchemas(): string[] {
    return Array.from(schemas.value.keys())
  }

  return {
    schemas: computed(() => schemas.value),
    getSchema,
    isSchemaLoading,
    getSchemaError,
    loadSchema,
    preloadSchemas,
    clearSchemaCache,
    getCachedSchemas
  }
})