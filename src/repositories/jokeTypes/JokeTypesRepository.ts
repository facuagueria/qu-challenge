import type { JokeType } from '@/types/Joke.ts'

/**
 * Interface for the joke types repository
 * Defines all operations related to joke types data
 */
export interface JokeTypesRepository {
  /**
   * Get joke types from the API
   * @returns Promise<JokeType[]> - A promise that resolves to an array of joke types
   * @throws Error if the API call fails
   */
  getJokeTypes: () => Promise<JokeType[]>

  /**
   * Get all joke types in the collection
   * @returns JokeType[] - An array of all joke types
   */
  getAllJokeTypes: () => JokeType[]
}
