import type { DisponibilidadDTO } from "../disponibilidad/DisponibilidadDTO";
import type { TipoDeServicio } from "../enums/TipoDeServicio";

export interface ProfesionalDTO {
    id: number;
    nombre: string;
    apellido: string;
    disponibilidades: DisponibilidadDTO[];
    servicios: TipoDeServicio[];
}
