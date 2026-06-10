import React, { useState, useEffect, useMemo } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Navbar, Dropdown, Badge } from 'react-bootstrap'
import { 
  BiMenu, 
  BiSearch,
  BiCommand,
  BiUser,
  BiBell,
  BiLogOut,
  BiCheckSquare,
  BiCog,
} from 'react-icons/bi'

import { logout } from '../store/slices/authSlice'
import RoleSwitcher from '../components/RoleSwitcher'
import HierarchicalSidebar from '../components/HierarchicalSidebar'
import { toast } from 'react-toastify'
import { isDevelopment } from '../utils/env'
import { userHasAnyRole, ADMIN_NAV_ROLES } from '../utils/roles'
import './MainLayout.scss'

const MOBILE_BREAKPOINT = '(max-width: 768px)'

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [viewportMobile, setViewportMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_BREAKPOINT).matches
  )
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_BREAKPOINT)
    const sync = () => setViewportMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!viewportMobile) setMobileSidebarOpen(false)
  }, [viewportMobile])

  const showNavLabels = !sidebarCollapsed || (viewportMobile && mobileSidebarOpen)

  const companyDisplayName = useMemo(() => {
    const c = user?.company ?? user?.companyId
    if (!c || typeof c !== 'object') return ''
    return String(c.displayName ?? c.name ?? '').trim()
  }, [user])

  const showAdminNav = userHasAnyRole(user, ADMIN_NAV_ROLES)

  const handleMenuToggle = () => {
    if (window.matchMedia(MOBILE_BREAKPOINT).matches) {
      setMobileSidebarOpen((open) => !open)
    } else {
      setSidebarCollapsed((c) => !c)
    }
  }

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      toast.success('Logged out successfully!')
      navigate('/login')
    } catch (error) {
      toast.error('Logout failed. Please try again.')
    }
  }

  // Navigation is now handled by HierarchicalSidebar component

  return (
    <div className={`main-layout ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Hierarchical Sidebar */}
      {mobileSidebarOpen && viewportMobile && (
        <button
          type="button"
          className="sidebar-mobile-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <HierarchicalSidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        mobileSidebarOpen={mobileSidebarOpen}
        onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
        showNavLabels={showNavLabels}
        viewportMobile={viewportMobile}
      />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navbar */}
        <Navbar className="top-navbar" expand="lg">
          <Container fluid className="top-navbar-inner">
            <div className="navbar-left">
              <button
                type="button"
                className="menu-toggle"
                aria-expanded={viewportMobile ? mobileSidebarOpen : !sidebarCollapsed}
                aria-controls="app-hierarchical-sidebar"
                onClick={handleMenuToggle}
              >
                <BiMenu />
              </button>
              
              <div className="workspace-context">
                {companyDisplayName ? (
                  <div
                    className="company-name"
                    title={companyDisplayName}
                  >
                    {companyDisplayName}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="navbar-center">
              <div className="header-search">
                <BiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search tenders, RFPs, teams..."
                  aria-label="Global search"
                />
                <span className="search-shortcut">
                  <BiCommand />
                  K
                </span>
              </div>
            </div>

            <div className="navbar-right">
              <button className="header-action-btn ghost" onClick={() => navigate('/my-work')}>
                <BiCheckSquare />
                <span>My Work</span>
              </button>

              {/* Notifications */}
              <Dropdown className="notification-dropdown" align="end">
                <Dropdown.Toggle variant="link" className="notification-toggle">
                  <BiBell className="notification-icon" />
                  <Badge bg="danger" className="notification-badge">3</Badge>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Header>Notifications</Dropdown.Header>
                  <Dropdown.Item>New tender published</Dropdown.Item>
                  <Dropdown.Item>Evaluation deadline approaching</Dropdown.Item>
                  <Dropdown.Item>Document review required</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {showAdminNav ? (
                <button
                  className="header-action-btn ghost"
                  onClick={() => navigate('/admin-config')}
                  title="Administration"
                >
                  <BiCog />
                  <span>Admin</span>
                </button>
              ) : null}

              {/* User Menu */}
              <Dropdown className="user-dropdown" align="end">
                <Dropdown.Toggle variant="link" className="user-toggle">
                  <div className="user-avatar">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Header>
                    <div className="user-info">
                      <div className="user-name">{user?.name}</div>
                      {companyDisplayName ? (
                        <div className="user-company">{companyDisplayName}</div>
                      ) : null}
                    </div>
                  </Dropdown.Header>
                  <Dropdown.Item onClick={() => navigate('/profile')}>
                    <BiUser /> Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate('/my-work')}>
                    <BiCheckSquare /> My Work
                  </Dropdown.Item>
                  {showAdminNav ? (
                    <>
                      <Dropdown.Item onClick={() => navigate('/admin-config')}>
                        <BiCog /> Administration
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => navigate('/admin-config/discovery-connectors')}>
                        <BiCog /> Discovery connectors
                      </Dropdown.Item>
                    </>
                  ) : null}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <BiLogOut /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Container>
        </Navbar>

        {/* Page Content */}
        <div className="page-content">
          <Container fluid>
            <Outlet />
          </Container>
        </div>
      </div>

      {/* Role Switcher (Dev Only) - TEMPORARILY DISABLED */}
      {false && isDevelopment() && (
        <RoleSwitcher />
      )}
    </div>
  )
}

export default MainLayout
