import type { ClienteDTO } from "../cliente/ClienteDTO";
import type { Estado } from "../enums/Estado";
import type { ProfesionalDTO } from "../profesional/ProfesionalDTO";
import type { ServicioDTO } from "../servicio/ServicioDTO";

export interface TurnoDTO{
    id: number;
    fecha: string;
    hora: string;
    cliente: ClienteDTO;
    servicio: ServicioDTO;
    profesional: ProfesionalDTO;
    estado: Estado;

}