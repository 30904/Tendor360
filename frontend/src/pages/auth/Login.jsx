import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../store/slices/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import { BiInfoCircle } from 'react-icons/bi'
// Using centralized auth styling from components.scss

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(state => state.auth)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const result = await dispatch(login(formData)).unwrap()
      const kind = result?.data?.user?.company?.organizationKind || 'buyer'
      navigate(kind === 'supplier' ? '/respond/inbox' : '/dashboard')
    } catch (error) {
      // console.error('Login failed:', error)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="brand-content">
              <div className="brand-logo">
                <div className="logo-icon">T</div>
              </div>
              <h1 className="brand-title">Tender360</h1>
              <p className="brand-subtitle">AI Tender Intelligence & Opportunity Management</p>
              
              <ul className="brand-features">
                <li>
                  <div className="feature-icon">✓</div>
                  <span>AI-Powered Tender Intelligence</span>
                </li>
                <li>
                  <div className="feature-icon">✓</div>
                  <span>Advanced Document Management</span>
                </li>
                <li>
                  <div className="feature-icon">✓</div>
                  <span>Real-time Analytics & Reporting</span>
                </li>
                <li>
                  <div className="feature-icon">✓</div>
                  <span>Compliance & Risk Management</span>
                </li>
              </ul>
              
              <div className="brand-actions">
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={() => window.open('/about', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')}
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', marginTop: '1.5rem' }}
                >
                  <BiInfoCircle className="me-1" />
                  About Tender360
                </button>
              </div>
            </div>
          </div>

          <div className="auth-form">
            <div className="form-header">
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Sign in to your Tender360 workspace</p>
            </div>

            {error && (
              <Alert variant="danger" className="error-alert">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="form-control"
                  required
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-control"
                  required
                />
              </Form.Group>

              <div className="form-options">
                <Form.Check
                  type="checkbox"
                  id="remember-me"
                  label="Remember me"
                  className="form-check"
                />
                <a href="/forgot-password" className="forgot-password">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <p className="text-center mt-3 mb-0 small">
                <Link to="/register-respondent">Create participant account</Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
