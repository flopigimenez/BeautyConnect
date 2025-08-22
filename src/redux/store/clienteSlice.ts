import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ClienteResponseDTO } from "../../types/cliente/ClienteResponseDTO";
import { ClienteService } from "../../services/ClienteService";

const clienteService = new ClienteService();

interface ClienteState {
    clientes: ClienteResponseDTO[];
    loading: boolean;
    error: string | null;
}

const initialState: ClienteState = {
    clientes: [],
    loading: false,
    error: null,
};

export const fetchCliente = createAsyncThunk<ClienteResponseDTO[]>("cliente/fetchAll", async () => {
    return await clienteService.getAll();
});

const clienteSlice = createSlice({
    name: "clientes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCliente.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCliente.fulfilled, (state, action) => {
                state.loading = false;
                state.clientes = action.payload;
            })
            .addCase(fetchCliente.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error al cargar cliente";
            });
    },

});

export default clienteSlice.reducer;