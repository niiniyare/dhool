import { ref, computed, toValue, type MaybeRef, type Ref } from 'vue'
import { useSchema } from '@/composables/useSchema'
import { useAccess } from '@/composables/useAccess'
import { api } from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

export interface ListParams {
  page?: number
  limit?: number
  search?: string
  filters?: Record<string, any>
  sort?: string
  order?: 'asc' | 'desc'
}

export interface CrudOperations<T> {
  items: Ref<T[]>
  loading: Ref<boolean>
  selectedItem: Ref<T | null>
  totalItems: Ref<number>
  currentPage: Ref<number>
  hasNext: Ref<boolean>
  hasPrev: Ref<boolean>
  
  // List operations
  fetchList: (params?: ListParams) => Promise<void>
  
  // Single item operations
  fetchOne: (id: string) => Promise<T>
  
  // Mutations
  create: (data: Partial<T>) => Promise<T>
  update: (id: string, data: Partial<T>) => Promise<T>
  remove: (id: string) => Promise<void>
  
  // Bulk operations
  bulkDelete: (ids: string[]) => Promise<void>
  
  // Utilities
  refresh: () => Promise<void>
  reset: () => void
  selectItem: (item: T | null) => void
  canPerform: (action: 'create' | 'read' | 'update' | 'delete') => boolean
}

export function useCrud<T extends { id: string }>(docType: MaybeRef<string>): CrudOperations<T> {
  const { schema, loading: schemaLoading } = useSchema(docType)
  const { canCreate, canRead, canUpdate, canDelete } = useAccess()
  
  // State
  const items = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const selectedItem = ref<T | null>(null) as Ref<T | null>
  const totalItems = ref(0)
  const currentPage = ref(1)
  const hasNext = ref(false)
  const hasPrev = ref(false)
  const lastParams = ref<ListParams>({})

  // Get API endpoint from schema
  const getEndpoint = (path: string = '') => {
    const currentSchema = schema.value
    if (!currentSchema?.api?.baseEndpoint) {
      throw new Error(`No API endpoint configured for doctype: ${toValue(docType)}`)
    }
    return `${currentSchema.api.baseEndpoint}${path}`
  }

  // Check permissions
  const canPerform = (action: 'create' | 'read' | 'update' | 'delete'): boolean => {
    const docTypeValue = toValue(docType)
    if (!docTypeValue) return false

    switch (action) {
      case 'create':
        return canCreate(docTypeValue)
      case 'read':
        return canRead(docTypeValue)
      case 'update':
        return canUpdate(docTypeValue)
      case 'delete':
        return canDelete(docTypeValue)
      default:
        return false
    }
  }

  // List operations
  const fetchList = async (params: ListParams = {}): Promise<void> => {
    if (!canPerform('read')) {
      throw new Error('No permission to read documents')
    }

    loading.value = true
    lastParams.value = params

    try {
      const response = await api.getPaginated<T>(getEndpoint(), {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search,
        ...params.filters,
        sort: params.sort,
        order: params.order
      })

      const { data, pagination } = response.data
      items.value = data
      totalItems.value = pagination.total
      currentPage.value = pagination.page
      hasNext.value = pagination.hasNext
      hasPrev.value = pagination.hasPrev
    } catch (error) {
      console.error('Failed to fetch items:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Single item operations
  const fetchOne = async (id: string): Promise<T> => {
    if (!canPerform('read')) {
      throw new Error('No permission to read documents')
    }

    try {
      const response = await api.get<T>(getEndpoint(`/${id}`))
      return response.data
    } catch (error) {
      console.error(`Failed to fetch item ${id}:`, error)
      throw error
    }
  }

  // Create operation
  const create = async (data: Partial<T>): Promise<T> => {
    if (!canPerform('create')) {
      throw new Error('No permission to create documents')
    }

    try {
      const response = await api.post<T>(getEndpoint(), data)
      const newItem = response.data
      
      // Add to local items if we're showing the first page
      if (currentPage.value === 1) {
        items.value.unshift(newItem)
        totalItems.value += 1
      }
      
      return newItem
    } catch (error) {
      console.error('Failed to create item:', error)
      throw error
    }
  }

  // Update operation
  const update = async (id: string, data: Partial<T>): Promise<T> => {
    if (!canPerform('update')) {
      throw new Error('No permission to update documents')
    }

    try {
      const response = await api.put<T>(getEndpoint(`/${id}`), data)
      const updatedItem = response.data
      
      // Update local item if it exists in current items
      const itemIndex = items.value.findIndex(item => item.id === id)
      if (itemIndex !== -1) {
        items.value[itemIndex] = updatedItem
      }
      
      // Update selected item if it's the same
      if (selectedItem.value?.id === id) {
        selectedItem.value = updatedItem
      }
      
      return updatedItem
    } catch (error) {
      console.error(`Failed to update item ${id}:`, error)
      throw error
    }
  }

  // Delete operation
  const remove = async (id: string): Promise<void> => {
    if (!canPerform('delete')) {
      throw new Error('No permission to delete documents')
    }

    try {
      await api.delete(getEndpoint(`/${id}`))
      
      // Remove from local items
      const itemIndex = items.value.findIndex(item => item.id === id)
      if (itemIndex !== -1) {
        items.value.splice(itemIndex, 1)
        totalItems.value -= 1
      }
      
      // Clear selected item if it was deleted
      if (selectedItem.value?.id === id) {
        selectedItem.value = null
      }
    } catch (error) {
      console.error(`Failed to delete item ${id}:`, error)
      throw error
    }
  }

  // Bulk delete operation
  const bulkDelete = async (ids: string[]): Promise<void> => {
    if (!canPerform('delete')) {
      throw new Error('No permission to delete documents')
    }

    if (ids.length === 0) return

    try {
      await api.post(getEndpoint('/bulk-delete'), { ids })
      
      // Remove items from local state
      items.value = items.value.filter(item => !ids.includes(item.id))
      totalItems.value -= ids.length
      
      // Clear selected item if it was deleted
      if (selectedItem.value && ids.includes(selectedItem.value.id)) {
        selectedItem.value = null
      }
    } catch (error) {
      console.error('Failed to bulk delete items:', error)
      throw error
    }
  }

  // Utility functions
  const refresh = async (): Promise<void> => {
    await fetchList(lastParams.value)
  }

  const reset = (): void => {
    items.value = []
    selectedItem.value = null
    totalItems.value = 0
    currentPage.value = 1
    hasNext.value = false
    hasPrev.value = false
    lastParams.value = {}
  }

  const selectItem = (item: T | null): void => {
    selectedItem.value = item
  }

  // Computed properties
  const isLoading = computed(() => loading.value || schemaLoading.value)

  return {
    // State
    items,
    loading: isLoading,
    selectedItem,
    totalItems,
    currentPage,
    hasNext,
    hasPrev,
    
    // Operations
    fetchList,
    fetchOne,
    create,
    update,
    remove,
    bulkDelete,
    
    // Utilities
    refresh,
    reset,
    selectItem,
    canPerform
  }
}

export type UseCrudReturn<T extends { id: string }> = ReturnType<typeof useCrud<T>>