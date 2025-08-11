'use client'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  count: 0,
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartCount: (state, action) => {
      state.count = action.payload
    },
    setCartItems: (state, action) => {
      state.items = action.payload
    },
  },
})

export const { setCartCount, setCartItems } = cartSlice.actions
export default cartSlice.reducer
