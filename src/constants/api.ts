// API URLs configuration

// Base URL for all API requests
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://official-joke-api.appspot.com'

// Endpoint paths
export const API_ENDPOINTS = {
  TYPES: '/types',
  RANDOM_JOKES: '/jokes/random/10',
}

// Full URLs (combining base URL and endpoints)
export const API_URLS = {
  TYPES: `${API_BASE_URL}${API_ENDPOINTS.TYPES}`,
  RANDOM_JOKES: `${API_BASE_URL}${API_ENDPOINTS.RANDOM_JOKES}`,
}
