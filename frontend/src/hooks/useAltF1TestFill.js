import { useEffect, useRef } from 'react'
import { showToast } from '../utils/toast'

/**
 * Global Alt+F1 handler for full-page forms (not using FormDrawerModal).
 * Uses capture phase so browser F1 help is suppressed while enabled.
 */
export function useAltF1TestFill(enabled, onFill, options = {}) {
  const { toastMessage = 'Sample data loaded (Alt+F1)', silent = false } = options
  const cbRef = useRef(onFill)
  cbRef.current = onFill

  useEffect(() => {
    if (!enabled || typeof onFill !== 'function') return undefined
    const handler = (e) => {
      if (!e.altKey) return
      if (e.key !== 'F1' && e.code !== 'F1' && e.keyCode !== 112) return
      e.preventDefault()
      cbRef.current?.()
      if (!silent && toastMessage) showToast.info(toastMessage)
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [enabled, onFill, silent, toastMessage])
}
