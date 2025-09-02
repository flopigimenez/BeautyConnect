import type { ClienteDTO } from "../cliente/ClienteDTO";
import type { Estado } from "../enums/Estado";

export interface TurnoDTO{
    id: number;
    fecha: string;
    hora: string;
    cliente: ClienteDTO;
    estado: Estado;
}