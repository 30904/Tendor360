import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal, Alert, Spinner } from 'react-bootstrap'
import FormDrawerModal from '../../components/FormDrawerModal'
import { Plus, Edit, Shield, Users, Key, Settings, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import roleAPI from '../../services/roleAPI'
import { dummyRoleForm } from '../../utils/testFormDummies'
import './RolesPermissions.scss'

const RolesPermissions = () => {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  
  // State management
  const [roles, setRoles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [permissions, setPermissions] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  })
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [],
    isActive: true,
    priority: 0
  })
  const [formErrors, setFormErrors] = useState({})
  const [isEditing, setIsEditing] = useState(false)

  // Load roles from API
  const loadRoles = async (page = 1, filters = {}) => {
    try {
      setLoading(true)
      setError('')
      
      const params = {
        page,
        limit: pagination.itemsPerPage,
        ...filters
      }
      
      console.log('Loading roles with params:', params)
      const response = await roleAPI.getRoles(params)
      console.log('Roles API response:', response)
      
      if (response.success) {
        console.log('Roles loaded:', response.data.roles)
        setRoles(response.data.roles)
        setPagination(response.data.pagination)
      } else {
        setError(response.message || 'Failed to load roles')
      }
    } catch (err) {
      console.error('Error loading roles:', err)
      setError(err.response?.data?.message || 'Failed to load roles')
    } finally {
      setLoading(false)
    }
  }

  // Load role statistics
  const loadStats = async () => {
    try {
      const response = await roleAPI.getRoleStats()
      
      if (response.success) {
        setStats(response.data.overview)
      }
    } catch (err) {
      console.error('Error loading role stats:', err)
    }
  }

  // Load permissions
  const loadPermissions = async () => {
    try {
      console.log('Loading permissions...')
      const response = await roleAPI.getPermissions()
      console.log('Permissions API response:', response)
      
      if (response.success) {
        console.log('Setting permissions:', response.data.permissions)
        setPermissions(response.data.permissions)
      } else {
        console.error('Failed to load permissions:', response.message)
      }
    } catch (err) {
      console.error('Error loading permissions:', err)
    }
  }

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!user) return false
    
    // For now, allow all authenticated users to manage roles for testing
    // In production, you might want to restrict this to specific roles
    return true
  }

  useEffect(() => {
    loadRoles()
    loadStats()
    loadPermissions()
  }, [])

  const handleViewRole = (role) => {
    setSelectedRole(role)
    setShowModal(true)
  }

  const handleEditRole = (role) => {
    console.log('Editing role:', role)
    console.log('Role permissions:', role.permissions)
    console.log('Available permissions:', permissions)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions || [],
      isActive: role.isActive,
      priority: role.priority || 0
    })
    setIsEditing(true)
    setSelectedRole(role)
    setShowFormModal(true)
  }

  const handleDeleteRole = async (role) => {
    if (window.confirm(`Are you sure you want to delete role "${role.displayName || role.name}"?`)) {
      try {
        setLoading(true)
        const response = await roleAPI.deleteRole(role.id)
        
        if (response.success) {
          setSuccess('Role deleted successfully')
          loadRoles(pagination.currentPage)
          loadStats()
        } else {
          setError(response.message || 'Failed to delete role')
        }
      } catch (err) {
        console.error('Error deleting role:', err)
        setError(err.response?.data?.message || 'Failed to delete role')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCopyRole = async (role) => {
    const newName = prompt(`Enter name for copied role (copy of ${role.displayName || role.name}):`)
    if (newName && newName.trim()) {
      try {
        setLoading(true)
        const response = await roleAPI.copyRole(role.id, {
          name: newName.trim(),
          description: `${role.description} (Copy)`
        })
        
        if (response.success) {
          setSuccess('Role copied successfully')
          loadRoles(pagination.currentPage)
          loadStats()
        } else {
          setError(response.message || 'Failed to copy role')
        }
      } catch (err) {
        console.error('Error copying role:', err)
        setError(err.response?.data?.message || 'Failed to copy role')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleAddRole = () => {
    setFormData({
      name: '',
      description: '',
      permissions: [],
      isActive: true,
      priority: 0
    })
    setIsEditing(false)
    setSelectedRole(null)
    setFormErrors({})
    setShowFormModal(true)
  }

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue)
    loadRoles(1, { search: searchValue })
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    
    // Validate form
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Role name is required'
    if (!formData.description.trim()) errors.description = 'Description is required'
    if (formData.permissions.length === 0) errors.permissions = 'At least one permission is required'
    
    setFormErrors(errors)
    
    if (Object.keys(errors).length > 0) return
    
    try {
      setLoading(true)
      setError('')
      
      let response
      if (isEditing) {
        response = await roleAPI.updateRole(selectedRole.id, formData)
      } else {
        response = await roleAPI.createRole(formData)
      }
      
      if (response.success) {
        setSuccess(isEditing ? 'Role updated successfully' : 'Role created successfully')
        setShowFormModal(false)
        loadRoles(pagination.currentPage)
        loadStats()
      } else {
        setError(response.message || `Failed to ${isEditing ? 'update' : 'create'} role`)
      }
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} role:`, err)
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} role`)
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionChange = (permission, checked) => {
    // If role has ALL permission, don't allow individual permission changes
    if (formData.permissions.includes('ALL')) {
      return;
    }
    
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permission]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permission)
      }))
    }
  }

  // Handle ALL permission toggle
  const handleAllPermissionToggle = (checked) => {
    if (checked) {
      // If checking ALL, replace all permissions with just ALL
      setFormData(prev => ({
        ...prev,
        permissions: ['ALL']
      }))
    } else {
      // If unchecking ALL, remove it but keep other permissions
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== 'ALL')
      }))
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'displayName',
      label: 'Role Details',
      width: '25%',
      render: (value, row) => (
        <div className="role-info">
          <div className="fw-semibold d-flex align-items-center">
            <Shield size={16} className="me-2" />
            {value || row.name}
            {row.isSystem && (
              <Badge bg="primary" className="ms-2" style={{ fontSize: '10px' }}>
                System
              </Badge>
            )}
          </div>
          <small className="text-muted">{row.description}</small>
        </div>
      )
    },
    {
      key: 'userCount',
      label: 'Users',
      width: '8%',
      render: (value) => (
        <div className="text-center">
          <div className="fw-bold text-primary">{value || 0}</div>
          <small className="text-muted">users</small>
        </div>
      )
    },
    {
      key: 'permissions',
      label: 'Permissions',
      width: '20%',
      render: (value) => (
        <div className="permissions-list">
          <div className="fw-medium">{value?.length || 0} permissions</div>
          <small className="text-muted">
            {value && value.length > 0 ? (
              <>
                {value.slice(0, 2).map(p => p.split(':')[1] || p).join(', ')}
                {value.length > 2 && ` +${value.length - 2} more`}
              </>
            ) : (
              'No permissions'
            )}
          </small>
        </div>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      width: '10%',
      render: (value) => getStatusBadge(value ? 'Active' : 'Inactive')
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '10%',
      render: (value) => getPriorityBadge(getPriorityLabel(value))
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '12%',
      render: (value) => {
        if (!value) return '-'
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    },
    {
      key: 'updatedAt',
      label: 'Modified',
      width: '12%',
      render: (value) => {
        if (!value) return '-'
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Suspended': 'warning'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getPriorityLabel = (priority) => {
    if (priority >= 800) return 'High'
    if (priority >= 400) return 'Medium'
    return 'Low'
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      'High': 'danger',
      'Medium': 'warning',
      'Low': 'info'
    }
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>
  }

  const insightItems = useMemo(() => {
    const tr = stats.totalRoles || 0
    const ar = stats.activeRoles || 0
    const items = []
    if (tr > 0) {
      items.push({
        title: `${ar} of ${tr} roles active`,
        detail: `${stats.totalUsers || 0} users mapped · ${stats.systemRoles || 0} system roles — review entitlements regularly.`,
        tone: 'info'
      })
    }
    if (ar < tr && tr > 0) {
      items.push({
        title: 'Inactive roles present',
        detail: 'Prune or consolidate dormant RBAC entries to reduce privilege creep.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'RBAC overview',
        detail: 'Load roles to populate access intelligence.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="roles-permissions-page"
        error={error}
        success={success}
        onDismissError={() => setError('')}
        onDismissSuccess={() => setSuccess('')}
        breadcrumbs={[
          { label: 'Admin & Config', onClick: () => navigate('/admin-config') },
          { label: 'Roles & Permissions', active: true }
        ]}
        onBack={() => navigate('/admin-config')}
        backLabel="Back to modules"
        title="Roles & permissions command center"
        description="Manage user roles and permissions for secure access control."
        heroMeta="RBAC & entitlements"
        outlookTitle="Access control outlook"
        outlookDescription={`${stats.totalRoles || 0} roles · ${stats.activeRoles || 0} active · ${stats.totalUsers || 0} users.`}
        outlookChips={[
          `${stats.totalRoles || 0} roles`,
          `${stats.activeRoles || 0} active`,
          `${stats.totalUsers || 0} users`,
          `${stats.systemRoles || 0} system`
        ]}
        insights={insightItems}
        kpiTitle="Identity signal board"
        kpiMeta="Role coverage and system locks"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total roles"
                value={stats.totalRoles || 0}
                hint="Defined RBAC entries"
                tone="intel"
                trend="Scope"
                icon={<Shield size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total users"
                value={stats.totalUsers || 0}
                hint="Mapped identities"
                tone="intel"
                trend="Footprint"
                icon={<Users size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Active roles"
                value={stats.activeRoles || 0}
                hint="Currently enabled"
                tone="success"
                trend="Health"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="System roles"
                value={stats.systemRoles || 0}
                hint="Protected templates"
                tone="warning"
                trend="Core"
                icon={<Key size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle={`Roles & permissions (${pagination.totalItems})`}
        tableActions={
          <>
            <Button
              variant="primary"
              className="me-2"
              onClick={handleAddRole}
              disabled={loading}
            >
              <Plus size={16} className="me-2" />
              New Role
            </Button>
            <Button variant="outline-secondary">
              <Settings size={16} className="me-2" />
              Permissions
            </Button>
          </>
        }
      >
        <DataTable
          data={roles}
          columns={columns}
          title={`Roles & Permissions (${pagination.totalItems})`}
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={pagination.itemsPerPage}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewRole}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
          onSearch={handleSearch}
          onPageChange={(page) => loadRoles(page)}
          customActions={[
            {
              type: 'custom',
              label: 'Copy Role',
              onClick: handleCopyRole
            }
          ]}
          searchPlaceholder="Search roles..."
          emptyMessage="No roles found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

        {/* View Role Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <Shield size={20} className="me-2" />
              Role Details - {selectedRole?.displayName || selectedRole?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedRole && (
              <div className="role-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Name:</strong> {selectedRole.displayName || selectedRole.name}</p>
                    <p><strong>Status:</strong> {getStatusBadge(selectedRole.isActive ? 'Active' : 'Inactive')}</p>
                    <p><strong>Priority:</strong> {getPriorityBadge(getPriorityLabel(selectedRole.priority))}</p>
                    <p><strong>User Count:</strong> {selectedRole.userCount || 0}</p>
                    <p><strong>Created Date:</strong> {selectedRole.createdAt ? new Date(selectedRole.createdAt).toLocaleDateString() : '-'}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Role Configuration</h6>
                    <p><strong>Last Modified:</strong> {selectedRole.updatedAt ? new Date(selectedRole.updatedAt).toLocaleDateString() : '-'}</p>
                    <p><strong>Is System Role:</strong> {selectedRole.isSystem ? 'Yes' : 'No'}</p>
                    <p><strong>Total Permissions:</strong> {selectedRole.permissions?.length || 0}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Description</h6>
                    <p>{selectedRole.description}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Permissions</h6>
                    <div className="permissions-list">
                      {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
                        selectedRole.permissions.map((permission, index) => (
                          <Badge key={index} bg="info" className="me-2 mb-2">
                            {permission.split(':')[1] || permission}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted">No permissions assigned</p>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            {selectedRole && (!selectedRole.isSystem || ['SYSTEM ADMINISTRATOR', 'ADMIN'].includes(selectedRole.name)) && (
              <Button variant="primary" onClick={() => {
                setShowModal(false)
                handleEditRole(selectedRole)
              }}>
                <Edit size={16} className="me-2" />
                Edit Role
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        {/* Add/Edit Role Form Modal */}
        <FormDrawerModal
          show={showFormModal}
          onHide={() => setShowFormModal(false)}
          onTestFill={showFormModal ? () => setFormData(dummyRoleForm()) : undefined}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <Shield size={20} className="me-2" />
              {isEditing ? 'Edit Role' : 'Create New Role'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmitForm}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role Name *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter role name"
                      isInvalid={!!formErrors.name}
                      disabled={isEditing && selectedRole?.isSystem && !['SYSTEM ADMINISTRATOR', 'ADMIN'].includes(selectedRole?.name)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                    >
                      <option value={0}>Low (0-399)</option>
                      <option value={400}>Medium (400-799)</option>
                      <option value={800}>High (800+)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter role description"
                  isInvalid={!!formErrors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.description}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                />
              </Form.Group>

              <hr />
              
              <Form.Group className="mb-3">
                <Form.Label>Permissions *</Form.Label>
                {formErrors.permissions && (
                  <div className="text-danger small mb-2">{formErrors.permissions}</div>
                )}
                {isEditing && selectedRole?.isSystem && !['SYSTEM ADMINISTRATOR', 'ADMIN'].includes(selectedRole?.name) && (
                  <div className="alert alert-info small mb-2">
                    <i className="fas fa-info-circle me-1"></i>
                    This system role cannot be modified. It has predefined permissions.
                  </div>
                )}
                
                {/* ALL Permissions Checkbox */}
                <div className="mb-3 p-3 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
                  <Form.Check
                    type="checkbox"
                    id="perm-ALL"
                    label={
                      <div>
                        <div className="fw-bold text-primary">All Permissions</div>
                        <small className="text-muted">Grant all system permissions (Super Admin)</small>
                      </div>
                    }
                    checked={formData.permissions.includes('ALL')}
                    onChange={(e) => handleAllPermissionToggle(e.target.checked)}
                    disabled={isEditing && selectedRole?.isSystem && !['SYSTEM ADMINISTRATOR', 'ADMIN'].includes(selectedRole?.name)}
                  />
                </div>
                
                <div className="permissions-grid" style={{ maxHeight: '300px', overflowY: 'auto', opacity: (formData.permissions.includes('ALL') || (isEditing && selectedRole?.isSystem && !['SYSTEM ADMINISTRATOR', 'ADMIN'].includes(selectedRole?.name))) ? 0.6 : 1 }}>
                  {permissions.length === 0 ? (
                    <div className="text-center p-4">
                      <Spinner size="sm" className="me-2" />
                      Loading permissions...
                    </div>
                  ) : (
                    permissions.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="mb-3">
                      <h6 className="text-primary">{category.category}</h6>
                      <Row>
                        {category.permissions.map((permission, permIndex) => (
                          <Col md={6} key={permIndex} className="mb-2">
                            <Form.Check
                              type="checkbox"
                              id={`perm-${permission.key}`}
                              label={
                                <div>
                                  <div className="fw-medium">{permission.label}</div>
                                  <small className="text-muted">{permission.description}</small>
                                </div>
                              }
                              checked={formData.permissions.includes('ALL') || formData.permissions.includes(permission.key)}
                              onChange={(e) => handlePermissionChange(permission.key, e.target.checked)}
                              disabled={formData.permissions.includes('ALL') || (isEditing && selectedRole?.isSystem && !['SYSTEM ADMINISTRATOR', 'ADMIN'].includes(selectedRole?.name))}
                            />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  ))
                  )}
                </div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowFormModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading && <Spinner size="sm" className="me-2" />}
                {isEditing ? 'Update Role' : 'Create Role'}
              </Button>
            </Modal.Footer>
          </Form>
        </FormDrawerModal>
    </>
  )
}

export default RolesPermissions