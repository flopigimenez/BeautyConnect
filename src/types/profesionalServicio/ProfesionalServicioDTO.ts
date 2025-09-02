import type { DisponibilidadDTO } from "../disponibilidad/DisponibilidadDTO";
import type { ProfesionalDTO } from "../profesional/ProfesionalDTO";
import type { ServicioDTO } from "../servicio/ServicioDTO";

export interface ProfesionalServicioDTO {
    id: number;
    duracion: number; 
    servicioDTO: ServicioDTO; 
    profesionalDTO: ProfesionalDTO; 
    disponibilidadDTO: DisponibilidadDTO; 
}