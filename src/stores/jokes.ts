import type { Joke } from '@/types/Joke.ts'
import { useFetch } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const DEFAULT_VALUES = {
  isLoading: false,
  currentPage: 1,
  itemsPerPage: 5,
}

const URL = 'https://official-joke-api.appspot.com/jokes/random/10'

export const useJokesStore = defineStore('jokes', () => {
  const jokes = ref<Joke[]>([])
  const isLoading = ref(DEFAULT_VALUES.isLoading)
  const currentPage = ref(DEFAULT_VALUES.currentPage)
  const itemsPerPage = ref(DEFAULT_VALUES.itemsPerPage)

  // Calculate total pages based on the number of jokes
  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(jokes.value.length / itemsPerPage.value))
  })

  // Get jokes for the current page
  const paginatedJokes = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value
    const endIndex = startIndex + itemsPerPage.value
    return jokes.value.slice(startIndex, endIndex)
  })

  // Handle page change
  function handlePageChange(page: number) {
    currentPage.value = page
  }

  // Calculate the range of jokes being displayed
  const jokeRange = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value + 1
    const end = Math.min(start + paginatedJokes.value.length - 1, jokes.value.length)
    return { start, end }
  })

  // Get jokes from API
  async function getJokes() {
    isLoading.value = true

    const { error, data } = await useFetch<Joke[]>(URL)
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

  return { jokes, paginatedJokes, isLoading, totalPages, jokeRange, currentPage, itemsPerPage, handlePageChange, getJokes }
})
