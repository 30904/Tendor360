import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { toast } from 'react-toastify'
import {
  BiMenu,
  BiX,
  BiHome,
  BiSearch,
  BiFile,
  BiCalculator,
  BiCalendar,
  BiTrophy,
  BiBarChart,
  BiCog,
  BiUser,
  BiHelpCircle,
  BiLogOut,
  BiCheckSquare,
  BiChevronDown,
  BiChevronRight,
  BiBullseye,
  BiGlobe,
  BiCheckCircle,
  BiClipboard,
} from 'react-icons/bi'
import tender360BrandMark from '../assets/tender360-brand-mark.svg'
import { BUYER_NAVIGATION } from '../config/navigation'
import { userHasAnyRole, formatUserRolesLabel } from '../utils/roles'
import './HierarchicalSidebar.scss'

const NAV_ICONS = {
  home: BiHome,
  radar: BiGlobe,
  search: BiSearch,
  workspace: BiBullseye,
  file: BiFile,
  check: BiCheckSquare,
  decision: BiCheckCircle,
  collaboration: BiClipboard,
  calculator: BiCalculator,
  calendar: BiCalendar,
  trophy: BiTrophy,
  chart: BiBarChart,
  cog: BiCog,
  help: BiHelpCircle,
}

const HierarchicalSidebar = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileSidebarOpen = false,
  onCloseMobileSidebar,
  showNavLabels = true,
  viewportMobile = false,
}) => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleMenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }))
  }

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      toast.success('Logged out successfully!')
      onCloseMobileSidebar?.()
      navigate('/login')
    } catch {
      toast.error('Logout failed. Please try again.')
    }
  }

  const isActiveRoute = (path, matchPaths = [path]) => {
    return matchPaths.some(
      (candidate) =>
        location.pathname === candidate || location.pathname.startsWith(`${candidate}/`)
    )
  }

  const isParentActive = (submenus) => {
    return submenus.some((submenu) => isActiveRoute(submenu.path))
  }

  const navigationItems = useMemo(
    () =>
      BUYER_NAVIGATION.map((item) => ({
        ...item,
        icon: NAV_ICONS[item.icon] || BiHome,
        type: 'single',
      })),
    []
  )

  const filteredNavigationItems = useMemo(
    () =>
      navigationItems.filter((item) => {
        if (!item.roles) return true
        return userHasAnyRole(user, item.roles)
      }),
    [navigationItems, user]
  )

  const renderMenuItem = (item) => {
    const Icon = item.icon
    const isExpanded = expandedMenus[item.key]
    const isActive =
      item.type === 'single'
        ? isActiveRoute(item.path, item.matchPaths || [item.path])
        : isParentActive(item.submenus)

    if (item.type === 'single') {
      return (
        <div
          key={item.key}
          className={`nav-item ${isActive ? 'active' : ''}`}
          onClick={() => {
            navigate(item.path)
            onCloseMobileSidebar?.()
          }}
          title={item.titleFull || item.label}
        >
          <Icon className="nav-icon" />
          {showNavLabels && <span className="nav-label">{item.label}</span>}
        </div>
      )
    }

    return (
      <div key={item.key} className="nav-parent">
        <div
          className={`nav-item parent ${isActive ? 'active' : ''}`}
          onClick={() => toggleMenu(item.key)}
          title={item.titleFull || item.label}
        >
          <Icon className="nav-icon" />
          {showNavLabels && (
            <>
              <span className="nav-label">{item.label}</span>
              {isExpanded ? <BiChevronDown className="nav-arrow" /> : <BiChevronRight className="nav-arrow" />}
            </>
          )}
        </div>

        {showNavLabels && isExpanded && (
          <div className="nav-submenu">
            {item.submenus.map((submenu) => {
              const SubIcon = submenu.icon
              const isSubActive = isActiveRoute(submenu.path)

              return (
                <div
                  key={submenu.path}
                  className={`nav-subitem ${isSubActive ? 'active' : ''}`}
                  onClick={() => {
                    navigate(submenu.path)
                    onCloseMobileSidebar?.()
                  }}
                >
                  <SubIcon className="nav-subicon" />
                  <span className="nav-sublabel">{submenu.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const handleHeaderToggle = () => {
    if (viewportMobile) {
      onCloseMobileSidebar?.()
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  const sidebarDrawerOpen = viewportMobile && mobileSidebarOpen

  return (
    <div
      id="app-hierarchical-sidebar"
      className={`hierarchical-sidebar${sidebarDrawerOpen ? ' show' : ''}`}
    >
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <img src={tender360BrandMark} alt="Tender360 brand" className="logo-mark" />
          </div>
          <div className="logo-text">
            <h3>Tender360</h3>
            <span className="logo-subtitle">AI Tender Intelligence Platform</span>
          </div>
        </div>
        <button
          type="button"
          className="sidebar-toggle"
          aria-label={viewportMobile ? 'Close menu' : sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={handleHeaderToggle}
        >
          {viewportMobile || !sidebarCollapsed ? <BiX /> : <BiMenu />}
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {filteredNavigationItems.map(renderMenuItem)}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-content">
          <div className="user-info">
            <div className="user-avatar">
              <BiUser />
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-role">{formatUserRolesLabel(user)}</span>
            </div>
          </div>
          <div className="footer-actions">
            <button className="footer-btn logout-btn" title="Logout" onClick={handleLogout}>
              <BiLogOut />
              {showNavLabels && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HierarchicalSidebar
