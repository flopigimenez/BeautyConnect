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

const loadUserFromStorage = () => {
    try {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error("Error loading user from storage:", error);
        return null;
    }
};

const initialState: AuthState = {
    user: loadUserFromStorage(),
    loading: false,
    error: null,
};

export const hydrateAuthUserFromApi = createAsyncThunk<
  ClienteResponseDTO | PrestadorServicioResponseDTO,
  void,
  { state: RootState }
>("auth/hydrateAuthUserFromApi", async (_arg, { getState }) => {
  const state = getState();
  const u = state.user.user as any;
  if (!u) throw new Error("No hay usuario en sesión");
  if (u.id) return u; // ya hidratado

  // 1) intentar como Cliente
  if (u.uid) {
    const c = await clienteService.getByUid(u.uid);
    if (c?.id) return c;
  }

  // 2) intentar como Prestador
  if (u.uid) {
    const p = await prestadorService.getByUid(u.uid);
    if (p?.id) return p;
  }

  throw new Error("No se pudo hidratar el usuario por uid");
});
export const updateUserCliente = createAsyncThunk<ClienteResponseDTO, Partial<ClienteDTO>, { state: RootState }>("auth/updateUserCliente",
    async (cliente, { getState }) => {
        const state = getState();
        const userId = state.user.user?.id
        if (!userId) throw new Error("No hay usuario logueado");

        const response = await clienteService.put(userId, cliente as ClienteDTO);
        return response;
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
            if (action.payload) {
                localStorage.setItem('user', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('user');
            }
        },
        clearUser: (state) => {
            state.user = null;
            state.error = null;
            localStorage.removeItem('user');
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
             builder
    .addCase(hydrateAuthUserFromApi.pending, (state) => {
      state.loading = true;
    })
    .addCase(hydrateAuthUserFromApi.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      // persistimos aquí también por si no pasa por setUser
      localStorage.setItem("user", JSON.stringify(action.payload));
    })
    .addCase(hydrateAuthUserFromApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "No se pudo hidratar el usuario";
    });
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;



