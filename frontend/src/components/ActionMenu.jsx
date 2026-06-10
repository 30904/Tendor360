import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  AlertTriangle,
  Download,
  Play,
  UserRound,
  RefreshCw
} from 'lucide-react'
import './ActionMenu.scss'

const ICON_MAP = {
  view: Eye,
  edit: Edit,
  delete: Trash2,
  copy: Copy,
  risk: AlertTriangle,
  custom: Download,
  play: Play,
  run: Play,
  qualify: UserRound,
  sync: RefreshCw
}

const ICON_COLOR = {
  view: '#4678be',
  edit: '#4678be',
  copy: '#64748b',
  risk: '#f59e0b',
  custom: '#4678be',
  play: '#4678be',
  run: '#4678be',
  qualify: '#4678be',
  sync: '#4678be',
  delete: '#dc3545'
}

/**
 * Table action center — ellipsis trigger with dropdown (Leads-style).
 * Used by DataTable and any Bootstrap table via TableActionsCell.
 */
const ActionMenu = ({
  actions = [],
  onAction,
  className = '',
  menuWidth = 172,
  align = 'end',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  const closeMenu = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (!isOpen) return undefined

    const handleClickOutside = (event) => {
      if (
        buttonRef.current?.contains(event.target) ||
        menuRef.current?.contains(event.target)
      ) {
        return
      }
      closeMenu()
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') closeMenu()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, closeMenu])

  const calculateMenuPosition = () => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const left =
      align === 'end'
        ? rect.right - menuWidth
        : rect.left
    setMenuPosition({
      top: rect.bottom + 4,
      left: Math.max(8, left)
    })
  }

  const handleMenuToggle = (e) => {
    e.stopPropagation()
    if (disabled) return
    if (!isOpen) calculateMenuPosition()
    setIsOpen((open) => !open)
  }

  const resolveIcon = (action) => {
    if (action.icon && typeof action.icon === 'function') {
      return action.icon
    }
    const key = action.icon || action.type || 'custom'
    return ICON_MAP[key] || ICON_MAP.custom
  }

  const handleActionClick = (e, action) => {
    e.stopPropagation()
    if (action.disabled) return
    onAction?.(action)
    closeMenu()
  }

  if (!actions.length) {
    return null
  }

  return (
    <div
      className={`table-action-center ${className}`.trim()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`table-action-center__trigger ${isOpen ? 'is-open' : ''}`}
        onClick={handleMenuToggle}
        disabled={disabled}
        aria-label="Row actions"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <MoreHorizontal size={16} aria-hidden />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="table-action-center__menu"
            role="menu"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              minWidth: menuWidth
            }}
          >
            {actions.map((action, index) => {
              const Icon = resolveIcon(action)
              const isDanger = action.variant === 'danger' || action.type === 'delete'
              const iconColor = isDanger ? ICON_COLOR.delete : ICON_COLOR[action.type] || ICON_COLOR.custom

              return (
                <button
                  key={action.key || `${action.type}-${index}`}
                  type="button"
                  role="menuitem"
                  className={`table-action-center__item ${isDanger ? 'table-action-center__item--danger' : ''}`}
                  disabled={action.disabled}
                  onClick={(e) => handleActionClick(e, action)}
                >
                  <Icon size={16} className="table-action-center__item-icon" style={{ color: iconColor }} />
                  <span className="table-action-center__item-label">{action.label}</span>
                </button>
              )
            })}
          </div>,
          document.body
        )}
    </div>
  )
}

export default ActionMenu

/** Alias for documentation and new imports */
export const TableActionCenter = ActionMenu
