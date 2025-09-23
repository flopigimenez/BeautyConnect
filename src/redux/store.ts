import { configureStore } from '@reduxjs/toolkit'
import reseñaReducer from "../redux/store/reseñaSlice"
import centroReducer from "../redux/store/centroSlice"
import userReducer from '../redux/store/authSlice'
import clienteReducer from '../redux/store/clienteSlice'
import misTurnosReducer from './store/misTurnosSlice'
import turnoReducer from '../redux/store/turnoSlice'
import miCentroReducer from '../redux/store/miCentroSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    clientes: clienteReducer,
    centros: centroReducer,
    reseñas: reseñaReducer,
    misTurnos: misTurnosReducer,
    turno: turnoReducer,
    miCentro: miCentroReducer,
  },
})

// Inferí los tipos de RootState y AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch