import type { ClienteResponseDTO } from "../cliente/ClienteResponseDTO";
import type { Estado } from "../enums/Estado";
import type { ProfesionalResponseDTO } from "../profesional/ProfesionalResponseDTO";
import type { ServicioResponseDTO } from "../servicio/ServicioResponseDTO";

export interface TurnoResponseDTO{
    id:number;
    fecha: Date;
    hora: Date;
    clienteResponseDTO: ClienteResponseDTO;
    servicioResponseDTO: ServicioResponseDTO;
    profesionalResponseDTO: ProfesionalResponseDTO
    estado: Estado;
    
}