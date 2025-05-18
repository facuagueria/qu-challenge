import type { JokeType } from '@/types/Joke'
import { useFetch } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_URLS } from '@/constants/api'

export const useJokeTypesStore = defineStore('joke-types', () => {
  const types = ref<JokeType[]>([])
  const isLoading = ref(false)

  // Fetch joke types from API
  async function getJokeTypes() {
    isLoading.value = true

    const { error, data } = await useFetch<JokeType[]>(API_URLS.TYPES)
      .get()
      .json()

    if (error.value) {
      isLoading.value = false
      throw error.value
    }

    if (data.value) {
      types.value = data.value
    }

    isLoading.value = false
  }

  return {
    types,
    isLoading,
    getJokeTypes,
  }
})
