import type { DisponibilidadResponseDTO } from "../disponibilidad/DisponibilidadResponseDTO";
import type { TipoDeServicio } from "../enums/TipoDeServicio";

export interface ProfesionalResponseDTO {
    id: number;
    nombre: string;
    apellido: string;
    disponibilidades: DisponibilidadResponseDTO[];
    servicios: TipoDeServicio[];
}