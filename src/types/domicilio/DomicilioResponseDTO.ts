import type { CentroEsteticaResponseDTO } from "../centroDeEstetica/CentroEsteticaResponseDTO";

export interface DomicilioResponseDTO {
    id: number;
    calle: string;
    numero: number;
    codigoPostal: number;
    localidad: string;
}