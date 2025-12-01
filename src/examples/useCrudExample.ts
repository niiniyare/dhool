/**
 * Enhanced CRUD Composable Usage Examples
 * 
 * This file demonstrates how to use the comprehensive useCrud composable
 * with all its features including error handling, pagination, and permissions.
 */

import { ref, watch } from 'vue'
import { useCrud } from '@/composables/useCrud'
import type { CrudListParams } from '@/types/crud'

// Example 1: Basic CRUD operations for a Customer entity
interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export function useCustomerCrud() {
  const docType = ref('customer')
  
  // Initialize CRUD composable with type safety
  const {
    // Reactive state
    items,
    loading,
    selectedItem,
    totalItems,
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    error,
    currentOperation,
    
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
  } = useCrud<Customer>(docType)

  // Example: Load customers with filters and pagination
  const loadCustomers = async (filters?: Record<string, any>) => {
    const params: CrudListParams = {
      page: 1,
      limit: 10,
      sort: 'name',
      order: 'asc',
      filters: {
        status: 'active',
        ...filters
      },
      fields: ['id', 'name', 'email', 'phone', 'company', 'status'],
      searchFields: ['name', 'email', 'company']
    }

    await fetchList(params)
  }

  // Example: Create a new customer with validation
  const createCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!canPerform('create')) {
      throw new Error('Not authorized to create customers')
    }

    const newCustomer = await create(customerData)
    if (newCustomer) {
      console.log('Customer created successfully:', newCustomer.id)
      return newCustomer
    }
    
    throw new Error('Failed to create customer')
  }

  // Example: Update customer with optimistic updates
  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    if (!canPerform('update')) {
      throw new Error('Not authorized to update customers')
    }

    const updated = await update(id, updates)
    if (updated) {
      console.log('Customer updated successfully:', updated.id)
      return updated
    }
    
    throw new Error('Failed to update customer')
  }

  // Example: Delete customer with confirmation
  const deleteCustomer = async (id: string) => {
    if (!canPerform('delete')) {
      throw new Error('Not authorized to delete customers')
    }

    const success = await remove(id)
    if (success) {
      console.log('Customer deleted successfully')
    }
    
    return success
  }

  // Example: Bulk delete with progress tracking
  const deleteSelectedCustomers = async (customerIds: string[]) => {
    if (!canPerform('delete')) {
      throw new Error('Not authorized to delete customers')
    }

    if (customerIds.length === 0) {
      throw new Error('No customers selected for deletion')
    }

    const deletedCount = await bulkDelete(customerIds)
    console.log(`Successfully deleted ${deletedCount} customers`)
    
    return deletedCount
  }

  // Example: Search customers with debouncing
  const searchCustomers = async (query: string) => {
    if (query.length < 3) {
      return // Don't search for queries less than 3 characters
    }

    const params: CrudListParams = {
      search: query,
      searchFields: ['name', 'email', 'company'],
      limit: 20
    }

    await fetchList(params)
  }

  // Example: Watch for errors and handle them
  watch(error, (newError) => {
    if (newError) {
      console.error('CRUD operation error:', newError)
      // Could trigger custom error handling, logging, etc.
    }
  })

  return {
    // State
    customers: items,
    loading,
    selectedCustomer: selectedItem,
    totalCustomers: totalItems,
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    error,
    currentOperation,
    
    // Operations
    loadCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    deleteSelectedCustomers,
    searchCustomers,
    
    // Utilities
    refresh,
    reset,
    selectCustomer: selectItem,
    canPerform,
    clearError,
    
    // Direct access to original methods
    fetchOne,
    fetchList
  }
}

// Example 2: Invoice CRUD with advanced filtering
interface Invoice {
  id: string
  number: string
  customerId: string
  customerName: string
  amount: number
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: string
  createdAt: string
}

export function useInvoiceCrud() {
  const docType = ref('invoice')
  const crud = useCrud<Invoice>(docType)

  // Advanced filtering example
  const loadInvoicesByStatus = async (status: Invoice['status'], dateRange?: { start: string; end: string }) => {
    const params: CrudListParams = {
      page: 1,
      limit: 25,
      sort: 'createdAt',
      order: 'desc',
      filters: {
        status,
        ...(dateRange && {
          createdAt: {
            $gte: dateRange.start,
            $lte: dateRange.end
          }
        })
      },
      include: ['customer'] // Include customer details
    }

    await crud.fetchList(params)
  }

  // Pagination example
  const goToPage = async (page: number) => {
    const params: CrudListParams = {
      ...crud.lastParams?.value,
      page
    }
    
    await crud.fetchList(params)
  }

  return {
    ...crud,
    invoices: crud.items,
    selectedInvoice: crud.selectedItem,
    loadInvoicesByStatus,
    goToPage
  }
}

// Example 3: Product CRUD with real-time updates
interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  category: string
  status: 'active' | 'discontinued'
  description?: string
}

export function useProductCrud() {
  const docType = ref('product')
  const crud = useCrud<Product>(docType)

  // Low stock check example
  const loadLowStockProducts = async (threshold: number = 10) => {
    const params: CrudListParams = {
      filters: {
        stock: { $lt: threshold },
        status: 'active'
      },
      sort: 'stock',
      order: 'asc',
      limit: 50
    }

    await crud.fetchList(params)
  }

  // Bulk update stock levels
  const updateStockLevels = async (updates: Array<{ id: string; stock: number }>) => {
    if (!crud.canPerform('update')) {
      throw new Error('Not authorized to update products')
    }

    const results = []
    
    for (const update of updates) {
      const result = await crud.update(update.id, { stock: update.stock })
      if (result) {
        results.push(result)
      }
    }

    return results
  }

  // Category-based filtering
  const loadProductsByCategory = async (category: string) => {
    const params: CrudListParams = {
      filters: { category },
      sort: 'name',
      order: 'asc'
    }

    await crud.fetchList(params)
  }

  return {
    ...crud,
    products: crud.items,
    selectedProduct: crud.selectedItem,
    loadLowStockProducts,
    updateStockLevels,
    loadProductsByCategory
  }
}

// Export utilities for common patterns
export const crudUtils = {
  /**
   * Create a debounced search function
   */
  createDebouncedSearch: (searchFn: (query: string) => Promise<void>, delay: number = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>
    
    return (query: string) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => searchFn(query), delay)
    }
  },

  /**
   * Create pagination helpers
   */
  createPaginationHelpers: (crud: ReturnType<typeof useCrud>) => ({
    nextPage: async () => {
      if (crud.hasNext.value) {
        const params: CrudListParams = {
          ...crud.lastParams?.value,
          page: crud.currentPage.value + 1
        }
        await crud.fetchList(params)
      }
    },

    prevPage: async () => {
      if (crud.hasPrev.value) {
        const params: CrudListParams = {
          ...crud.lastParams?.value,
          page: crud.currentPage.value - 1
        }
        await crud.fetchList(params)
      }
    },

    goToPage: async (page: number) => {
      if (page >= 1 && page <= crud.totalPages.value) {
        const params: CrudListParams = {
          ...crud.lastParams?.value,
          page
        }
        await crud.fetchList(params)
      }
    },

    changePageSize: async (limit: number) => {
      const params: CrudListParams = {
        ...crud.lastParams?.value,
        page: 1, // Reset to first page when changing page size
        limit
      }
      await crud.fetchList(params)
    }
  })
}