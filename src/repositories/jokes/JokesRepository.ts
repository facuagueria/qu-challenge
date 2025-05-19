import type { Joke } from '@/types/Joke.ts'

/**
 * Interface for the joke repository
 * Defines all operations related to jokes data
 */
export interface JokesRepository {
  /**
   * Get jokes from the API
   * @returns Promise<Joke[]> - A promise that resolves to an array of jokes
   * @throws Error if the API call fails
   */
  getJokes: () => Promise<Joke[]>

  /**
   * Add a joke to the collection
   * @param joke - The joke to add
   */
  addJoke: (joke: Joke) => void

  /**
   * Remove a joke from the collection
   * @param jokeId - The ID of the joke to remove
   * @returns boolean - True if the joke was removed, false otherwise
   */
  removeJoke: (jokeId: number) => boolean

  /**
   * Toggle a joke's like status (true or null)
   * @param jokeId - The ID of the joke to like
   */
  likeJoke: (jokeId: number) => void

  /**
   * Toggle a joke's dislike status (false or null)
   * @param jokeId - The ID of the joke to dislike
   */
  dislikeJoke: (jokeId: number) => void

  /**
   * Remove all jokes from the collection
   */
  deleteAll: () => void

  /**
   * Get all jokes in the collection
   * @returns Joke[] - An array of all jokes
   */
  getAllJokes: () => Joke[]
}
