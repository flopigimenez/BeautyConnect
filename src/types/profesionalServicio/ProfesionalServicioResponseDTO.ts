import type { DisponibilidadResponseDTO } from "../disponibilidad/DisponibilidadResponseDTO";
import type { ProfesionalResponseDTOSimple } from "../profesional/ProfesionalResponseDTOSimple";
import type { ServicioResponseDTOSimple } from "../servicio/ServicioResponseDTOSimple";

export interface ProfesionalServicioResponseDTO {
    id: number;
    duracion: number; 
    servicio: ServicioResponseDTOSimple; 
    profesional: ProfesionalResponseDTOSimple; 
    disponibilidades: DisponibilidadResponseDTO[]; 
}