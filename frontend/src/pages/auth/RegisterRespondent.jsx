import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { authAPI } from '../../services/authAPI'
import { setAccessToken, setAuthState } from '../../store/slices/authSlice'

const RegisterRespondent = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    companyName: '',
    displayName: ''
  })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const res = await authAPI.registerRespondent({
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim(),
        companyName: form.companyName.trim(),
        displayName: form.displayName.trim() || undefined
      })
      const token = res.data?.data?.accessToken
      const user = res.data?.data?.user
      if (token && user) {
        dispatch(setAccessToken(token))
        dispatch(setAuthState({ user, isAuthenticated: true }))
      }
      navigate('/respond/inbox')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header text-center mb-3">
            <h1 className="brand-title">Participant sign up</h1>
            <p className="text-muted small mb-0">
              Create a supplier organization to respond to issued RFPs.
            </p>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Work email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Your name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Company name</Form.Label>
              <Form.Control
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Display name (optional)</Form.Label>
              <Form.Control name="displayName" value={form.displayName} onChange={handleChange} />
            </Form.Group>
            <Button type="submit" className="w-100" disabled={busy}>
              {busy ? 'Creating…' : 'Create participant account'}
            </Button>
          </Form>
          <p className="text-center mt-3 small mb-0">
            <Link to="/login">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterRespondent
