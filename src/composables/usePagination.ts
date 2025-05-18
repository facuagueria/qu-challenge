import { computed, ref } from 'vue'

export interface PaginationOptions {
  defaultCurrentPage?: number
  defaultItemsPerPage?: number
}

export function usePagination<T>(
  items: () => T[],
  options: PaginationOptions = {},
) {
  // Default values
  const defaultCurrentPage = options.defaultCurrentPage || 1
  const defaultItemsPerPage = options.defaultItemsPerPage || 5

  // State
  const currentPage = ref(defaultCurrentPage)
  const itemsPerPage = ref(defaultItemsPerPage)

  // Calculate total pages based on the number of items
  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(items().length / itemsPerPage.value))
  })

  // Get items for the current page
  const paginatedItems = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value
    const endIndex = startIndex + itemsPerPage.value
    return items().slice(startIndex, endIndex)
  })

  // Calculate the range of items being displayed
  const itemsRange = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value + 1
    const end = Math.min(start + paginatedItems.value.length - 1, items().length)
    return { start, end }
  })

  // Handle page change
  function handlePageChange(page: number) {
    currentPage.value = page
  }

  // Reset to the first page
  function resetPage() {
    currentPage.value = defaultCurrentPage
  }

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems,
    itemsRange,
    handlePageChange,
    resetPage,
  }
}
