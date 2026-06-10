import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Dropdown } from 'react-bootstrap'
import { BiCog } from 'react-icons/bi'
import { setAccessToken } from '../store/slices/authSlice'
import { toast } from 'react-toastify'

const RoleSwitcher = () => {
  const [currentRole, setCurrentRole] = useState('TENDER_MANAGER')
  const dispatch = useDispatch()

  const roles = [
    { key: 'TENDER_MANAGER', label: 'Tender Manager', color: 'primary' },
    { key: 'REVIEWER', label: 'Reviewer', color: 'warning' },
    { key: 'APPROVER', label: 'Approver', color: 'info' },
    { key: 'PRICING_ANALYST', label: 'Pricing Analyst', color: 'success' },
    { key: 'ADMIN', label: 'Admin', color: 'danger' },
    { key: 'GUEST', label: 'Guest', color: 'secondary' }
  ]

  const handleRoleChange = (roleKey) => {
    setCurrentRole(roleKey)
    // In a real app, this would update the user's role in the backend
    // For now, we'll just update the local state
    toast.info(`Switched to role: ${roleKey}`)
  }

  return (
    <div className="role-switcher" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" size="sm">
          <BiCog className="me-1" />
          Role: {currentRole}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Header>Switch Role (Dev Only)</Dropdown.Header>
          {roles.map((role) => (
            <Dropdown.Item
              key={role.key}
              onClick={() => handleRoleChange(role.key)}
              active={currentRole === role.key}
            >
              <span className={`badge bg-${role.color} me-2`}>{role.key}</span>
              {role.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default RoleSwitcher
