import { useStorage } from '@vueuse/core'
import { ref } from 'vue'

export interface CacheOptions {
  /**
   * Time in milliseconds after which the cache is considered stale
   * Default: 5 minutes (300.000 ms)
   */
  expirationTime?: number

  /**
   * Whether to return stale data while fetching fresh data
   * Default: true
   */
  staleWhileRevalidate?: boolean
}

interface CachedData<T> {
  data: T
  timestamp: number
}

/**
 * Composable for caching API responses in localStorage
 * @param key - The key to use for storing in localStorage
 * @param defaultValue - The default value to return if no cached data exists
 * @param options - Cache options
 */
export function useApiCache<T>(
  key: string,
  defaultValue: T,
  options: CacheOptions = {},
) {
  // Default options
  const expirationTime = options.expirationTime || 5 * 60 * 1000 // 5 minutes
  const staleWhileRevalidate = options.staleWhileRevalidate !== false

  // Use VueUse's useStorage to handle localStorage
  const storage = useStorage<CachedData<T> | null>(
    `api-cache-${key}`,
    null,
    // Explicitly use localStorage (default) and ensure proper serialization
    localStorage,
    {
      serializer: {
        read: (v: string) => v ? JSON.parse(v) : null,
        write: (v: CachedData<T> | null) => JSON.stringify(v),
      },
    },
  )

  // Flag to track if we're currently fetching data
  const isLoading = ref(false)

  /**
   * Get data from cache or fetch it if it's stale or doesn't exist
   * @param fetchFn - Function to fetch fresh data
   * @returns Promise with the data
   */
  async function getWithCache(fetchFn: () => Promise<T>): Promise<T> {
    const cachedData = storage.value
    const now = Date.now()

    // Check if we have valid cached data
    if (cachedData && (now - cachedData.timestamp) < expirationTime) {
      // Cache is still valid
      return cachedData.data
    }

    // If we have stale data and staleWhileRevalidate is true, return it while fetching
    if (staleWhileRevalidate && cachedData) {
      // Fetch in the background without blocking
      refreshCache(fetchFn).catch((error) => {
        console.error('Error refreshing cache in background:', error)
      })
      return cachedData.data
    }

    // No valid cache, fetch fresh data
    return refreshCache(fetchFn)
  }

  /**
   * Fetch fresh data and update the cache
   * @param fetchFn - Function to fetch fresh data
   * @returns Promise with the fresh data
   */
  async function refreshCache(fetchFn: () => Promise<T>): Promise<T> {
    isLoading.value = true

    try {
      const freshData = await fetchFn()

      // Update the cache with fresh data and the current timestamp
      storage.value = {
        data: freshData,
        timestamp: Date.now(),
      }

      return freshData
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * Clear the cache for this key
   */
  function clearCache(): void {
    storage.value = null
  }

  return {
    getWithCache,
    refreshCache,
    clearCache,
    isLoading,
  }
}
