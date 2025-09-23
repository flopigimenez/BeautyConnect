import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CentroEsteticaResponseDTO } from "../../types/centroDeEstetica/CentroDeEsteticaResponseDTO";

interface CentroState {
    centro: CentroEsteticaResponseDTO | null;
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

const centroSlice = createSlice({
    name: "centro",
    initialState,
    reducers: {
        setCentro: (state, action: PayloadAction<CentroEsteticaResponseDTO>) => {
           if ("centro" in action.payload) {
                state.centro = action.payload;
            } else {
                state.centro = null;
            }
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
});

export const { setCentro, clearCentro } = centroSlice.actions;
export default centroSlice.reducer;