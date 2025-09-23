// src/store/resenias/reseniaSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ReseniaResponseDTO } from "../../types/resenia/ReseniaResponseDTO"
import { ReseniaService } from "../../services/ReseniaService";

const reseniaService = new ReseniaService();

export const fetchResenias = createAsyncThunk("resenias/fetchAll", async () => {
  return await reseniaService.getAll();
});

interface ReseniaState {
  resenias: ReseniaResponseDTO[];
  loading: boolean;
  error: string | null;
}

const initialState: ReseniaState = {
  resenias: [],
  loading: false,
  error: null,
};

const reseniaSlice = createSlice({
  name: "resenias",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResenias.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResenias.fulfilled, (state, action) => {
        state.loading = false;
        state.resenias = action.payload;
      })
      .addCase(fetchResenias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al cargar reseñas";
      });
  },
});

export default reseniaSlice.reducer;
