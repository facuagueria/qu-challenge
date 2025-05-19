import { describe, expect, it } from 'vitest'
import { useDialog } from './useDialog'

describe('useDialog', () => {
  // Test default initialization
  it('initializes with default state (closed)', () => {
    const dialog = useDialog()
    expect(dialog.isOpen.value).toBe(false)
  })

  // Test custom initialization
  it('initializes with custom state (open)', () => {
    const dialog = useDialog(true)
    expect(dialog.isOpen.value).toBe(true)
  })

  // Test setIsOpen method
  it('sets dialog state correctly', () => {
    const dialog = useDialog(false)

    // Initially closed
    expect(dialog.isOpen.value).toBe(false)

    // Set to open
    dialog.setIsOpen(true)
    expect(dialog.isOpen.value).toBe(true)

    // Set to closed again
    dialog.setIsOpen(false)
    expect(dialog.isOpen.value).toBe(false)
  })

  // Test open method
  it('opens dialog correctly', () => {
    const dialog = useDialog(false)

    // Initially closed
    expect(dialog.isOpen.value).toBe(false)

    // Open the dialog
    dialog.open()
    expect(dialog.isOpen.value).toBe(true)

    // Open when already open (should remain open)
    dialog.open()
    expect(dialog.isOpen.value).toBe(true)
  })

  // Test close method
  it('closes dialog correctly', () => {
    const dialog = useDialog(true)

    // Initially open
    expect(dialog.isOpen.value).toBe(true)

    // Close the dialog
    dialog.close()
    expect(dialog.isOpen.value).toBe(false)

    // Close when already closed (should remain closed)
    dialog.close()
    expect(dialog.isOpen.value).toBe(false)
  })

  // Test toggle method
  it('toggles dialog state correctly', () => {
    const dialog = useDialog(false)

    // Initially closed
    expect(dialog.isOpen.value).toBe(false)

    // Toggle to open
    dialog.toggle()
    expect(dialog.isOpen.value).toBe(true)

    // Toggle to closed
    dialog.toggle()
    expect(dialog.isOpen.value).toBe(false)
  })

  // Test all methods in sequence
  it('handles a sequence of operations correctly', () => {
    const dialog = useDialog()

    // Initially closed
    expect(dialog.isOpen.value).toBe(false)

    // Open
    dialog.open()
    expect(dialog.isOpen.value).toBe(true)

    // Toggle to closed
    dialog.toggle()
    expect(dialog.isOpen.value).toBe(false)

    // Set to open
    dialog.setIsOpen(true)
    expect(dialog.isOpen.value).toBe(true)

    // Close
    dialog.close()
    expect(dialog.isOpen.value).toBe(false)
  })
})
