import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { ClienteDTO } from "../../types/cliente/ClienteDTO";
import type { PrestadorServicioDTO } from "../../types/prestadorDeServicio/PestadorServicioDTO";
import { ClienteService } from "../../services/ClienteService";
import { PrestadorServicioService } from "../../services/PrestadorServicioService";
import type { ClienteResponseDTO } from "../../types/cliente/ClienteResponseDTO";
import type { PrestadorServicioResponseDTO } from "../../types/prestadorDeServicio/PrestadorServicioResponseDTO";
import type { RootState } from "../store";

const clienteService = new ClienteService();
const prestadorService = new PrestadorServicioService();

interface AuthState {
    user: ClienteResponseDTO | PrestadorServicioResponseDTO | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

export const updateUserCliente = createAsyncThunk<ClienteResponseDTO, Partial<ClienteDTO>, { state: RootState }>("auth/updateUserCliente",
    async (cliente, { getState }) => {
        const state = getState();
        const userId = state.user.user?.id;
        if (!userId) throw new Error("No hay usuario logueado");

        const response = await clienteService.put(userId, cliente as ClienteDTO);
        return response
    }
);

export const updateUserPrestador = createAsyncThunk<PrestadorServicioResponseDTO, Partial<PrestadorServicioDTO>, { state: RootState }>("auth/updateUserPrestador",
    async (prestador, { getState }) => {
        const state = getState();
        const userId = state.user.user?.id; // asumiendo que UsuarioDTO tiene id
        if (!userId) throw new Error("No hay usuario logueado");

        const response = await prestadorService.put(userId, prestador as PrestadorServicioDTO);
        return response
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<ClienteResponseDTO | PrestadorServicioResponseDTO>) => {
            state.user = action.payload;
            state.error = null;
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateUserCliente.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserCliente.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // guardamos el usuario actualizado
            })
            .addCase(updateUserCliente.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error al actualizar usuario";
            });

        builder
            .addCase(updateUserPrestador.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserPrestador.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // guardamos el usuario actualizado
            })
            .addCase(updateUserPrestador.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error al actualizar usuario";
            });
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;



