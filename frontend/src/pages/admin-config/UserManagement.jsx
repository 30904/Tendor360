import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Row, Col, Button, Form, Badge, Modal, Spinner } from 'react-bootstrap'
import FormDrawerModal from '../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, Eye, User, Mail, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../../utils/toast'
import { applyDomFormValues, dummyUserDomFormValues } from '../../utils/testFormDummies'
import DataTable from '../../components/DataTable'
import userAPI from '../../services/userAPI'
import './UserManagement.scss'

const UserManagement = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [stats, setStats] = useState({})
  const [roles, setRoles] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const [currentUser, setCurrentUser] = useState(null)
  const [viewingUser, setViewingUser] = useState(null)
  const userFormRef = useRef(null)

  // Load initial data
  useEffect(() => {
    loadCurrentUser()
    loadUsers()
    loadStats()
    loadRoles()
  }, [])

  // Load current user profile
  const loadCurrentUser = async () => {
    try {
      const response = await userAPI.getProfile()
      if (response.success) {
        setCurrentUser(response.data.user)
      }
    } catch (err) {
      console.error('Error loading current user:', err)
    }
  }

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!currentUser) return false
    
    // For now, allow all authenticated users to manage users for testing
    // In production, you might want to restrict this to specific roles
    return true
  }

  // Load users with current filters
  const loadUsers = async (page = 1, filters = {}) => {
    try {
      setLoading(true)
      
      const params = {
        page,
        limit: pagination.itemsPerPage,
        search: searchTerm,
        ...filters
      }

      const response = await userAPI.getUsers(params)
      
      if (response && response.success) {
        setUsers(response.data.users || [])
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10
        })
      } else {
        console.error('Failed to load users:', response?.message || 'Unknown error')
        setUsers([])
      }
    } catch (err) {
      console.error('Error loading users:', err)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Load user statistics
  const loadStats = async () => {
    try {
      const response = await userAPI.getUserStats()
      
      if (response.success) {
        setStats(response.data.overview || {})
      } else {
        console.error('Failed to load stats:', response.message)
        setStats({})
      }
    } catch (err) {
      console.error('Error loading stats:', err)
    }
  }

  // Load available roles
  const loadRoles = async () => {
    try {
      const response = await userAPI.getRoles()
      
      if (response && response.success) {
        const transformedRoles = response.data.roles.map(role => ({
          _id: role.value, // Use value as ID
          id: role.value,  // Also provide id for compatibility
          name: role.value, // Use value as name
          displayName: role.label // Use label as display name
        }))
        setRoles(transformedRoles)
      } else {
        console.error('Failed to load roles:', response?.message || 'Unknown error')
        setRoles([])
      }
    } catch (err) {
      console.error('Error loading roles:', err)
      setRoles([])
    }
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowModal(true)
  }

  const handleDeleteUser = async (user) => {
    // Prevent users from deleting themselves
    if (currentUser && user.id === currentUser.id) {
      showToast.error('You cannot delete your own account')
      return
    }

    if (window.confirm(`Are you sure you want to delete user "${user.firstName} ${user.lastName}"?`)) {
      try {
        setLoading(true)
        const response = await userAPI.deleteUser(user.id)
        
        if (response.success) {
          const message = 'User deleted successfully'
          showToast.success(message)
          loadUsers(pagination.currentPage)
          loadStats()
        } else {
          const errorMessage = response.message || 'Failed to delete user'
          showToast.error(errorMessage)
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to delete user'
        showToast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleViewUser = (user) => {
    setViewingUser(user)
  }

  const handleResetPassword = async (user) => {
    const newPassword = prompt(`Enter new password for ${user.firstName} ${user.lastName}:`)
    if (newPassword) {
      try {
        setLoading(true)
        const response = await userAPI.resetPassword(user.id, newPassword)
        
        if (response.success) {
          const message = 'Password reset successfully'
          showToast.success(message)
        } else {
          const errorMessage = response.message || 'Failed to reset password'
          showToast.error(errorMessage)
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to reset password'
        showToast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    loadUsers(1, { search: term })
  }

  const handleAddUser = () => {
    setEditingUser(null)
    setShowModal(true)
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const formData = new FormData(e.target)
      const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        role: formData.get('role'),
        department: formData.get('department'),
        position: formData.get('position'),
        phone: formData.get('phone'),
        isActive: formData.get('status') === 'Active'
      }

      // Add password for new users
      if (!editingUser) {
        userData.password = formData.get('password')
      }

      let response
      if (editingUser) {
        response = await userAPI.updateUser(editingUser.id, userData)
      } else {
        response = await userAPI.createUser(userData)
      }

      if (response.success) {
        const message = editingUser ? 'User updated successfully' : 'User created successfully'
        showToast.success(message)
        setShowModal(false)
        loadUsers(pagination.currentPage)
        loadStats()
      } else {
        const errorMessage = response.message || `Failed to ${editingUser ? 'update' : 'create'} user`
        showToast.error(errorMessage)
      }
    } catch (err) {
      const errorMessage = err.message || `Failed to ${editingUser ? 'update' : 'create'} user`
      showToast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'firstName',
      label: 'User',
      width: '25%',
      render: (value, row) => {
        if (!row) return <div>No data</div>;
        return (
          <div className="user-info">
            <div className="user-avatar">
              <User size={16} />
            </div>
            <div className="user-details">
              <div className="user-name">
                <strong>{row.firstName || 'N/A'} {row.lastName || 'N/A'}</strong>
              </div>
              <small className="text-muted">
                <Mail size={12} className="me-1" />
                {row.email || 'N/A'}
              </small>
            </div>
          </div>
        );
      }
    },
    {
      key: 'role',
      label: 'Role',
      width: '15%',
      render: (value, row) => {
        if (!row) return <div>No data</div>;
        // Handle both 'role' and 'roles' fields
        const roleValue = row.role || (row.roles && row.roles.length > 0 ? row.roles[0] : null);
        return getRoleBadge(roleValue);
      }
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (value, row) => {
        if (!row) return <div>No data</div>;
        return getStatusBadge(value);
      }
    },
    {
      key: 'department',
      label: 'Department',
      width: '15%',
      render: (value, row) => {
        if (!row) return <div>No data</div>;
        // Ensure department is a string
        return typeof value === 'string' ? value : String(value || 'N/A');
      }
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      width: '15%',
      render: (value, row) => {
        if (!row) return <div>No data</div>;
        if (!value) return 'Never';
        try {
          const date = new Date(value);
          if (isNaN(date.getTime())) return 'Invalid Date';
          return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          });
        } catch (error) {
          return 'Invalid Date';
        }
      }
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      Active: 'success',
      Inactive: 'secondary',
      Pending: 'warning'
    }
    // Ensure status is a string
    const statusValue = typeof status === 'string' ? status : String(status || 'Unknown');
    return <Badge bg={variants[statusValue] || 'secondary'}>{statusValue}</Badge>
  }

  const getRoleBadge = (role) => {
    const variants = {
      'SYSTEM ADMINISTRATOR': 'danger',
      'TENDER MANAGER': 'warning',
      'REVIEWER': 'info',
      'APPROVER': 'success',
      'PRICING ANALYST': 'primary',
      'TENDER SPECIALIST': 'info',
      'DOCUMENT MANAGER': 'secondary',
      'FINANCE MANAGER': 'warning',
      'COMPLIANCE OFFICER': 'dark',
      'PROJECT MANAGER': 'primary',
      'GUEST': 'secondary',
      'CONTRACT MANAGER': 'info',
      'QUALITY ASSURANCE': 'success',
      'BUSINESS ANALYST': 'primary'
    }
    // Ensure role is a string and handle null/undefined
    const roleValue = typeof role === 'string' ? role : String(role || 'Unknown');
    const displayName = roleValue ? roleValue.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown'
    return <Badge bg={variants[roleValue] || 'secondary'}>{displayName}</Badge>
  }

  const departments = ['IT', 'Operations', 'Finance', 'HR', 'Marketing', 'Sales']

  const insightItems = useMemo(() => {
    const items = []
    const total = stats.totalUsers || 0
    if (total > 0) {
      items.push({
        title: `${total} user accounts in directory with ${stats.activeUsers || 0} active`,
        detail: `${stats.inactiveUsers || 0} inactive and ${stats.recentActiveUsers || 0} recently active logins.`,
        tone: 'info'
      })
    }
    if ((stats.activeUsers || 0) > 0 && (stats.inactiveUsers || 0) > (stats.activeUsers || 0)) {
      items.push({
        title: 'Inactive users exceed a healthy proportion of the directory',
        detail: 'Review dormant accounts and access policies with your security team.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'User registry is ready for provisioning',
        detail: 'Add users and assign roles to activate collaboration across modules.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="user-management-page"
        showSkeleton={loading && !users.length}
        breadcrumbs={[
          { label: 'Admin & Configuration', onClick: () => navigate('/admin-config') },
          { label: 'User Management', active: true }
        ]}
        onBack={() => navigate('/admin-config')}
        title="User management command center"
        description="Manage users, roles, and permissions with live directory health."
        heroActions={(
          <Button size="sm" variant="outline-primary" onClick={() => loadUsers(pagination.currentPage)} disabled={loading}>
            {loading ? 'Refreshing...' : <><RefreshCw size={16} className="me-1" /> Refresh</>}
          </Button>
        )}
        heroMeta="Identity & access telemetry"
        outlookTitle="Directory intelligence outlook"
        outlookDescription={`${stats.totalUsers || 0} total users, ${stats.activeUsers || 0} active, ${stats.inactiveUsers || 0} inactive.`}
        outlookChips={[
          `${stats.totalUsers || 0} total`,
          `${stats.activeUsers || 0} active`,
          `${stats.inactiveUsers || 0} inactive`,
          `${stats.recentActiveUsers || 0} recent`
        ]}
        insights={insightItems}
        kpiTitle="User signal board"
        kpiMeta="Account coverage and activity"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total users"
                value={stats.totalUsers || 0}
                hint="Registered accounts"
                tone="intel"
                trend="Directory"
                icon={<User size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Active"
                value={stats.activeUsers || 0}
                hint="Signed-in eligible users"
                tone="success"
                trend="Live"
                icon={<Mail size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Inactive"
                value={stats.inactiveUsers || 0}
                hint="Requires review or offboarding"
                tone="warning"
                trend="Risk"
                icon={<User size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Recent active"
                value={stats.recentActiveUsers || 0}
                hint="Recent session activity"
                tone="intel"
                trend="Engagement"
                icon={<Eye size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Users (${pagination.totalItems})`}
        tableActions={(
          <Button variant="primary" onClick={handleAddUser} disabled={loading}>
            <Plus size={16} className="me-2" />
            Add User
          </Button>
        )}
      >
        <DataTable
          data={users}
          columns={columns}
          title={`Users (${pagination.totalItems})`}
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={pagination.itemsPerPage}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onSearch={handleSearch}
          onPageChange={(page) => loadUsers(page)}
          customActions={[
            {
              type: 'custom',
              label: 'Reset Password',
              onClick: handleResetPassword
            }
          ]}
          searchPlaceholder="Search users..."
          emptyMessage="No users found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

        {/* Add/Edit Modal */}
        <FormDrawerModal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          onTestFill={
            showModal
              ? () => {
                  const values = dummyUserDomFormValues()
                  const firstRole = roles[0]
                  if (firstRole) values.role = firstRole.name || firstRole.displayName || values.role
                  requestAnimationFrame(() => applyDomFormValues(userFormRef.current, values))
                }
              : undefined
          }
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingUser ? 'Edit User' : 'Add New User'}
            </Modal.Title>
          </Modal.Header>
          <Form ref={userFormRef} onSubmit={handleSubmitForm}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      defaultValue={editingUser?.firstName || ''}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      defaultValue={editingUser?.lastName || ''}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      defaultValue={editingUser?.email || ''}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Select name="department" defaultValue={editingUser?.department || ''}>
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role *</Form.Label>
                    <Form.Select name="role" defaultValue={editingUser?.role || ''} required>
                      <option value="">Select Role</option>
                      {roles.map(role => (
                        <option key={role._id || role.id} value={role.name}>{role.displayName || role.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" defaultValue={editingUser?.status || 'Active'}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Position</Form.Label>
                    <Form.Control
                      type="text"
                      name="position"
                      defaultValue={editingUser?.position || ''}
                      placeholder="Job title or position"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      defaultValue={editingUser?.phone || ''}
                      placeholder="Phone number"
                    />
                  </Form.Group>
                </Col>
              </Row>
              {!editingUser && (
                <Form.Group className="mb-3">
                  <Form.Label>Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    required
                    minLength={6}
                  />
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters long.
                  </Form.Text>
                </Form.Group>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" type="button" onClick={() => setShowModal(false)} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    {editingUser ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editingUser ? 'Update User' : 'Add User'
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </FormDrawerModal>

        <Modal show={viewingUser !== null} onHide={() => setViewingUser(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <User size={20} className="me-2" />
              User Details — {viewingUser?.firstName} {viewingUser?.lastName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {viewingUser ? (
              <Row>
                <Col md={6}>
                  <p><strong>Email:</strong> {viewingUser.email}</p>
                  <p><strong>Role:</strong> {viewingUser.role}</p>
                  <p><strong>Department:</strong> {viewingUser.department || '—'}</p>
                  <p><strong>Position:</strong> {viewingUser.position || '—'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Status:</strong> {viewingUser.status || (viewingUser.isActive ? 'Active' : 'Inactive')}</p>
                  <p><strong>Phone:</strong> {viewingUser.phone || '—'}</p>
                  <p><strong>Last login:</strong> {viewingUser.lastLoginAt ? new Date(viewingUser.lastLoginAt).toLocaleString() : '—'}</p>
                </Col>
              </Row>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" type="button" onClick={() => setViewingUser(null)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const user = viewingUser
                setViewingUser(null)
                handleEditUser(user)
              }}
            >
              Edit User
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default UserManagement
