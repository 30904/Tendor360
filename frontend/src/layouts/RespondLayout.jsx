import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import './RespondLayout.scss'

const RespondLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logout()).unwrap()
    navigate('/login')
  }

  return (
    <div className="respond-layout page-bg-gradient">
      <header className="respond-header">
        <div className="respond-brand">
          <span className="respond-logo">T</span>
          <div>
            <strong>Tender360</strong>
            <div className="respond-sub">Partner Collaboration</div>
          </div>
        </div>
        <nav className="respond-nav">
          <NavLink to="/respond/inbox" className={({ isActive }) => (isActive ? 'active' : '')}>
            Inbox
          </NavLink>
          <NavLink to="/respond/redeem" className={({ isActive }) => (isActive ? 'active' : '')}>
            Redeem
          </NavLink>
        </nav>
        <Button variant="outline-primary" size="sm" onClick={handleLogout}>
          Log out
        </Button>
      </header>
      <main className="respond-main">
        <Outlet />
      </main>
    </div>
  )
}

export default RespondLayout
