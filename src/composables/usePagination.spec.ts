import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { usePagination } from './usePagination.ts'

describe('usePagination', () => {
  // Test default initialization
  it('initializes with default values', () => {
    const items = () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const pagination = usePagination(items)

    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.itemsPerPage.value).toBe(5)
    expect(pagination.totalPages.value).toBe(2)
    expect(pagination.paginatedItems.value).toEqual([1, 2, 3, 4, 5])
    expect(pagination.itemsRange.value).toEqual({ start: 1, end: 5 })
  })

  // Test custom initialization with options
  it('initializes with custom options', () => {
    const items = () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const pagination = usePagination(items, {
      defaultCurrentPage: 2,
      defaultItemsPerPage: 3,
    })

    expect(pagination.currentPage.value).toBe(2)
    expect(pagination.itemsPerPage.value).toBe(3)
    expect(pagination.totalPages.value).toBe(4)
    expect(pagination.paginatedItems.value).toEqual([4, 5, 6])
    expect(pagination.itemsRange.value).toEqual({ start: 4, end: 6 })
  })

  // Test pagination calculations with an empty array
  it('handles empty array correctly', () => {
    const items = () => []
    const pagination = usePagination(items)

    expect(pagination.totalPages.value).toBe(1)
    expect(pagination.paginatedItems.value).toEqual([])
    expect(pagination.itemsRange.value).toEqual({ start: 1, end: 0 })
  })

  // Test pagination calculations with an array smaller than items per page
  it('handles array smaller than items per page', () => {
    const items = () => [1, 2, 3]
    const pagination = usePagination(items, { defaultItemsPerPage: 5 })

    expect(pagination.totalPages.value).toBe(1)
    expect(pagination.paginatedItems.value).toEqual([1, 2, 3])
    expect(pagination.itemsRange.value).toEqual({ start: 1, end: 3 })
  })

  // Test page navigation
  it('handles page changes correctly', () => {
    const items = () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const pagination = usePagination(items, { defaultItemsPerPage: 3 })

    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.paginatedItems.value).toEqual([1, 2, 3])

    pagination.handlePageChange(2)
    expect(pagination.currentPage.value).toBe(2)
    expect(pagination.paginatedItems.value).toEqual([4, 5, 6])

    pagination.handlePageChange(4)
    expect(pagination.currentPage.value).toBe(4)
    expect(pagination.paginatedItems.value).toEqual([10])
  })

  // Test reset page functionality
  it('resets page correctly', () => {
    const items = () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const pagination = usePagination(items, {
      defaultCurrentPage: 2,
      defaultItemsPerPage: 3,
    })

    expect(pagination.currentPage.value).toBe(2)

    pagination.handlePageChange(3)
    expect(pagination.currentPage.value).toBe(3)

    pagination.resetPage()
    expect(pagination.currentPage.value).toBe(2) // Should reset to defaultCurrentPage (2)
  })

  // Test reactive updates when items change
  it('updates calculations when items change', () => {
    const itemsArray = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    const items = () => itemsArray.value
    const pagination = usePagination(items, { defaultItemsPerPage: 5 })

    expect(pagination.totalPages.value).toBe(2)
    expect(pagination.paginatedItems.value).toEqual([1, 2, 3, 4, 5])

    // Add more items
    itemsArray.value = [...itemsArray.value, 11, 12, 13, 14, 15]
    expect(pagination.totalPages.value).toBe(3)
    expect(pagination.paginatedItems.value).toEqual([1, 2, 3, 4, 5])

    // Remove items
    itemsArray.value = [1, 2, 3]
    expect(pagination.totalPages.value).toBe(1)
    expect(pagination.paginatedItems.value).toEqual([1, 2, 3])
  })

  // Test edge case: last page with fewer items
  it('handles last page with fewer items correctly', () => {
    const items = () => [1, 2, 3, 4, 5, 6, 7]
    const pagination = usePagination(items, { defaultItemsPerPage: 5 })

    expect(pagination.totalPages.value).toBe(2)

    pagination.handlePageChange(2)
    expect(pagination.paginatedItems.value).toEqual([6, 7])
    expect(pagination.itemsRange.value).toEqual({ start: 6, end: 7 })
  })

  // Test edge case: navigating to a page beyond total pages
  it('handles navigating to a page beyond total pages', () => {
    const items = () => [1, 2, 3, 4, 5]
    const pagination = usePagination(items, { defaultItemsPerPage: 2 })

    expect(pagination.totalPages.value).toBe(3)

    pagination.handlePageChange(5) // Beyond total pages
    expect(pagination.currentPage.value).toBe(5)
    expect(pagination.paginatedItems.value).toEqual([]) // Should be empty as the page is out of range
  })
})
