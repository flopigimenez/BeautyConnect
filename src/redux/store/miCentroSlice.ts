import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CentroDeEsteticaResponseDTO } from "../../types/centroDeEstetica/CentroDeEsteticaResponseDTO";
import { CentroDeEsteticaService } from "../../services/CentroDeEsteticaService";

const centroService = new CentroDeEsteticaService();

interface CentroState {
    centro: CentroDeEsteticaResponseDTO | null;
    loading: boolean;
    error: string | null;
}

const loadCentroFromStorage = () => {
    try {
        const centroData = localStorage.getItem('centro');
        return centroData ? JSON.parse(centroData) : null;
    } catch (error) {
        console.error("Error loading centro from storage:", error);
        return null;
    }
};

const initialState: CentroState = {
    centro: loadCentroFromStorage(),
    loading: false,
    error: null,
};

export const fetchCentro = createAsyncThunk<CentroDeEsteticaResponseDTO, number>(
    "centro/fetch",
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await centroService.getById(id);
            if (!response) {
                throw new Error("Centro no encontrado");
            }
            return response;
        } catch (error) {
            console.error("Error fetching centro:", error);
            return rejectWithValue("Error al obtener el centro");
        }
    }
);
const centroSlice = createSlice({
    name: "centro",
    initialState,
    reducers: {
        setCentroSlice: (state, action: PayloadAction<CentroDeEsteticaResponseDTO>) => {
            state.centro = action.payload; 
            state.error = null;
            if (action.payload) {
                localStorage.setItem('centro', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('centro');
            }
        },
        clearCentro: (state) => {
            state.centro = null;
            state.error = null;
            localStorage.removeItem('centro');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCentro.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCentro.fulfilled, (state, action) => {
                state.centro = action.payload;
                state.loading = false;
                state.error = null;
                localStorage.setItem('centro', JSON.stringify(action.payload));
            })
            .addCase(fetchCentro.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error al cargar el centro";
            });
    },
});

export const { setCentroSlice, clearCentro } = centroSlice.actions;
export default centroSlice.reducer;