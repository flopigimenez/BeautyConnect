import { CentroDeEsteticaService } from "../../services/CentroDeEsteticaService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CentroEsteticaResponseDTO } from "../../types/centroDeEstetica/CentroEsteticaResponseDTO";

const centroService = new CentroDeEsteticaService();

interface CentroState {
    centros: CentroEsteticaResponseDTO[];
    loading: boolean;
    error: string | null;
}

const initialState: CentroState = {
    centros: [],
    loading: false,
    error: null,
};

export const fetchCentros = createAsyncThunk("centros/fetchAll", async () => {
    return await centroService.getAll();
});

const centroSlice = createSlice({
    name: "centros",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCentros.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCentros.fulfilled, (state, action) => {
                state.loading = false;
                state.centros = action.payload;
            })
            .addCase(fetchCentros.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error al cargar centros";
            }); 
    },
});

export default centroSlice.reducer;