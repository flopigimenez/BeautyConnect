import type { CentroDeEsteticaDTO } from "../centroDeEstetica/CentroDeEsteticaDTO";

export interface DomicilioDTO {
    id: number;
    calle: string;
    numero: number;
    codigoPostal: number;
    localidad: string;
    }