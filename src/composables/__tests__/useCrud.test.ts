/**
 * Tests for the useCrud composable
 * 
 * Comprehensive test suite covering all CRUD operations, error handling,
 * permissions, and edge cases.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { useCrud } from '../useCrud'

// Mock dependencies
vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn()
  })
}))

vi.mock('../useSchema', () => ({
  useSchema: () => ({
    schema: ref({
      api: { baseEndpoint: '/api/v1/test' }
    }),
    loading: ref(false)
  })
}))

vi.mock('../useAccess', () => ({
  useAccess: () => ({
    canCreate: ref(() => true),
    canRead: ref(() => true),
    canUpdate: ref(() => true),
    canDelete: ref(() => true)
  })
}))

vi.mock('@/services/api', () => ({
  api: {
    getPaginated: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

import { api } from '@/services/api'

interface TestItem {
  id: string
  name: string
  value: number
}

describe('useCrud', () => {
  const mockApiPaginated = vi.mocked(api.getPaginated)
  const mockApiGet = vi.mocked(api.get)
  const mockApiPost = vi.mocked(api.post)
  const mockApiPut = vi.mocked(api.put)
  const mockApiDelete = vi.mocked(api.delete)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      const crud = useCrud<TestItem>('test')

      expect(crud.items.value).toEqual([])
      expect(crud.loading.value).toBe(false)
      expect(crud.selectedItem.value).toBe(null)
      expect(crud.totalItems.value).toBe(0)
      expect(crud.currentPage.value).toBe(1)
      expect(crud.totalPages.value).toBe(0)
      expect(crud.hasNext.value).toBe(false)
      expect(crud.hasPrev.value).toBe(false)
      expect(crud.error.value).toBe(null)
      expect(crud.currentOperation.value).toBe(null)
    })

    it('should have all required methods', () => {
      const crud = useCrud<TestItem>('test')

      expect(typeof crud.fetchList).toBe('function')
      expect(typeof crud.fetchOne).toBe('function')
      expect(typeof crud.create).toBe('function')
      expect(typeof crud.update).toBe('function')
      expect(typeof crud.remove).toBe('function')
      expect(typeof crud.bulkDelete).toBe('function')
      expect(typeof crud.refresh).toBe('function')
      expect(typeof crud.reset).toBe('function')
      expect(typeof crud.selectItem).toBe('function')
      expect(typeof crud.canPerform).toBe('function')
      expect(typeof crud.clearError).toBe('function')
    })
  })

  describe('fetchList', () => {
    it('should fetch items successfully', async () => {
      const mockData = {
        data: {
          items: [
            { id: '1', name: 'Item 1', value: 100 },
            { id: '2', name: 'Item 2', value: 200 }
          ],
          total: 2,
          totalPages: 1,
          page: 1,
          hasNext: false,
          hasPrev: false
        }
      }

      mockApiPaginated.mockResolvedValue(mockData)

      const crud = useCrud<TestItem>('test')
      await crud.fetchList({ page: 1, limit: 10 })

      expect(crud.items.value).toEqual(mockData.data.items)
      expect(crud.totalItems.value).toBe(2)
      expect(crud.totalPages.value).toBe(1)
      expect(crud.currentPage.value).toBe(1)
      expect(crud.hasNext.value).toBe(false)
      expect(crud.hasPrev.value).toBe(false)
      expect(crud.loading.value).toBe(false)
      expect(crud.error.value).toBe(null)
    })

    it('should handle API errors', async () => {
      const mockError = {
        code: 'API_ERROR',
        message: 'Failed to fetch items'
      }

      mockApiPaginated.mockRejectedValue(mockError)

      const crud = useCrud<TestItem>('test')
      await crud.fetchList()

      expect(crud.items.value).toEqual([])
      expect(crud.error.value).toEqual(mockError)
      expect(crud.loading.value).toBe(false)
    })

    it('should set correct operation state during fetch', async () => {
      const mockData = {
        data: {
          items: [],
          total: 0,
          totalPages: 0,
          page: 1,
          hasNext: false,
          hasPrev: false
        }
      }

      const crud = useCrud<TestItem>('test')
      
      let operationValueDuringCall = null
      mockApiPaginated.mockImplementation(async () => {
        operationValueDuringCall = crud.currentOperation.value
        return mockData
      })

      await crud.fetchList()

      expect(operationValueDuringCall).toBe('list')
      expect(crud.currentOperation.value).toBe(null)
    })
  })

  describe('fetchOne', () => {
    it('should fetch a single item successfully', async () => {
      const mockItem = { id: '1', name: 'Test Item', value: 100 }
      mockApiGet.mockResolvedValue({ data: mockItem })

      const crud = useCrud<TestItem>('test')
      const result = await crud.fetchOne('1')

      expect(result).toEqual(mockItem)
      expect(mockApiGet).toHaveBeenCalledWith('/api/v1/test/1')
    })

    it('should handle fetch one errors', async () => {
      const mockError = {
        code: 'NOT_FOUND',
        message: 'Item not found'
      }

      mockApiGet.mockRejectedValue(mockError)

      const crud = useCrud<TestItem>('test')
      const result = await crud.fetchOne('999')

      expect(result).toBe(null)
      expect(crud.error.value).toEqual(mockError)
    })
  })

  describe('create', () => {
    it('should create item successfully', async () => {
      const newItem = { name: 'New Item', value: 300 }
      const createdItem = { id: '3', ...newItem }
      
      mockApiPost.mockResolvedValue({ data: createdItem })

      const crud = useCrud<TestItem>('test')
      // Set up initial state to simulate first page
      crud.currentPage.value = 1
      
      const result = await crud.create(newItem)

      expect(result).toEqual(createdItem)
      expect(crud.items.value).toEqual([createdItem]) // Should be first item
      expect(crud.totalItems.value).toBe(1)
      expect(mockApiPost).toHaveBeenCalledWith('/api/v1/test', newItem)
    })

    it('should handle create errors', async () => {
      const mockError = {
        code: 'VALIDATION_ERROR',
        message: 'Invalid data'
      }

      mockApiPost.mockRejectedValue(mockError)

      const crud = useCrud<TestItem>('test')
      const result = await crud.create({ name: '', value: -1 })

      expect(result).toBe(null)
      expect(crud.error.value).toEqual(mockError)
    })
  })

  describe('update', () => {
    it('should update item successfully', async () => {
      const updates = { name: 'Updated Item' }
      const updatedItem = { id: '1', name: 'Updated Item', value: 100 }
      
      mockApiPut.mockResolvedValue({ data: updatedItem })

      const crud = useCrud<TestItem>('test')
      // Set up initial state
      crud.items.value = [{ id: '1', name: 'Original Item', value: 100 }]
      
      const result = await crud.update('1', updates)

      expect(result).toEqual(updatedItem)
      expect(crud.items.value[0]).toEqual(updatedItem)
      expect(mockApiPut).toHaveBeenCalledWith('/api/v1/test/1', updates)
    })

    it('should update selected item if it matches', async () => {
      const updates = { name: 'Updated Item' }
      const updatedItem = { id: '1', name: 'Updated Item', value: 100 }
      
      mockApiPut.mockResolvedValue({ data: updatedItem })

      const crud = useCrud<TestItem>('test')
      crud.selectedItem.value = { id: '1', name: 'Original Item', value: 100 }
      
      await crud.update('1', updates)

      expect(crud.selectedItem.value).toEqual(updatedItem)
    })
  })

  describe('remove', () => {
    it('should delete item successfully', async () => {
      mockApiDelete.mockResolvedValue({})

      const crud = useCrud<TestItem>('test')
      crud.items.value = [
        { id: '1', name: 'Item 1', value: 100 },
        { id: '2', name: 'Item 2', value: 200 }
      ]
      crud.totalItems.value = 2
      
      const result = await crud.remove('1')

      expect(result).toBe(true)
      expect(crud.items.value).toHaveLength(1)
      expect(crud.items.value[0].id).toBe('2')
      expect(crud.totalItems.value).toBe(1)
      expect(mockApiDelete).toHaveBeenCalledWith('/api/v1/test/1')
    })

    it('should clear selected item if deleted', async () => {
      mockApiDelete.mockResolvedValue({})

      const crud = useCrud<TestItem>('test')
      crud.selectedItem.value = { id: '1', name: 'Item 1', value: 100 }
      crud.items.value = [{ id: '1', name: 'Item 1', value: 100 }]
      
      await crud.remove('1')

      expect(crud.selectedItem.value).toBe(null)
    })
  })

  describe('bulkDelete', () => {
    it('should delete multiple items successfully', async () => {
      mockApiPost.mockResolvedValue({})

      const crud = useCrud<TestItem>('test')
      crud.items.value = [
        { id: '1', name: 'Item 1', value: 100 },
        { id: '2', name: 'Item 2', value: 200 },
        { id: '3', name: 'Item 3', value: 300 }
      ]
      crud.totalItems.value = 3
      
      const result = await crud.bulkDelete(['1', '2'])

      expect(result).toBe(2)
      expect(crud.items.value).toHaveLength(1)
      expect(crud.items.value[0].id).toBe('3')
      expect(crud.totalItems.value).toBe(1)
      expect(mockApiPost).toHaveBeenCalledWith('/api/v1/test/bulk-delete', { ids: ['1', '2'] })
    })

    it('should handle empty array', async () => {
      const crud = useCrud<TestItem>('test')
      const result = await crud.bulkDelete([])

      expect(result).toBe(0)
      expect(mockApiPost).not.toHaveBeenCalled()
    })
  })

  describe('utility methods', () => {
    it('should reset state correctly', () => {
      const crud = useCrud<TestItem>('test')
      
      // Set some state
      crud.items.value = [{ id: '1', name: 'Item', value: 100 }]
      crud.selectedItem.value = { id: '1', name: 'Item', value: 100 }
      crud.totalItems.value = 1
      crud.currentPage.value = 2
      crud.error.value = { code: 'ERROR', message: 'Test error' }
      
      crud.reset()

      expect(crud.items.value).toEqual([])
      expect(crud.selectedItem.value).toBe(null)
      expect(crud.totalItems.value).toBe(0)
      expect(crud.currentPage.value).toBe(1)
      expect(crud.totalPages.value).toBe(0)
      expect(crud.hasNext.value).toBe(false)
      expect(crud.hasPrev.value).toBe(false)
      expect(crud.error.value).toBe(null)
      expect(crud.currentOperation.value).toBe(null)
    })

    it('should select item correctly', () => {
      const crud = useCrud<TestItem>('test')
      const item = { id: '1', name: 'Item', value: 100 }
      
      crud.selectItem(item)
      expect(crud.selectedItem.value).toEqual(item)
      
      crud.selectItem(null)
      expect(crud.selectedItem.value).toBe(null)
    })

    it('should clear error correctly', () => {
      const crud = useCrud<TestItem>('test')
      crud.error.value = { code: 'ERROR', message: 'Test error' }
      
      crud.clearError()
      expect(crud.error.value).toBe(null)
    })

    it('should refresh with last params', async () => {
      const mockData = {
        data: {
          items: [],
          total: 0,
          totalPages: 0,
          page: 1,
          hasNext: false,
          hasPrev: false
        }
      }

      mockApiPaginated.mockResolvedValue(mockData)

      const crud = useCrud<TestItem>('test')
      
      // First fetch with params
      await crud.fetchList({ page: 2, limit: 5, search: 'test' })
      
      // Clear the mock to verify refresh uses same params
      mockApiPaginated.mockClear()
      mockApiPaginated.mockResolvedValue(mockData)
      
      await crud.refresh()

      expect(mockApiPaginated).toHaveBeenCalledWith('/api/v1/test', {
        page: 2,
        limit: 5,
        search: 'test',
        searchFields: undefined,
        filters: undefined,
        sort: undefined,
        order: undefined,
        fields: undefined,
        exclude: undefined,
        include: undefined
      })
    })
  })

  describe('permissions', () => {
    it('should check permissions correctly', () => {
      const crud = useCrud<TestItem>('test')

      expect(crud.canPerform('create')).toBe(true)
      expect(crud.canPerform('read')).toBe(true)
      expect(crud.canPerform('update')).toBe(true)
      expect(crud.canPerform('delete')).toBe(true)
    })

    it('should return false for invalid docType', () => {
      const crud = useCrud<TestItem>(ref(''))

      expect(crud.canPerform('create')).toBe(false)
      expect(crud.canPerform('read')).toBe(false)
      expect(crud.canPerform('update')).toBe(false)
      expect(crud.canPerform('delete')).toBe(false)
    })
  })
})