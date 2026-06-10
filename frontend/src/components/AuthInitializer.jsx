import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile, setAuthState, setInitialized, clearAuth } from '../store/slices/authSlice'

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch()
  const accessToken = useSelector(state => state.auth.accessToken)
  const isInitialized = useSelector(state => state.auth.isInitialized)

  useEffect(() => {
    if (isInitialized) return

    let cancelled = false

    async function bootstrap() {
      try {
        if (!accessToken) {
          dispatch(setInitialized())
          return
        }

        try {
          const result = await dispatch(getProfile()).unwrap()
          if (!cancelled) {
            dispatch(
              setAuthState({
                user: result.user,
                isAuthenticated: true
              })
            )
          }
        } catch (error) {
          if (!cancelled) {
            console.log(
              'AuthInitializer: token validation failed:',
              error?.message || error
            )
            dispatch(clearAuth())
          }
        }
      } finally {
        if (!cancelled) dispatch(setInitialized())
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [dispatch, accessToken, isInitialized])

  if (!isInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f8f9fa'
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e9ecef',
              borderTop: '4px solid #4678be',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}
          />
          <p style={{ margin: 0, color: '#6c757d', fontSize: '0.9rem' }}>
            Initializing application...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return children
}

export default AuthInitializer
