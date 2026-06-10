import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    addUser: (state, action) => {
      state.users.push(action.payload)
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = action.payload
      }
    },
    removeUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload)
    }
  }
})

export const {
  setUsers,
  setCurrentUser,
  setLoading,
  setError,
  addUser,
  updateUser,
  removeUser
} = userSlice.actions

export default userSlice.reducer
