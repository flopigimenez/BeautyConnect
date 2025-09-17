import { CentroDeEsteticaService } from "../../services/CentroDeEsteticaService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CentroEsteticaResponseDTO } from "../../types/centroDeEstetica/CentroDeEsteticaResponseDTO";
import type { Estado } from "../../types/enums/Estado";

const centroService = new CentroDeEsteticaService();

interface CentroState {
    centros: CentroEsteticaResponseDTO[];
    aceptados: CentroEsteticaResponseDTO[];
    pendientes: CentroEsteticaResponseDTO[];
    loading: boolean;
    error: string | null;
}

const initialState: CentroState = {
    centros: [],
    aceptados: [],
    pendientes:[],
    loading: false,
    error: null,
};

export const fetchCentros = createAsyncThunk<CentroEsteticaResponseDTO[]>("centros/fetchAll", async () => {
    return await centroService.getAll();
});

export const fetchCentrosPendientes = createAsyncThunk<CentroEsteticaResponseDTO[], Estado>("centros/fetchPendientes", async (estado) => {
    return await centroService.listarPorEstado(estado);
});

export const fetchCentrosAceptados = createAsyncThunk<CentroEsteticaResponseDTO[], Estado>("centros/fetchAceptados", async (estado) => {
    return await centroService.listarPorEstado(estado);
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
            .addCase(fetchCentrosPendientes.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCentrosPendientes.fulfilled, (state, action) => {
                state.loading = false;
                state.pendientes = action.payload;
            })
            .addCase(fetchCentrosPendientes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error al cargar centros pendientes";
            });
        builder
            .addCase(fetchCentrosAceptados.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCentrosAceptados.fulfilled, (state, action) => {
                state.loading = false;
                state.aceptados = action.payload;
            })
            .addCase(fetchCentrosAceptados.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error al cargar centros aceptados";
            });

    },
});

export default centroSlice.reducer;