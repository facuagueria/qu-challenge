import type { Joke } from '@/types/Joke.ts'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { usePagination } from '@/composables/usePagination'
import { getJokesRepository } from '@/repositories/jokes'

export const DEFAULT_VALUES = {
  isLoading: false,
  currentPage: 1,
  itemsPerPage: 5,
  searchQuery: '',
  category: 'all',
  likeStatus: 'all',
}

export const useJokesStore = defineStore('jokes', () => {
  // Get the repository instance
  const repository = getJokesRepository()

  const isLoading = ref(DEFAULT_VALUES.isLoading)
  const searchQuery = ref(DEFAULT_VALUES.searchQuery)
  const category = ref(DEFAULT_VALUES.category)
  const likeStatus = ref(DEFAULT_VALUES.likeStatus)

  // Filter jokes based on a search query, category, and like status
  const filteredJokes = computed(() => {
    return repository.getAllJokes().filter((joke) => {
      // Filter by search query
      const matchesSearch = searchQuery.value === DEFAULT_VALUES.searchQuery
        || joke.setup.toLowerCase().includes(searchQuery.value.toLowerCase())
        || joke.punchline.toLowerCase().includes(searchQuery.value.toLowerCase())

      // Filter by category
      const matchesCategory = category.value === DEFAULT_VALUES.category || joke.type === category.value

      // Filter by like status
      let matchesLikeStatus = true
      if (likeStatus.value === 'liked') {
        matchesLikeStatus = joke.isLiked === true
      }
      else if (likeStatus.value === 'disliked') {
        matchesLikeStatus = joke.isLiked === false
      }

      return matchesSearch && matchesCategory && matchesLikeStatus
    })
  })

  // Use the pagination composable with filtered jokes
  const pagination = usePagination(
    () => filteredJokes.value,
    {
      defaultCurrentPage: DEFAULT_VALUES.currentPage,
      defaultItemsPerPage: DEFAULT_VALUES.itemsPerPage,
    },
  )

  // Set a search query
  function setSearchQuery(query: string) {
    searchQuery.value = query
    pagination.resetPage() // Reset to first page when filter changes
  }

  // Set category filter
  function setCategory(value: string) {
    category.value = value
    pagination.resetPage() // Reset to first page when filter changes
  }

  // Set like status filter
  function setLikeStatus(value: string) {
    likeStatus.value = value
    pagination.resetPage() // Reset to first page when filter changes
  }

  // Like a joke
  function likeJoke(jokeId: number) {
    repository.likeJoke(jokeId)
  }

  // Dislike a joke
  function dislikeJoke(jokeId: number) {
    repository.dislikeJoke(jokeId)
  }

  // Remove a joke
  function removeJoke(jokeId: number): boolean {
    return repository.removeJoke(jokeId)
  }

  function deleteAll() {
    repository.deleteAll()
  }

  // Get jokes from API
  async function getJokes() {
    isLoading.value = true

    try {
      await repository.getJokes()
    }
    catch (error) {
      isLoading.value = false
      throw error
    }

    isLoading.value = false
  }

  function clearFilters() {
    setSearchQuery(DEFAULT_VALUES.searchQuery)
    setCategory(DEFAULT_VALUES.category)
    setLikeStatus(DEFAULT_VALUES.likeStatus)
  }

  function addJoke(joke: Joke) {
    repository.addJoke(joke)
  }

  // Create a computed property for jokes that uses the repository
  const jokes = computed(() => repository.getAllJokes())

  return {
    jokes,
    filteredJokes,
    paginatedItems: pagination.paginatedItems,
    isLoading,
    totalPages: pagination.totalPages,
    itemsRange: pagination.itemsRange,
    currentPage: pagination.currentPage,
    itemsPerPage: pagination.itemsPerPage,
    searchQuery,
    category,
    likeStatus,
    DEFAULT_VALUES,
    addJoke,
    deleteAll,
    handlePageChange: pagination.handlePageChange,
    getJokes,
    setSearchQuery,
    setCategory,
    setLikeStatus,
    likeJoke,
    dislikeJoke,
    removeJoke,
    clearFilters,
  }
})
