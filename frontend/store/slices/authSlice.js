'use client'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  email: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.email = action.payload.email
      state.token = action.payload.token ?? null
    },
    logout: (state) => {
      state.email = null
      state.token = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
