import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { TurnoService } from "../../services/TurnoService";
import type { TurnoDTO } from "../../types/turno/TurnoDTO";
import type { TurnoResponseDTO } from "../../types/turno/TurnoResponseDTO";

const turnoService = new TurnoService();

interface TurnoState {
    turno: TurnoDTO | TurnoResponseDTO | null;
    loading: boolean;
    error: string | null;
}

const initialState: TurnoState = {
    turno: null,
    loading: false,
    error: null,
};

// Thunks para operaciones asíncronas
export const createTurno = createAsyncThunk(
    'turno/createTurno',
    async (turnoData: TurnoDTO, { rejectWithValue }) => {
        try {
            const response = await turnoService.post(turnoData);
            return response;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message || 'Error al crear turno');
        }
    }
);

export const getTurnoById = createAsyncThunk(
    'turno/getTurnoById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await turnoService.getById(id);
            return response;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message || 'Error al obtener turno');
        }
    }
);

/*export const updateTurno = createAsyncThunk(
    'turno/updateTurno',
    async ({ id, turnoData }: { id: number, turnoData: Partial<TurnoDTO> }, { rejectWithValue }) => {
        try {
            const response = await turnoService.post(id, turnoData);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error al actualizar turno');
        }
    }
);*/

export const deleteTurno = createAsyncThunk(
    'turno/deleteTurno',
    async (id: number, { rejectWithValue }) => {
        try {
            await turnoService.delete(id);
            return id;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message || 'Error al eliminar turno');
        }
    }
);

const turnoSlice = createSlice({
    name: "turno",
    initialState,
    reducers: {
        setTurno: (state, action: PayloadAction<TurnoDTO | TurnoResponseDTO>) => {
            state.turno = action.payload;
            state.error = null;
        },
        clearTurno: (state) => {
            state.turno = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createTurno.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTurno.fulfilled, (state, action) => {
                state.loading = false;
                state.turno = action.payload;
                state.error = null;
            })
            .addCase(createTurno.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get by ID
            .addCase(getTurnoById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTurnoById.fulfilled, (state, action) => {
                state.loading = false;
                state.turno = action.payload;
                state.error = null;
            })
            .addCase(getTurnoById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            /*.addCase(updateTurno.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTurno.fulfilled, (state, action) => {
                state.loading = false;
                state.turno = action.payload;
                state.error = null;
            })
            .addCase(updateTurno.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })*/
            // Delete
            .addCase(deleteTurno.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTurno.fulfilled, (state) => {
                state.loading = false;
                state.turno = null;
                state.error = null;
            })
            .addCase(deleteTurno.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setTurno, clearTurno, clearError } = turnoSlice.actions;
export default turnoSlice.reducer;