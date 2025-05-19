import type { JokeTypesRepository } from './JokeTypesRepository.ts'
import { JokeTypesRepositoryImpl } from './JokeTypesRepositoryImpl.ts'

// Default repository instance
let jokeTypesRepository: JokeTypesRepository | null = null

/**
 * Get the joke types repository instance
 * Creates a new instance if one doesn't exist
 * @returns JokeTypesRepository - The joke types repository instance
 */
export function getJokeTypesRepository(): JokeTypesRepository {
  if (!jokeTypesRepository) {
    jokeTypesRepository = new JokeTypesRepositoryImpl()
  }
  return jokeTypesRepository
}

/**
 * Set the joke types repository instance
 * Useful for testing to inject mock repositories
 * @param repository - The repository instance to use
 */
export function setJokeTypesRepository(repository: JokeTypesRepository): void {
  jokeTypesRepository = repository
}
