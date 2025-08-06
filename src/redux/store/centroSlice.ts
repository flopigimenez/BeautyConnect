import { CentroDeEsteticaService } from "../../services/CentroDeEsteticaService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CentroEsteticaResponseDTO } from "../../types/centroDeEstetica/CentroEsteticaResponseDTO";

const centroService = new CentroDeEsteticaService();

interface CentroState {
    centros: CentroEsteticaResponseDTO[];
    loading: boolean;
    error: string | null;
}

const initialState: CentroState = {
    centros: [],
    loading: false,
    error: null,
};


export const fetchCentros = createAsyncThunk("centros/fetchAll", async () => {
    return await centroService.getAll();
});