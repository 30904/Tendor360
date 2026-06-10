import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Alert,
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { authAPI } from '../services/authAPI'
import { getProfile } from '../store/slices/authSlice'
import {
  IconProfileHero,
  IconSectionIdentity,
  IconEnvelope,
  IconPhone,
  IconBuilding,
  IconBriefcase,
  IconBell,
  IconSun,
  IconMoon,
  IconShield,
  IconCalendar,
  IconLock,
  IconPencil,
  IconCheck,
  IconClose,
} from './user-profile/UserProfileIcons'
import './UserProfile.scss'

function formatWhen(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return '—'
  }
}

function roleLabel(role) {
  if (!role) return ''
  return String(role)
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const UserProfile = () => {
  const dispatch = useDispatch()
  const reduxUser = useSelector((s) => s.auth.user)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [loadError, setLoadError] = useState(null)

  const companyLine = useMemo(() => {
    const c = reduxUser?.company ?? reduxUser?.companyId
    if (!c || typeof c !== 'object') return ''
    return String(c.displayName ?? c.name ?? '').trim()
  }, [reduxUser])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      department: '',
      position: '',
      theme: 'light',
      notifyEmail: true,
      notifyPush: true,
    },
  })

  const themeWatch = watch('theme')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoadError(null)
      try {
        await dispatch(getProfile()).unwrap()
      } catch (e) {
        if (!cancelled) setLoadError(e?.message || 'Could not load profile')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [dispatch])

  useEffect(() => {
    if (!reduxUser) return
    reset({
      name: reduxUser.name || '',
      phone: reduxUser.profile?.phone || '',
      department: reduxUser.profile?.department || '',
      position: reduxUser.profile?.position || '',
      theme: reduxUser.preferences?.theme === 'dark' ? 'dark' : 'light',
      notifyEmail: reduxUser.preferences?.notifications?.email !== false,
      notifyPush: reduxUser.preferences?.notifications?.push !== false,
    })
  }, [reduxUser, reset])

  useEffect(() => {
    const t = reduxUser?.preferences?.theme === 'dark' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', t)
  }, [reduxUser?.preferences?.theme])

  useEffect(() => {
    if (editing && themeWatch) {
      document.documentElement.setAttribute('data-theme', themeWatch)
    } else if (!editing && reduxUser?.preferences?.theme) {
      document.documentElement.setAttribute(
        'data-theme',
        reduxUser.preferences.theme === 'dark' ? 'dark' : 'light'
      )
    }
  }, [themeWatch, editing, reduxUser?.preferences?.theme])

  const onSubmit = async (data) => {
    if (!reduxUser?.id) return
    setSaving(true)
    try {
      const payload = {
        name: data.name.trim(),
        profile: {
          ...(reduxUser.profile || {}),
          phone: data.phone?.trim() || undefined,
          department: data.department?.trim() || undefined,
          position: data.position?.trim() || undefined,
        },
        preferences: {
          ...(reduxUser.preferences || {}),
          theme: data.theme === 'dark' ? 'dark' : 'light',
          notifications: {
            email: Boolean(data.notifyEmail),
            push: Boolean(data.notifyPush),
          },
        },
      }
      await authAPI.updateProfile(payload)
      await dispatch(getProfile()).unwrap()
      toast.success('Your profile has been saved.')
      setEditing(false)
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Could not update profile'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    if (!reduxUser) return
    reset({
      name: reduxUser.name || '',
      phone: reduxUser.profile?.phone || '',
      department: reduxUser.profile?.department || '',
      position: reduxUser.profile?.position || '',
      theme: reduxUser.preferences?.theme === 'dark' ? 'dark' : 'light',
      notifyEmail: reduxUser.preferences?.notifications?.email !== false,
      notifyPush: reduxUser.preferences?.notifications?.push !== false,
    })
    document.documentElement.setAttribute(
      'data-theme',
      reduxUser.preferences?.theme === 'dark' ? 'dark' : 'light'
    )
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="user-profile-page user-profile-page--loading page-bg-gradient">
        <div className="user-profile-loading">
          <Spinner animation="border" variant="primary" />
          <p>Loading your profile…</p>
        </div>
      </div>
    )
  }

  if (loadError || !reduxUser) {
    return (
      <div className="user-profile-page page-bg-gradient">
        <Alert variant="danger" className="user-profile-alert border-0 shadow-sm">
          {loadError || 'You must be signed in to view this page.'}
        </Alert>
      </div>
    )
  }

  const initial = (reduxUser.name || '?').trim().charAt(0).toUpperCase()

  return (
    <div className="user-profile-page page-bg-gradient">
      <header className="user-profile-hero">
        <div className="user-profile-hero__shine" aria-hidden />
        <div className="user-profile-hero__inner">
          <div className="user-profile-hero__mark">
            <IconProfileHero className="user-profile-hero__mark-svg" aria-hidden />
          </div>
          <div className="user-profile-hero__avatar" aria-hidden>
            <span>{initial}</span>
          </div>
          <div className="user-profile-hero__copy">
            <p className="user-profile-hero__eyebrow">Your account</p>
            <h1 className="user-profile-hero__title">{reduxUser.name}</h1>
            <div className="user-profile-hero__meta">
              <span className="user-profile-hero__pill">
                <IconEnvelope className="user-profile-hero__ico" aria-hidden />
                {reduxUser.email}
              </span>
              {companyLine ? (
                <span className="user-profile-hero__pill">
                  <IconBuilding className="user-profile-hero__ico" aria-hidden />
                  {companyLine}
                </span>
              ) : null}
            </div>
            <div className="user-profile-hero__roles">
              {(reduxUser.roles || []).map((r) => (
                <span key={r} className="user-profile-role-pill">
                  {roleLabel(r)}
                </span>
              ))}
            </div>
          </div>
          <div className="user-profile-hero__actions">
            {!editing ? (
              <Button
                variant="primary"
                className="user-profile-btn-primary"
                onClick={() => setEditing(true)}
              >
                <IconPencil className="user-profile-btn-ico me-2" />
                Edit profile
              </Button>
            ) : (
              <>
                <Button
                  variant="outline-secondary"
                  className="user-profile-btn-cancel me-2"
                  disabled={saving}
                  onClick={handleCancelEdit}
                >
                  <IconClose className="user-profile-btn-ico me-1" />
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="user-profile-btn-save fw-semibold"
                  type="submit"
                  form="user-profile-form"
                  disabled={saving || !isDirty || !editing}
                >
                  {saving ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <IconCheck className="user-profile-btn-ico me-2" />
                      Save changes
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <Form
        id="user-profile-form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Row className="g-4 user-profile-grid">
          <Col lg={8}>
            <article className="user-profile-shell">
              <div className="user-profile-shell__head">
                <div className="user-profile-shell__glyph">
                  <IconSectionIdentity className="user-profile-shell__svg" aria-hidden />
                </div>
                <div>
                  <h2 className="user-profile-shell__title">Profile details</h2>
                  <p className="user-profile-shell__sub">
                    Identity and contact information tied to your Tender360 seat.
                  </p>
                </div>
              </div>
              <div className="user-profile-shell__body">
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group className="user-profile-field">
                      <Form.Label className="user-profile-label">Full name</Form.Label>
                      <Form.Control
                        type="text"
                        disabled={!editing}
                        readOnly={!editing}
                        className={`user-profile-input${!editing ? ' is-static' : ''}`}
                        {...register('name', { required: 'Name is required' })}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="user-profile-field">
                      <Form.Label className="user-profile-label d-flex align-items-center gap-2">
                        <IconEnvelope className="user-profile-label-ico" aria-hidden />
                        Work email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        value={reduxUser.email}
                        disabled
                        readOnly
                        className="user-profile-input is-static"
                      />
                      <Form.Text className="user-profile-hint">
                        Managed by your administrator.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="user-profile-field">
                      <Form.Label className="user-profile-label d-flex align-items-center gap-2">
                        <IconPhone className="user-profile-label-ico" aria-hidden />
                        Phone
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="+91 …"
                        disabled={!editing}
                        readOnly={!editing}
                        className={`user-profile-input${!editing ? ' is-static' : ''}`}
                        {...register('phone')}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="user-profile-field">
                      <Form.Label className="user-profile-label d-flex align-items-center gap-2">
                        <IconBuilding className="user-profile-label-ico" aria-hidden />
                        Department
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. IT"
                        disabled={!editing}
                        readOnly={!editing}
                        className={`user-profile-input${!editing ? ' is-static' : ''}`}
                        {...register('department')}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="user-profile-field mb-0">
                      <Form.Label className="user-profile-label d-flex align-items-center gap-2">
                        <IconBriefcase className="user-profile-label-ico" aria-hidden />
                        Job title
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. Tender Manager"
                        disabled={!editing}
                        readOnly={!editing}
                        className={`user-profile-input${!editing ? ' is-static' : ''}`}
                        {...register('position')}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </article>
          </Col>

          <Col lg={4}>
            <article className="user-profile-shell user-profile-shell--accent mb-4">
              <div className="user-profile-shell__head">
                <div className="user-profile-shell__glyph user-profile-shell__glyph--amber">
                  <IconBell className="user-profile-shell__svg" aria-hidden />
                </div>
                <div>
                  <h2 className="user-profile-shell__title">Preferences</h2>
                  <p className="user-profile-shell__sub">
                    Appearance and how we reach you.
                  </p>
                </div>
              </div>
              <div className="user-profile-shell__body">
                <fieldset
                  className={
                    !editing ? 'user-profile-prefs-readonly border-0 m-0 p-0' : 'border-0 m-0 p-0'
                  }
                >
                  <Form.Group className="mb-4">
                    <Form.Label className="user-profile-label">Appearance</Form.Label>
                    <div className="user-profile-theme-row">
                      <Form.Check
                        type="radio"
                        id="theme-light"
                        value="light"
                        className="user-profile-theme-card"
                        disabled={!editing}
                        label={
                          <span className="user-profile-theme-label">
                            <IconSun className="user-profile-theme-ico" aria-hidden />
                            Light
                          </span>
                        }
                        {...register('theme')}
                      />
                      <Form.Check
                        type="radio"
                        id="theme-dark"
                        value="dark"
                        className="user-profile-theme-card"
                        disabled={!editing}
                        label={
                          <span className="user-profile-theme-label">
                            <IconMoon className="user-profile-theme-ico" aria-hidden />
                            Dark
                          </span>
                        }
                        {...register('theme')}
                      />
                    </div>
                  </Form.Group>

                  <Form.Check
                    type="switch"
                    id="notify-email"
                    className="user-profile-switch mb-3"
                    label="Email notifications"
                    disabled={!editing}
                    {...register('notifyEmail')}
                  />
                  <Form.Check
                    type="switch"
                    id="notify-push"
                    className="user-profile-switch"
                    label="In-app / push notifications"
                    disabled={!editing}
                    {...register('notifyPush')}
                  />
                </fieldset>
                {!editing && (
                  <p className="user-profile-hint mb-0 mt-3">
                    Select <strong>Edit profile</strong> to adjust preferences.
                  </p>
                )}
              </div>
            </article>

            <article className="user-profile-shell user-profile-shell--security">
              <div className="user-profile-shell__head">
                <div className="user-profile-shell__glyph user-profile-shell__glyph--slate">
                  <IconShield className="user-profile-shell__svg" aria-hidden />
                </div>
                <div>
                  <h2 className="user-profile-shell__title">Security</h2>
                  <p className="user-profile-shell__sub">
                    Access history and password recovery.
                  </p>
                </div>
              </div>
              <div className="user-profile-shell__body">
                <div className="user-profile-security-block">
                  <div className="user-profile-security-icon">
                    <IconCalendar aria-hidden />
                  </div>
                  <div>
                    <span className="user-profile-security-label">Last sign-in</span>
                    <div className="user-profile-security-value">
                      {formatWhen(reduxUser.lastLoginAt)}
                    </div>
                  </div>
                </div>
                <div className="user-profile-security-block mt-4">
                  <div className="user-profile-security-icon">
                    <IconLock aria-hidden />
                  </div>
                  <div className="user-profile-security-copy">
                    <span className="user-profile-security-label">Password</span>
                    <div className="mt-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="user-profile-btn-outline rounded-pill px-3"
                        href="/forgot-password"
                        as="a"
                      >
                        Reset via email
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default UserProfile
