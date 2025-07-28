import { configureStore } from '@reduxjs/toolkit'
import reseñaReducer from "../redux/store/reseñaSlice"

export const store = configureStore({
  reducer: {
     reseñas: reseñaReducer,
  },
})

// Inferí los tipos de RootState y AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch