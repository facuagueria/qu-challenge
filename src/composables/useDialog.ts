import { ref } from 'vue'

/**
 * Composable for managing dialog state
 * @param initialState - Initial state of the dialog (open or closed)
 * @returns Dialog state and methods to control it
 */
export function useDialog(initialState = false) {
  const isOpen = ref(initialState)

  /**
   * Set the dialog state
   * @param state - New state for the dialog
   */
  function setIsOpen(state: boolean) {
    isOpen.value = state
  }

  /**
   * Open the dialog
   */
  function open() {
    isOpen.value = true
  }

  /**
   * Close the dialog
   */
  function close() {
    isOpen.value = false
  }

  /**
   * Toggle the dialog state
   */
  function toggle() {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    setIsOpen,
    open,
    close,
    toggle,
  }
}
