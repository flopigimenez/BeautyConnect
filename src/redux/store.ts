import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    
  },
})

// Inferí los tipos de RootState y AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch