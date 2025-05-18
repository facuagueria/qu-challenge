import type { Joke } from '@/types/Joke.ts'
import { useFetch } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { API_URLS } from '@/constants/api'

const DEFAULT_VALUES = {
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
  const currentPage = ref(DEFAULT_VALUES.currentPage)
  const itemsPerPage = ref(DEFAULT_VALUES.itemsPerPage)
  const searchQuery = ref(DEFAULT_VALUES.searchQuery)
  const category = ref(DEFAULT_VALUES.category)
  const likeStatus = ref(DEFAULT_VALUES.likeStatus)

  // Filter jokes based on a search query, category, and like status
  const filteredJokes = computed(() => {
    return jokes.value.filter((joke) => {
      // Filter by search query
      const matchesSearch = searchQuery.value === ''
        || joke.setup.toLowerCase().includes(searchQuery.value.toLowerCase())
        || joke.punchline.toLowerCase().includes(searchQuery.value.toLowerCase())

      // Filter by category
      const matchesCategory = category.value === 'all' || joke.type === category.value

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

  // Calculate total pages based on the number of filtered jokes
  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(filteredJokes.value.length / itemsPerPage.value))
  })

  // Get jokes for the current page
  const paginatedJokes = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value
    const endIndex = startIndex + itemsPerPage.value
    return filteredJokes.value.slice(startIndex, endIndex)
  })

  // Handle page change
  function handlePageChange(page: number) {
    currentPage.value = page
  }

  // Calculate the range of jokes being displayed
  const jokeRange = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value + 1
    const end = Math.min(start + paginatedJokes.value.length - 1, filteredJokes.value.length)
    return { start, end }
  })

  // Set a search query
  function setSearchQuery(query: string) {
    searchQuery.value = query
    currentPage.value = 1 // Reset to first page when filter changes
  }

  // Set category filter
  function setCategory(value: string) {
    category.value = value
    currentPage.value = 1 // Reset to first page when filter changes
  }

  // Set like status filter
  function setLikeStatus(value: string) {
    likeStatus.value = value
    currentPage.value = 1 // Reset to first page when filter changes
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

  return {
    jokes,
    filteredJokes,
    paginatedJokes,
    isLoading,
    totalPages,
    jokeRange,
    currentPage,
    itemsPerPage,
    searchQuery,
    category,
    likeStatus,
    handlePageChange,
    getJokes,
    setSearchQuery,
    setCategory,
    setLikeStatus,
    likeJoke,
    dislikeJoke,
    removeJoke,
  }
})
