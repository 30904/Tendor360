import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'light',
  sidebarCollapsed: false,
  notifications: [],
  modals: {
    showAI: false,
    showSettings: false
  }
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload)
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    setModal: (state, action) => {
      const { modal, show } = action.payload
      state.modals[modal] = show
    }
  }
})

export const {
  setTheme,
  toggleSidebar,
  setSidebarCollapsed,
  addNotification,
  removeNotification,
  clearNotifications,
  setModal
} = uiSlice.actions

export default uiSlice.reducer
