import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { BiLock, BiArrowBack, BiCheckCircle } from 'react-icons/bi'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authAPI } from '../../services/authAPI'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!token) {
      toast.error('Invalid reset link. Please request a new password reset.')
      return
    }

    setIsLoading(true)

    try {
      await authAPI.resetPassword(token, password)
      setIsComplete(true)
      toast.success('Password reset successfully')
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to reset password. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-form p-4 text-center">
              <h2 className="form-title">Invalid Reset Link</h2>
              <p className="text-muted">
                This password reset link is missing or invalid.
              </p>
              <Link to="/forgot-password" className="btn btn-primary">
                Request New Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-form p-4 text-center">
              <BiCheckCircle className="text-success mb-3" style={{ fontSize: '3rem' }} />
              <h2 className="form-title">Password Updated</h2>
              <p className="text-muted">You can now sign in with your new password.</p>
              <Button className="auth-button" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-form">
            <div className="form-header text-center mb-4">
              <BiLock className="text-primary mb-3" style={{ fontSize: '2.5rem' }} />
              <h2 className="form-title">Set New Password</h2>
              <p className="form-subtitle">Enter and confirm your new password.</p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="form-control"
                  minLength={6}
                  required
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="form-control"
                  minLength={6}
                  required
                />
              </Form.Group>

              <Button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Updating...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>

              <div className="text-center mt-3">
                <Link to="/login" className="forgot-password">
                  <BiArrowBack className="me-1" />
                  Back to Login
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
