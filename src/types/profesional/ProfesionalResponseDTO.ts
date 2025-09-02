import type { CentroEsteticaResponseDTO } from "../centroDeEstetica/CentroEsteticaResponseDTO";

export interface ProfesionalResponseDTO {
    id: number;
    nombre: string;
    apellido: string;
    centroDeEstetica: CentroEsteticaResponseDTO;
}