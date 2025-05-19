import type { JokesRepository } from './JokesRepository.ts'
import type { Joke } from '@/types/Joke.ts'
import { useFetch } from '@vueuse/core'
import { ref } from 'vue'
import { API_URLS } from '@/constants/api.ts'

/**
 * Implementation of the JokesRepository interface
 * Handles all operations related to jokes data
 */
export class JokesRepositoryImpl implements JokesRepository {
  private jokes = ref<Joke[]>([])

  /**
   * Get jokes from the API
   * @returns Promise<Joke[]> - A promise that resolves to an array of jokes
   * @throws Error if the API call fails
   */
  async getJokes(): Promise<Joke[]> {
    const { error, data } = await useFetch<Joke[]>(API_URLS.RANDOM_JOKES)
      .get()
      .json()

    if (error.value) {
      throw error.value
    }

    if (data.value) {
      const newJokes = data.value.map((joke: Joke) => ({
        ...joke,
        isLiked: null,
      }))

      this.jokes.value.push(...newJokes)
      return newJokes
    }

    return []
  }

  /**
   * Add a joke to the collection
   * @param joke - The joke to add
   */
  addJoke(joke: Joke): void {
    this.jokes.value.unshift(joke)
  }

  /**
   * Remove a joke from the collection
   * @param jokeId - The ID of the joke to remove
   */
  removeJoke(jokeId: number): void {
    // Handle invalid joke IDs
    if (jokeId === undefined || jokeId === null || Number.isNaN(jokeId) || jokeId < 0) {
      throw new Error(`Invalid joke ID: ${jokeId}`)
    }

    const jokeIndex = this.jokes.value.findIndex(j => j.id === jokeId)
    if (jokeIndex !== -1) {
      this.jokes.value.splice(jokeIndex, 1)
    }
    else {
      throw new Error(`Joke with ID ${jokeId} not found`)
    }
  }

  /**
   * Toggle a joke's like status (true or null)
   * @param jokeId - The ID of the joke to like
   */
  likeJoke(jokeId: number): void {
    const joke = this.jokes.value.find(j => j.id === jokeId)
    if (joke) {
      joke.isLiked = joke.isLiked === true ? null : true
    }
  }

  /**
   * Toggle a joke's dislike status (false or null)
   * @param jokeId - The ID of the joke to dislike
   */
  dislikeJoke(jokeId: number): void {
    const joke = this.jokes.value.find(j => j.id === jokeId)
    if (joke) {
      joke.isLiked = joke.isLiked === false ? null : false
    }
  }

  /**
   * Remove all jokes from the collection
   */
  deleteAll(): void {
    this.jokes.value = []
  }

  /**
   * Get all jokes in the collection
   * @returns Joke[] - An array of all jokes
   */
  getAllJokes(): Joke[] {
    return this.jokes.value
  }
}
