import type { JokesRepository } from './JokesRepository.ts'
import { JokesRepositoryImpl } from './JokesRepositoryImpl.ts'

// Default repository instance
let jokesRepository: JokesRepository | null = null

/**
 * Get the jokes repository instance
 * Creates a new instance if one doesn't exist
 * @returns JokesRepository - The jokes repository instance
 */
export function getJokesRepository(): JokesRepository {
  if (!jokesRepository) {
    jokesRepository = new JokesRepositoryImpl()
  }
  return jokesRepository
}

/**
 * Set the jokes repository instance
 * Useful for testing to inject mock repositories
 * @param repository - The repository instance to use
 */
export function setJokesRepository(repository: JokesRepository): void {
  jokesRepository = repository
}
