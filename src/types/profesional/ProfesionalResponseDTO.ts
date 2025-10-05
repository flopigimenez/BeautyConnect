import type { CentroDeEsteticaResponseDTO } from "../centroDeEstetica/CentroDeEsteticaResponseDTO";

export interface ProfesionalResponseDTO {
    id: number;
    nombre: string;
    apellido: string;
    centroDeEstetica: CentroDeEsteticaResponseDTO;
}