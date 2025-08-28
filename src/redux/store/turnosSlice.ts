import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { TurnoResponseDTO } from "../../types/turno/TurnoResponseDTO";
import { TurnoService } from "../../services/TurnoService";

const turnoService = new TurnoService();

interface TurnosState {
  turnos: TurnoResponseDTO[];
  loading: boolean;
  error: string | null;
}

const initialState: TurnosState = {
  turnos: [],
  loading: false,
  error: null,
};

// Async thunk para traer los turnos de un cliente
export const fetchTurnosCliente = createAsyncThunk<TurnoResponseDTO[], number>(
  "turnos/fetchCliente",
  async (clienteId) => {
    return await turnoService.getByClienteId(clienteId); // Implementa este método en tu servicio
  }
);

const turnosSlice = createSlice({
  name: "turnos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTurnosCliente.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTurnosCliente.fulfilled, (state, action) => {
        state.loading = false;
        state.turnos = action.payload;
      })
      .addCase(fetchTurnosCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al cargar turnos";
      });
  },
});

export default turnosSlice.reducer;