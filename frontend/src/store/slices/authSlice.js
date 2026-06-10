import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../../services/authAPI'

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log('🚀 Frontend: Starting login process with credentials:', {
      //   email: credentials.email,
      //   hasPassword: !!credentials.password
      // });
      
      const response = await authAPI.login(credentials)
      // console.log('✅ Frontend: Login API response received:', response);
      return response.data
    } catch (error) {
      // console.error('❌ Frontend: Login error occurred:', error);
      // console.error('❌ Frontend: Error details:', {
      //   message: error.message,
      //   code: error.code,
      //   response: error.response,
      //   status: error.response?.status
      // });
      
      if (error.code === 'ERR_NETWORK') {
        return rejectWithValue({ message: 'Cannot connect to server. Please check if the backend is running.' })
      }
      return rejectWithValue(error.response?.data || { message: 'Login failed' })
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout()
      return null
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Logout failed' })
    }
  }
)

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.refreshToken()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Token refresh failed' })
    }
  }
)

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile()
      const body = response.data
      const user = body?.data?.user ?? body?.user
      if (!user) {
        return rejectWithValue({ message: 'Invalid profile response' })
      }
      return { user }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Profile fetch failed' })
    }
  }
)

function readUserFromStorage () {
  try {
    const raw = localStorage.getItem('user')
    if (raw == null || raw === '' || raw === 'undefined' || raw === 'null') {
      return null
    }
    // Some legacy sessions stored plain strings (not JSON). Ignore safely.
    if (!(raw.startsWith('{') || raw.startsWith('[') || raw.startsWith('"'))) {
      localStorage.removeItem('user')
      return null
    }
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch (error) {
    console.warn('Invalid user data in localStorage. Clearing stale value.')
    localStorage.removeItem('user')
    return null
  }
}

const initialState = {
  user: readUserFromStorage(),
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'), // Set to true if token exists
  isLoading: false,
  error: null,
  isInitialized: false // Track if we've checked authentication on app start
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload
      localStorage.setItem('accessToken', action.payload)
    },
    clearAuth: (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    },
    setInitialized: (state) => {
      state.isInitialized = true
    },
    setAuthState: (state, action) => {
      state.user = action.payload.user
      state.isAuthenticated = action.payload.isAuthenticated
      state.isInitialized = true
      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        // console.log('Login fulfilled with payload:', action.payload)
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.data.user
        state.accessToken = action.payload.data.accessToken
        localStorage.setItem('accessToken', action.payload.data.accessToken)
        localStorage.setItem('user', JSON.stringify(action.payload.data.user))
      })
      .addCase(login.rejected, (state, action) => {
        // console.log('Login rejected with payload:', action.payload)
        state.isLoading = false
        state.error = action.payload?.message || 'Login failed'
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || 'Logout failed'
      })
      
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false
        const token =
          action.payload?.data?.accessToken ?? action.payload?.accessToken
        if (token) {
          state.accessToken = token
          localStorage.setItem('accessToken', token)
        }
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || 'Token refresh failed'
        // Clear auth state on refresh failure
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
      })
      
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || 'Profile fetch failed'
      })
  }
})

export const { clearError, setAccessToken, clearAuth, setInitialized, setAuthState } = authSlice.actions
export default authSlice.reducer
