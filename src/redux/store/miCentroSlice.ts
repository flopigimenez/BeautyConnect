import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CentroEsteticaResponseDTO } from "../../types/centroDeEstetica/CentroDeEsteticaResponseDTO";

interface CentroState {
    centro: CentroEsteticaResponseDTO | null;
    loading: boolean;
    error: string | null;
}

const initialState: CentroState = {
    centro: null,
    loading: false,
    error: null,
};

const centroSlice = createSlice({
    name: "centro",
    initialState,
    reducers: {
        setCentro: (state, action: PayloadAction<CentroEsteticaResponseDTO>) => {
            state.centro = action.payload;
            state.error = null;
        },
        clearCentro: (state) => {
            state.centro = null;
            state.error = null;
        },
    },
});

export const { setCentro, clearCentro } = centroSlice.actions;
export default centroSlice.reducer;