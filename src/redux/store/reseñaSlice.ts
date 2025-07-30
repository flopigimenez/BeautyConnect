// src/store/reseñas/reseñaSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ReseñaResponseDTO } from "../../types/reseña/ReseñaResponseDTO"
import { ReseñaService } from "../../services/ReseñaService";

const reseñaService = new ReseñaService();

export const fetchReseñas = createAsyncThunk("reseñas/fetchAll", async () => {
  return await reseñaService.getAll();
});

interface ReseñaState {
  reseñas: ReseñaResponseDTO[];
  loading: boolean;
  error: string | null;
}

const initialState: ReseñaState = {
  reseñas: [],
  loading: false,
  error: null,
};

const reseñaSlice = createSlice({
  name: "reseñas",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReseñas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReseñas.fulfilled, (state, action) => {
        state.loading = false;
        state.reseñas = action.payload;
      })
      .addCase(fetchReseñas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al cargar reseñas";
      });
  },
});

export default reseñaSlice.reducer;
