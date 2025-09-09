import type { DisponibilidadResponseDTO } from "../disponibilidad/DisponibilidadResponseDTO";
import type { ProfesionalResponseDTO } from "../profesional/ProfesionalResponseDTO";
import type { ServicioResponseDTO } from "../servicio/ServicioResponseDTO";

export interface ProfesionalServicioResponseDTOSimple {
    id: number;
    duracion: number; 
    servicioResponseDTO: ServicioResponseDTO; 
    profesionalResponseDTO: ProfesionalResponseDTO; 
    disponibilidadDTO: DisponibilidadResponseDTO[]; 
}