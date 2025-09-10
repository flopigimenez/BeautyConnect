import type { DisponibilidadDTO } from "../disponibilidad/DisponibilidadDTO";

export interface ProfesionalServicioDTO {
    id: number;
    duracion: number; 
    profesionalId: number;
    servicioId: number;
    disponibilidades: DisponibilidadDTO[]; 
}