import { beforeEach, describe, expect, it, vi } from 'vitest'
// Import the mocked toast after mocking
import { toast } from 'vue-sonner'

import { useToast } from './useToast'

// Mock vue-sonner toast
vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}))

describe('useToast', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  // Test success toast
  it('shows success toast with default options', () => {
    const { success } = useToast()
    const message = 'Operation successful'

    success(message)

    expect(toast.success).toHaveBeenCalledWith(message, {
      position: 'top-right',
      closeButton: true,
      duration: 5000,
    })
  })

  // Test success toast with custom options
  it('shows success toast with custom options', () => {
    const { success } = useToast()
    const message = 'Operation successful'
    const customOptions = {
      position: 'bottom-center' as const,
      duration: 3000,
    }

    success(message, customOptions)

    expect(toast.success).toHaveBeenCalledWith(message, {
      position: 'bottom-center',
      closeButton: true,
      duration: 3000,
    })
  })

  // Test error toast
  it('shows error toast with default options', () => {
    const { error } = useToast()
    const message = 'Operation failed'

    error(message)

    expect(toast.error).toHaveBeenCalledWith(message, {
      position: 'top-right',
      closeButton: true,
      duration: 5000,
    })
  })

  // Test error toast with custom options
  it('shows error toast with custom options', () => {
    const { error } = useToast()
    const message = 'Operation failed'
    const customOptions = {
      position: 'top-left' as const,
      closeButton: false,
    }

    error(message, customOptions)

    expect(toast.error).toHaveBeenCalledWith(message, {
      position: 'top-left',
      closeButton: false,
      duration: 5000,
    })
  })

  // Test warning toast
  it('shows warning toast with default options', () => {
    const { warning } = useToast()
    const message = 'Proceed with caution'

    warning(message)

    expect(toast.warning).toHaveBeenCalledWith(message, {
      position: 'top-right',
      closeButton: true,
      duration: 5000,
    })
  })

  // Test warning toast with custom options
  it('shows warning toast with custom options', () => {
    const { warning } = useToast()
    const message = 'Proceed with caution'
    const customOptions = {
      description: 'Additional details about the warning',
    }

    warning(message, customOptions)

    expect(toast.warning).toHaveBeenCalledWith(message, {
      position: 'top-right',
      closeButton: true,
      duration: 5000,
      description: 'Additional details about the warning',
    })
  })

  // Test info toast
  it('shows info toast with default options', () => {
    const { info } = useToast()
    const message = 'For your information'

    info(message)

    expect(toast.info).toHaveBeenCalledWith(message, {
      position: 'top-right',
      closeButton: true,
      duration: 5000,
    })
  })

  // Test info toast with custom options
  it('shows info toast with custom options', () => {
    const { info } = useToast()
    const message = 'For your information'
    const customOptions = {
      position: 'bottom-right' as const,
      duration: 10000,
    }

    info(message, customOptions)

    expect(toast.info).toHaveBeenCalledWith(message, {
      position: 'bottom-right',
      closeButton: true,
      duration: 10000,
    })
  })

  // Test that options are merged correctly
  it('merges default and custom options correctly', () => {
    const { success } = useToast()
    const message = 'Operation successful'

    // Only override some options
    const partialOptions = {
      duration: 2000,
    }

    success(message, partialOptions)

    // Check that non-overridden options remain at default values
    expect(toast.success).toHaveBeenCalledWith(message, {
      position: 'top-right', // Default
      closeButton: true, // Default
      duration: 2000, // Custom
    })
  })
})
