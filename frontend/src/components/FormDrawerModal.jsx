import React, { useEffect, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import { showToast } from '../utils/toast'
import './FormDrawerModal.scss'

const FormDrawerModal = ({
  show,
  onHide,
  children,
  className = '',
  contentClassName = '',
  backdrop = true,
  scrollable = true,
  onTestFill,
  enableTestFillHotkey = true,
  testFillToastMessage = 'Sample data loaded (Alt+F1)',
  size: _size,
  centered: _centered,
  ...props
}) => {
  const fillRef = useRef(onTestFill)
  fillRef.current = onTestFill

  useEffect(() => {
    if (!show || !enableTestFillHotkey || typeof onTestFill !== 'function') return undefined
    const handler = (e) => {
      if (!e.altKey) return
      if (e.key !== 'F1' && e.code !== 'F1' && e.keyCode !== 112) return
      e.preventDefault()
      fillRef.current?.()
      if (testFillToastMessage) showToast.info(testFillToastMessage)
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [show, enableTestFillHotkey, onTestFill, testFillToastMessage])

  return (
    <Modal
      show={show}
      onHide={onHide}
      animation
      backdrop={backdrop}
      scrollable={scrollable}
      centered={false}
      className={`tm-form-drawer-modal fade ${className}`.trim()}
      dialogClassName="tm-form-drawer-modal__dialog"
      contentClassName={`tm-form-drawer-modal__content ${contentClassName}`.trim()}
      {...props}
    >
      {children}
    </Modal>
  )
}

FormDrawerModal.Header = Modal.Header
FormDrawerModal.Title = Modal.Title
FormDrawerModal.Body = Modal.Body
FormDrawerModal.Footer = Modal.Footer

export default FormDrawerModal
