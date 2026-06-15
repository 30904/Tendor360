import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import tenderReducer from './slices/tenderSlice'
import userReducer from './slices/userSlice'
import uiReducer from './slices/uiSlice'
import evaluationReducer from './slices/evaluationSlice'
import documentReducer from './slices/documentSlice'
import calendarReducer from './slices/calendarSlice'
import supportReducer from './slices/supportSlice'
import adminConfigReducer from './slices/adminConfigSlice'
import dashboardReducer from './slices/dashboardSlice'
import pricingReducer from './slices/pricingSlice'
import rfpResponseReducer from './slices/rfpResponseSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tender: tenderReducer,
    user: userReducer,
    ui: uiReducer,
    evaluation: evaluationReducer,
    documents: documentReducer,
    calendar: calendarReducer,
    support: supportReducer,
    adminConfig: adminConfigReducer,
    dashboard: dashboardReducer,
    pricing: pricingReducer,
    rfpResponse: rfpResponseReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['auth.user']
      }
    })
})
