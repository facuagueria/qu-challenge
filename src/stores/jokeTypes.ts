import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getJokeTypesRepository } from '@/repositories/jokeTypes'

export const useJokeTypesStore = defineStore('joke-types', () => {
  // Get the repository instance
  const repository = getJokeTypesRepository()

  const isLoading = ref(false)

  // Fetch joke types from API
  async function getJokeTypes() {
    isLoading.value = true

    try {
      await repository.getJokeTypes()
    }
    catch (error) {
      isLoading.value = false
      throw error
    }

    isLoading.value = false
  }

  // Create a computed property for types that uses the repository
  const types = computed(() => repository.getAllJokeTypes())

  return {
    types,
    isLoading,
    getJokeTypes,
  }
})
