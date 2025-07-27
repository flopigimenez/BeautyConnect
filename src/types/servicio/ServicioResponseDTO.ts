import type { CentroEsteticaResponseDTO } from "../centroDeEstetica/CentroEsteticaResponseDTO";

export interface ServicioResponseDTO {
    id: number;
    tipoServicio: tipoServicio;
    descripcion: string;
    precio: number;
    duracion: number; // Duración en minutos
    CentroDeEstetica: CentroEsteticaResponseDTO;
    }