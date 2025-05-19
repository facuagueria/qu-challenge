import type { JokeTypesRepository } from './JokeTypesRepository.ts'
import type { JokeType } from '@/types/Joke.ts'
import { useFetch } from '@vueuse/core'
import { ref } from 'vue'
import { useApiCache } from '@/composables/useApiCache'
import { API_URLS } from '@/constants/api.ts'

/**
 * Implementation of the JokeTypesRepository interface
 * Handles all operations related to joke types data
 */
export class JokeTypesRepositoryImpl implements JokeTypesRepository {
  private types = ref<JokeType[]>([])
  private cache = useApiCache<JokeType[]>('joke-types', [], {
    // Cache joke types for 1 hour (they don't change often)
    expirationTime: 60 * 60 * 1000,
  })

  constructor() {
    // Initialize types from the cache if available
    this.loadFromCache()
  }

  /**
   * Load joke types from the cache if available
   * @private
   */
  private async loadFromCache(): Promise<void> {
    try {
      // Try to get joke types from the cache without fetching
      const cachedTypes = await this.cache.getWithCache(async () => {
        return [] // Return an empty array if no cache, don't fetch
      })

      if (cachedTypes.length > 0) {
        this.types.value = cachedTypes
      }
    }
    catch (error) {
      console.warn('Failed to load joke types from cache', error)
    }
  }

  /**
   * Get joke types from the API or cache
   * @returns Promise<JokeType[]> - A promise that resolves to an array of joke types
   * @throws Error if the API call fails
   */
  async getJokeTypes(): Promise<JokeType[]> {
    // Use the cache to get or fetch joke types
    // If the cache is stale or doesn't exist, it will fetch from API
    const jokeTypes = await this.cache.getWithCache(async () => {
      // This function is called when the cache is stale or doesn't exist
      console.log('Fetching joke types from API (cache is stale or missing)')
      return this.fetchJokeTypesFromApi()
    })

    // Update the types ref with the data (either from cache or freshly fetched)
    this.types.value = jokeTypes
    return jokeTypes
  }

  /**
   * Fetch joke types directly from the API
   * @private
   * @returns Promise<JokeType[]> - A promise that resolves to an array of joke types
   * @throws Error if the API call fails
   */
  private async fetchJokeTypesFromApi(): Promise<JokeType[]> {
    const { error, data } = await useFetch<JokeType[]>(API_URLS.TYPES)
      .get()
      .json()

    if (error.value) {
      throw error.value
    }

    if (data.value) {
      return data.value
    }

    return []
  }

  /**
   * Get all joke types in the collection
   * @returns JokeType[] - An array of all joke types
   */
  getAllJokeTypes(): JokeType[] {
    return this.types.value
  }
}
