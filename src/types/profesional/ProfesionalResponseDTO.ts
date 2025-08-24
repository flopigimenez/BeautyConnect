import type { CentroEsteticaResponseDTO } from "../centroDeEstetica/CentroEsteticaResponseDTO";
import type { DisponibilidadResponseDTO } from "../disponibilidad/DisponibilidadResponseDTO";
import type { ServicioResponseDTO } from "../servicio/ServicioResponseDTO";

export interface ProfesionalResponseDTO {
    id: number;
    nombre: string;
    apellido: string;
    disponibilidades: DisponibilidadResponseDTO[];
    servicios: ServicioResponseDTO[];
    centroDeEstetica: CentroEsteticaResponseDTO;
}