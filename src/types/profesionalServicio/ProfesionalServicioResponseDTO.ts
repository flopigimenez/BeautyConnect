import type { DisponibilidadResponseDTO } from "../disponibilidad/DisponibilidadResponseDTO";
import type { ProfesionalResponseDTO } from "../profesional/ProfesionalResponseDTO";
import type { ServicioResponseDTO } from "../servicio/ServicioResponseDTO";

export interface ProfesionalServicioResponseDTO {
    id: number;
    duracion: number; 
    servicioDTO: ServicioResponseDTO; 
    profesionalDTO: ProfesionalResponseDTO; 
    disponibilidadDTO: DisponibilidadResponseDTO; 
}