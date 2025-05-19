import { toast } from 'vue-sonner'

export interface ToastOptions {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
  duration?: number
  closeButton?: boolean
  description?: string
}

export function useToast() {
  const defaultOptions: ToastOptions = {
    position: 'top-right',
    closeButton: true,
    duration: 5000,
  }

  /**
   * Show a success toast notification
   * @param message The main message to display
   * @param options Additional options for the toast
   */
  function success(message: string, options?: ToastOptions) {
    toast.success(message, { ...defaultOptions, ...options })
  }

  /**
   * Show an error toast notification
   * @param message The main message to display
   * @param options Additional options for the toast
   */
  function error(message: string, options?: ToastOptions) {
    toast.error(message, { ...defaultOptions, ...options })
  }

  /**
   * Show a warning toast notification
   * @param message The main message to display
   * @param options Additional options for the toast
   */
  function warning(message: string, options?: ToastOptions) {
    toast.warning(message, { ...defaultOptions, ...options })
  }

  /**
   * Show an info toast notification
   * @param message The main message to display
   * @param options Additional options for the toast
   */
  function info(message: string, options?: ToastOptions) {
    toast.info(message, { ...defaultOptions, ...options })
  }

  return {
    success,
    error,
    warning,
    info,
  }
}
