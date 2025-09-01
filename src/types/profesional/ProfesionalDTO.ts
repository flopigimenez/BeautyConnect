import type { DisponibilidadDTO } from "../disponibilidad/DisponibilidadDTO";
import type { ServicioDTO } from "../servicio/ServicioDTO";

export interface ProfesionalDTO {
    id: number;
    nombre: string;
    apellido: string;
    disponibilidades: DisponibilidadDTO[];
    servicios: ServicioDTO[];
}
