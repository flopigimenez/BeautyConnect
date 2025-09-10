import type { ClienteResponseDTO } from "../cliente/ClienteResponseDTO";
import type { Estado } from "../enums/Estado";
import type { ProfesionalServicioResponseDTO } from "../profesionalServicio/ProfesionalServicioResponseDTO";

export interface TurnoResponseDTO{
    id: number;
    fecha: string;
    hora: string;
    estado: Estado;
    cliente: ClienteResponseDTO;
    profesionalServicio: ProfesionalServicioResponseDTO;
}