import { configureStore } from '@reduxjs/toolkit'
import reseñaReducer from "../redux/store/reseñaSlice"
import centroReducer from "../redux/store/centroSlice"

export const store = configureStore({
  reducer: {
    centros: centroReducer,
     reseñas: reseñaReducer,
  },
})

// Inferí los tipos de RootState y AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch