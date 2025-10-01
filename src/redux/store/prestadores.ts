import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrestadorServicioService } from "../../services/PrestadorServicioService";
import type { PrestadorServicioResponseDTO } from "../../types/prestadorDeServicio/PrestadorServicioResponseDTO";

const prestadorService = new PrestadorServicioService();

interface PrestadorState {
    prestadores: PrestadorServicioResponseDTO[];
    loading: boolean;
    error: string | null;
}

const initialState: PrestadorState = {
    prestadores: [],
    loading: false,
    error: null,
};

export const fetchPrestadores = createAsyncThunk<PrestadorServicioResponseDTO[]>("prestador/fetchAll", async () => {
    return await prestadorService.getAll();
});

const prestadorSlice = createSlice({
    name: "prestadores",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPrestadores.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPrestadores.fulfilled, (state, action) => {
                state.loading = false;
                state.prestadores = action.payload;
            })
            .addCase(fetchPrestadores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error al cargar prestadores";
            });
    },

});

export default prestadorSlice.reducer;