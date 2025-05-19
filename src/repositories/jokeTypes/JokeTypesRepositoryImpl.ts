import type { JokeTypesRepository } from './JokeTypesRepository.ts'
import type { JokeType } from '@/types/Joke.ts'
import { useFetch } from '@vueuse/core'
import { ref } from 'vue'
import { API_URLS } from '@/constants/api.ts'

/**
 * Implementation of the JokeTypesRepository interface
 * Handles all operations related to joke types data
 */
export class JokeTypesRepositoryImpl implements JokeTypesRepository {
  private types = ref<JokeType[]>([])

  /**
   * Get joke types from the API
   * @returns Promise<JokeType[]> - A promise that resolves to an array of joke types
   * @throws Error if the API call fails
   */
  async getJokeTypes(): Promise<JokeType[]> {
    const { error, data } = await useFetch<JokeType[]>(API_URLS.TYPES)
      .get()
      .json()

    if (error.value) {
      throw error.value
    }

    if (data.value) {
      this.types.value = data.value
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
