import { configureStore } from '@reduxjs/toolkit'
import reseñaReducer from "../redux/store/reseñaSlice"
import centroReducer from "../redux/store/centroSlice"
import userReducer from '../redux/store/authSlice'
import clienteReducer from '../redux/store/clienteSlice'
import turnosReducer from '../redux/store/turnosSlice'
import turnoReducer from '../redux/store/turnoSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    clientes: clienteReducer,
    centros: centroReducer,
    reseñas: reseñaReducer,
    turnos: turnosReducer,
    turno: turnoReducer,
  },
})

// Inferí los tipos de RootState y AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch