import { ref, computed, toValue, type MaybeRef, type Ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useSchema } from '@/composables/useSchema'
import { useAccess } from '@/composables/useAccess'
import { api } from '@/services/api'
import type { ApiResponse, PaginatedResponse, ListParams as ApiListParams, ApiError } from '@/types/api'
import type { CrudOperations, CrudListParams } from '@/types/crud'

export function useCrud<T extends { id: string }>(docType: MaybeRef<string>): CrudOperations<T> {
  const toast = useToast()
  const { schema, loading: schemaLoading } = useSchema(docType)
  const { canCreate, canRead, canUpdate, canDelete } = useAccess()
  
  // Reactive state
  const items = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const selectedItem = ref<T | null>(null) as Ref<T | null>
  const totalItems = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(0)
  const hasNext = ref(false)
  const hasPrev = ref(false)
  const error = ref<ApiError | null>(null)
  const currentOperation = ref<'create' | 'read' | 'update' | 'delete' | 'list' | 'bulk-delete' | null>(null)
  const lastParams = ref<CrudListParams>({})

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
        return canCreate.value(docTypeValue)
      case 'read':
        return canRead.value(docTypeValue)
      case 'update':
        return canUpdate.value(docTypeValue)
      case 'delete':
        return canDelete.value(docTypeValue)
      default:
        return false
    }
  }

  // List operations
  const fetchList = async (params: CrudListParams = {}): Promise<void> => {
    if (!canPerform('read')) {
      const errorMsg = 'No permission to read documents'
      error.value = { code: 'PERMISSION_DENIED', message: errorMsg }
      toast.add({
        severity: 'error',
        summary: 'Access Denied',
        detail: errorMsg,
        life: 3000
      })
      return
    }

    loading.value = true
    error.value = null
    currentOperation.value = 'list'
    lastParams.value = params

    try {
      const apiParams: ApiListParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search,
        searchFields: params.searchFields,
        filters: params.filters,
        sort: params.sort,
        order: params.order,
        fields: params.fields,
        exclude: params.exclude,
        include: params.include
      }
      
      const response = await api.getPaginated<T>(getEndpoint(), apiParams)

      if (response.data) {
        items.value = response.data.items
        totalItems.value = response.data.total
        totalPages.value = response.data.totalPages
        currentPage.value = response.data.page
        hasNext.value = response.data.hasNext
        hasPrev.value = response.data.hasPrev
      }
    } catch (err: any) {
      const apiError = err as ApiError
      error.value = apiError
      console.error('Failed to fetch items:', apiError)
      
      toast.add({
        severity: 'error',
        summary: 'Failed to load data',
        detail: apiError.message || 'An error occurred while fetching items',
        life: 5000
      })
      
      // Reset items on error
      items.value = []
      totalItems.value = 0
      totalPages.value = 0
      hasNext.value = false
      hasPrev.value = false
    } finally {
      loading.value = false
      currentOperation.value = null
    }
  }

  // Single item operations
  const fetchOne = async (id: string): Promise<T | null> => {
    if (!canPerform('read')) {
      const errorMsg = 'No permission to read documents'
      error.value = { code: 'PERMISSION_DENIED', message: errorMsg }
      toast.add({
        severity: 'error',
        summary: 'Access Denied',
        detail: errorMsg,
        life: 3000
      })
      return null
    }

    if (!id) {
      const errorMsg = 'Item ID is required'
      error.value = { code: 'INVALID_INPUT', message: errorMsg }
      toast.add({
        severity: 'warn',
        summary: 'Invalid Input',
        detail: errorMsg,
        life: 3000
      })
      return null
    }

    loading.value = true
    error.value = null
    currentOperation.value = 'read'

    try {
      const response = await api.get<T>(getEndpoint(`/${id}`))
      return response.data || null
    } catch (err: any) {
      const apiError = err as ApiError
      error.value = apiError
      console.error(`Failed to fetch item ${id}:`, apiError)
      
      toast.add({
        severity: 'error',
        summary: 'Failed to load item',
        detail: apiError.message || `Could not load item with ID: ${id}`,
        life: 5000
      })
      
      return null
    } finally {
      loading.value = false
      currentOperation.value = null
    }
  }

  // Create operation
  const create = async (data: Partial<T>): Promise<T | null> => {
    if (!canPerform('create')) {
      const errorMsg = 'No permission to create documents'
      error.value = { code: 'PERMISSION_DENIED', message: errorMsg }
      toast.add({
        severity: 'error',
        summary: 'Access Denied',
        detail: errorMsg,
        life: 3000
      })
      return null
    }

    if (!data || Object.keys(data).length === 0) {
      const errorMsg = 'Data is required to create an item'
      error.value = { code: 'INVALID_INPUT', message: errorMsg }
      toast.add({
        severity: 'warn',
        summary: 'Invalid Input',
        detail: errorMsg,
        life: 3000
      })
      return null
    }

    loading.value = true
    error.value = null
    currentOperation.value = 'create'

    try {
      const response = await api.post<T>(getEndpoint(), data)
      const newItem = response.data
      
      if (newItem) {
        // Add to local items if we're showing the first page
        if (currentPage.value === 1) {
          items.value.unshift(newItem)
          totalItems.value += 1
        }
        
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Item created successfully',
          life: 3000
        })
      }
      
      return newItem || null
    } catch (err: any) {
      const apiError = err as ApiError
      error.value = apiError
      console.error('Failed to create item:', apiError)
      
      toast.add({
        severity: 'error',
        summary: 'Failed to create item',
        detail: apiError.message || 'An error occurred while creating the item',
        life: 5000
      })
      
      return null
    } finally {
      loading.value = false
      currentOperation.value = null
    }
  }

  // Update operation
  const update = async (id: string, data: Partial<T>): Promise<T | null> => {
    if (!canPerform('update')) {
      const errorMsg = 'No permission to update documents'
      error.value = { code: 'PERMISSION_DENIED', message: errorMsg }
      toast.add({
        severity: 'error',
        summary: 'Access Denied',
        detail: errorMsg,
        life: 3000
      })
      return null
    }

    if (!id || !data || Object.keys(data).length === 0) {
      const errorMsg = 'Item ID and data are required for update'
      error.value = { code: 'INVALID_INPUT', message: errorMsg }
      toast.add({
        severity: 'warn',
        summary: 'Invalid Input',
        detail: errorMsg,
        life: 3000
      })
      return null
    }

    loading.value = true
    error.value = null
    currentOperation.value = 'update'

    try {
      const response = await api.put<T>(getEndpoint(`/${id}`), data)
      const updatedItem = response.data
      
      if (updatedItem) {
        // Update local item if it exists in current items
        const itemIndex = items.value.findIndex(item => item.id === id)
        if (itemIndex !== -1) {
          items.value[itemIndex] = updatedItem
        }
        
        // Update selected item if it's the same
        if (selectedItem.value?.id === id) {
          selectedItem.value = updatedItem
        }
        
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Item updated successfully',
          life: 3000
        })
      }
      
      return updatedItem || null
    } catch (err: any) {
      const apiError = err as ApiError
      error.value = apiError
      console.error(`Failed to update item ${id}:`, apiError)
      
      toast.add({
        severity: 'error',
        summary: 'Failed to update item',
        detail: apiError.message || `Could not update item with ID: ${id}`,
        life: 5000
      })
      
      return null
    } finally {
      loading.value = false
      currentOperation.value = null
    }
  }

  // Delete operation
  const remove = async (id: string): Promise<boolean> => {
    if (!canPerform('delete')) {
      const errorMsg = 'No permission to delete documents'
      error.value = { code: 'PERMISSION_DENIED', message: errorMsg }
      toast.add({
        severity: 'error',
        summary: 'Access Denied',
        detail: errorMsg,
        life: 3000
      })
      return false
    }

    if (!id) {
      const errorMsg = 'Item ID is required for deletion'
      error.value = { code: 'INVALID_INPUT', message: errorMsg }
      toast.add({
        severity: 'warn',
        summary: 'Invalid Input',
        detail: errorMsg,
        life: 3000
      })
      return false
    }

    loading.value = true
    error.value = null
    currentOperation.value = 'delete'

    try {
      await api.delete(getEndpoint(`/${id}`))
      
      // Remove from local items
      const itemIndex = items.value.findIndex(item => item.id === id)
      if (itemIndex !== -1) {
        items.value.splice(itemIndex, 1)
        totalItems.value -= 1
        
        // Recalculate total pages
        const newTotalPages = Math.ceil(totalItems.value / (lastParams.value.limit || 10))
        totalPages.value = Math.max(1, newTotalPages)
      }
      
      // Clear selected item if it was deleted
      if (selectedItem.value?.id === id) {
        selectedItem.value = null
      }
      
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item deleted successfully',
        life: 3000
      })
      
      return true
    } catch (err: any) {
      const apiError = err as ApiError
      error.value = apiError
      console.error(`Failed to delete item ${id}:`, apiError)
      
      toast.add({
        severity: 'error',
        summary: 'Failed to delete item',
        detail: apiError.message || `Could not delete item with ID: ${id}`,
        life: 5000
      })
      
      return false
    } finally {
      loading.value = false
      currentOperation.value = null
    }
  }

  // Bulk delete operation
  const bulkDelete = async (ids: string[]): Promise<number> => {
    if (!canPerform('delete')) {
      const errorMsg = 'No permission to delete documents'
      error.value = { code: 'PERMISSION_DENIED', message: errorMsg }
      toast.add({
        severity: 'error',
        summary: 'Access Denied',
        detail: errorMsg,
        life: 3000
      })
      return 0
    }

    if (!ids || ids.length === 0) {
      const errorMsg = 'No items selected for deletion'
      toast.add({
        severity: 'warn',
        summary: 'No Selection',
        detail: errorMsg,
        life: 3000
      })
      return 0
    }

    loading.value = true
    error.value = null
    currentOperation.value = 'bulk-delete'

    try {
      await api.post(getEndpoint('/bulk-delete'), { ids })
      
      const deletedCount = ids.length
      
      // Remove items from local state
      items.value = items.value.filter(item => !ids.includes(item.id))
      totalItems.value -= deletedCount
      
      // Recalculate total pages
      const newTotalPages = Math.ceil(totalItems.value / (lastParams.value.limit || 10))
      totalPages.value = Math.max(1, newTotalPages)
      
      // Clear selected item if it was deleted
      if (selectedItem.value && ids.includes(selectedItem.value.id)) {
        selectedItem.value = null
      }
      
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: `${deletedCount} item${deletedCount > 1 ? 's' : ''} deleted successfully`,
        life: 3000
      })
      
      return deletedCount
    } catch (err: any) {
      const apiError = err as ApiError
      error.value = apiError
      console.error('Failed to bulk delete items:', apiError)
      
      toast.add({
        severity: 'error',
        summary: 'Failed to delete items',
        detail: apiError.message || 'An error occurred while deleting the selected items',
        life: 5000
      })
      
      return 0
    } finally {
      loading.value = false
      currentOperation.value = null
    }
  }

  // Clear error state
  const clearError = (): void => {
    error.value = null
  }

  // Utility functions
  const refresh = async (): Promise<void> => {
    await fetchList(lastParams.value)
  }

  const reset = (): void => {
    items.value = []
    selectedItem.value = null
    totalItems.value = 0
    totalPages.value = 0
    currentPage.value = 1
    hasNext.value = false
    hasPrev.value = false
    error.value = null
    currentOperation.value = null
    lastParams.value = {}
  }

  const selectItem = (item: T | null): void => {
    selectedItem.value = item
  }

  // Computed properties
  const isLoading = computed(() => loading.value || schemaLoading.value)

  return {
    // Reactive state
    items,
    loading: isLoading,
    selectedItem,
    totalItems,
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    error,
    currentOperation,
    lastParams,
    
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
    canPerform,
    clearError
  }
}

export type UseCrudReturn<T extends { id: string }> = CrudOperations<T>