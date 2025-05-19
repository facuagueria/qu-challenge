import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useApiCache } from './useApiCache'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

// Mock Date.now to control time
const originalDateNow = Date.now

describe('useApiCache', () => {
  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })

    // Reset localStorage mock
    localStorageMock.clear()

    // Reset all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Restore original Date.now
    Date.now = originalDateNow
  })

  // Test initialization
  it('initializes with default options', () => {
    const cache = useApiCache('test-key', null)
    expect(cache.isLoading.value).toBe(false)
  })

  // Test getWithCache with no existing cache
  it('fetches data when no cache exists', async () => {
    // Mock current time
    const now = 1000
    Date.now = vi.fn(() => now)

    const mockData = { id: 1, name: 'Test' }
    const fetchFn = vi.fn().mockResolvedValue(mockData)

    const cache = useApiCache('test-key', null)
    const result = await cache.getWithCache(fetchFn)

    // Should call fetch function
    expect(fetchFn).toHaveBeenCalledTimes(1)

    // Should return fetched data
    expect(result).toEqual(mockData)

    // Should store in localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'api-cache-test-key',
      JSON.stringify({ data: mockData, timestamp: now }),
    )
  })

  // Test getWithCache with valid cache
  it('returns cached data when cache is valid', async () => {
    // Mock current time
    const initialTime = 1000
    const cachedData = { id: 1, name: 'Cached' }

    // Setup cache
    localStorageMock.setItem(
      'api-cache-test-key',
      JSON.stringify({ data: cachedData, timestamp: initialTime }),
    )

    // Set current time to be within expiration window (default 5 minutes)
    Date.now = vi.fn(() => initialTime + 1000) // 1 second later

    const fetchFn = vi.fn().mockResolvedValue({ id: 2, name: 'Fresh' })

    const cache = useApiCache('test-key', null)
    const result = await cache.getWithCache(fetchFn)

    // Should not call fetch function
    expect(fetchFn).not.toHaveBeenCalled()

    // Should return cached data
    expect(result).toEqual(cachedData)
  })

  // Test getWithCache with expired cache and staleWhileRevalidate=true
  it('returns stale data and refreshes in background when cache is expired', async () => {
    // Mock initial time
    const initialTime = 1000
    const cachedData = { id: 1, name: 'Stale' }
    const freshData = { id: 2, name: 'Fresh' }

    // Setup cache
    localStorageMock.setItem(
      'api-cache-test-key',
      JSON.stringify({ data: cachedData, timestamp: initialTime }),
    )

    // Set the current time to be beyond the expiration window (default 5 minutes)
    const currentTime = initialTime + (6 * 60 * 1000) // 6 minutes later
    Date.now = vi.fn(() => currentTime)

    const fetchFn = vi.fn().mockResolvedValue(freshData)

    const cache = useApiCache('test-key', null)
    const result = await cache.getWithCache(fetchFn)

    // Should return stale data immediately
    expect(result).toEqual(cachedData)

    // Should call fetch function in the background
    expect(fetchFn).toHaveBeenCalledTimes(1)

    // Wait for background refresh to complete
    // Use a small timeout to allow the Promise to resolve
    await new Promise(resolve => setTimeout(resolve, 0))

    // Should update cache with fresh data
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'api-cache-test-key',
      expect.stringContaining(JSON.stringify(freshData)),
    )
  })

  // Test getWithCache with expired cache and staleWhileRevalidate=false
  it('fetches fresh data when cache is expired and staleWhileRevalidate=false', async () => {
    // Mock initial time
    const initialTime = 1000
    const cachedData = { id: 1, name: 'Stale' }
    const freshData = { id: 2, name: 'Fresh' }

    // Setup cache
    localStorageMock.setItem(
      'api-cache-test-key',
      JSON.stringify({ data: cachedData, timestamp: initialTime }),
    )

    // Set current time to be beyond expiration window
    const currentTime = initialTime + (6 * 60 * 1000) // 6 minutes later
    Date.now = vi.fn(() => currentTime)

    const fetchFn = vi.fn().mockResolvedValue(freshData)

    const cache = useApiCache('test-key', null, { staleWhileRevalidate: false })
    const result = await cache.getWithCache(fetchFn)

    // Should call fetch function
    expect(fetchFn).toHaveBeenCalledTimes(1)

    // Should return fresh data
    expect(result).toEqual(freshData)

    // Should update cache with fresh data
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'api-cache-test-key',
      JSON.stringify({ data: freshData, timestamp: currentTime }),
    )
  })

  // Test refreshCache
  it('refreshes cache with fresh data', async () => {
    const currentTime = 2000
    Date.now = vi.fn(() => currentTime)

    const freshData = { id: 3, name: 'Fresh' }
    const fetchFn = vi.fn().mockResolvedValue(freshData)

    const cache = useApiCache('test-key', null)

    // Before refresh
    expect(cache.isLoading.value).toBe(false)

    const result = await cache.refreshCache(fetchFn)

    // Should return fresh data
    expect(result).toEqual(freshData)

    // Should update cache with fresh data
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'api-cache-test-key',
      JSON.stringify({ data: freshData, timestamp: currentTime }),
    )

    // After refresh
    expect(cache.isLoading.value).toBe(false)
  })

  // Test error handling
  it('handles fetch errors correctly', async () => {
    const error = new Error('Fetch failed')
    const fetchFn = vi.fn().mockRejectedValue(error)

    const cache = useApiCache('test-key', null)

    // Before fetch
    expect(cache.isLoading.value).toBe(false)

    // Should throw the error
    await expect(cache.getWithCache(fetchFn)).rejects.toThrow('Fetch failed')

    // After error
    expect(cache.isLoading.value).toBe(false)
  })

  // Test custom expiration time
  it('respects custom expiration time', async () => {
    // Mock initial time
    const initialTime = 1000
    const cachedData = { id: 1, name: 'Cached' }

    // Setup cache
    localStorageMock.setItem(
      'api-cache-test-key',
      JSON.stringify({ data: cachedData, timestamp: initialTime }),
    )

    // Set custom expiration time to 10 seconds
    const customExpirationTime = 10 * 1000

    // Set current time to be within custom expiration window
    Date.now = vi.fn(() => initialTime + 9000) // 9 seconds later

    const fetchFn = vi.fn().mockResolvedValue({ id: 2, name: 'Fresh' })

    const cache = useApiCache('test-key', null, { expirationTime: customExpirationTime })
    const result = await cache.getWithCache(fetchFn)

    // Should not call fetch function as we're still within expiration window
    expect(fetchFn).not.toHaveBeenCalled()

    // Should return cached data
    expect(result).toEqual(cachedData)

    // Now set time beyond custom expiration
    Date.now = vi.fn(() => initialTime + 11000) // 11 seconds later

    await cache.getWithCache(fetchFn)

    // Should call fetch function now
    expect(fetchFn).toHaveBeenCalledTimes(1)
  })
})
