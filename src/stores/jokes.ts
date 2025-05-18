import type { Joke } from '@/types/Joke.ts'
import { useFetch } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { usePagination } from '@/composables/usePagination'
import { API_URLS } from '@/constants/api'

export const DEFAULT_VALUES = {
  isLoading: false,
  currentPage: 1,
  itemsPerPage: 5,
  searchQuery: '',
  category: 'all',
  likeStatus: 'all',
}

export const useJokesStore = defineStore('jokes', () => {
  const jokes = ref<Joke[]>([])
  const isLoading = ref(DEFAULT_VALUES.isLoading)
  const searchQuery = ref(DEFAULT_VALUES.searchQuery)
  const category = ref(DEFAULT_VALUES.category)
  const likeStatus = ref(DEFAULT_VALUES.likeStatus)

  // Filter jokes based on a search query, category, and like status
  const filteredJokes = computed(() => {
    return jokes.value.filter((joke) => {
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
    const joke = jokes.value.find(j => j.id === jokeId)
    if (joke) {
      joke.isLiked = joke.isLiked === true ? null : true
    }
  }

  // Dislike a joke
  function dislikeJoke(jokeId: number) {
    const joke = jokes.value.find(j => j.id === jokeId)
    if (joke) {
      joke.isLiked = joke.isLiked === false ? null : false
    }
  }

  // Remove a joke
  function removeJoke(jokeId: number): boolean {
    // Handle invalid joke IDs
    if (jokeId === undefined || jokeId === null || Number.isNaN(jokeId) || jokeId < 0) {
      console.error(`Invalid joke ID: ${jokeId}`)
      return false
    }

    const jokeIndex = jokes.value.findIndex(j => j.id === jokeId)
    if (jokeIndex !== -1) {
      jokes.value.splice(jokeIndex, 1)
      return true
    }
    else {
      console.warn(`Joke with ID ${jokeId} not found`)
      return false
    }
  }

  function deleteAll() {
    jokes.value = []
  }

  // Get jokes from API
  async function getJokes() {
    isLoading.value = true

    const { error, data } = await useFetch<Joke[]>(API_URLS.RANDOM_JOKES)
      .get()
      .json()

    if (error.value) {
      isLoading.value = false

      throw error.value
    }

    if (data.value) {
      const newData = data.value.map((joke: Joke) => ({
        ...joke,
        isLiked: null,
      }))

      jokes.value.push(...newData)
    }

    isLoading.value = false
  }

  function clearFilters() {
    setSearchQuery(DEFAULT_VALUES.searchQuery)
    setCategory(DEFAULT_VALUES.category)
    setLikeStatus(DEFAULT_VALUES.likeStatus)
  }

  function addJoke(joke: Joke) {
    jokes.value.unshift(joke)
  }

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
