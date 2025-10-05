import { CentroDeEsteticaService } from "../../services/CentroDeEsteticaService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CentroDeEsteticaResponseDTO } from "../../types/centroDeEstetica/CentroDeEsteticaResponseDTO";
import { Estado } from "../../types/enums/Estado";

const centroService = new CentroDeEsteticaService();

interface CentroState {
    centros: CentroDeEsteticaResponseDTO[];
    loading: boolean;
    error: string | null;
}

const initialState: CentroState = {
    centros: [],
    loading: false,
    error: null,
};

export const fetchCentros = createAsyncThunk<CentroDeEsteticaResponseDTO[]>("centros/fetchAll", async () => {
    return await centroService.getAll();
});

export const fetchCentrosPorEstado = createAsyncThunk<CentroDeEsteticaResponseDTO[], Estado>("centros/fetchPorEstado", async (estado) => {
    return await centroService.listarPorEstado(estado);
});

export const fetchCentrosPorEstadoyActive = createAsyncThunk<CentroDeEsteticaResponseDTO[], { estado: Estado; active: boolean }>("centros/fetchPorEstadoyActive", async ({estado, active}) => {
    return await centroService.listarPorEstadoyActive(estado, active);
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
        builder
            .addCase(fetchCentrosPorEstado.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCentrosPorEstado.fulfilled, (state, action) => {
                state.loading = false;
                state.centros = action.payload;
            })
            .addCase(fetchCentrosPorEstado.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error al cargar centros por estado";
            });
        builder
            .addCase(fetchCentrosPorEstadoyActive.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCentrosPorEstadoyActive.fulfilled, (state, action) => {
                state.loading = false;
                state.centros = action.payload;
            })
            .addCase(fetchCentrosPorEstadoyActive.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error al cargar centros por estado y active";
            });
    },
});

export default centroSlice.reducer;