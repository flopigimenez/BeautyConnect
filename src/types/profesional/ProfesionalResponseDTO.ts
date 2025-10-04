import type { CentroEsteticaResponseDTO } from "../centroDeEstetica/CentroDeEsteticaResponseDTO";

export interface ProfesionalResponseDTO {
    id: number;
    nombre: string;
    apellido: string;
    centroDeEstetica: CentroEsteticaResponseDTO;
    contacto: number;
    active?: boolean;

}