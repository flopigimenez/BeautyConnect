import type { ClienteResponseDTO } from "../cliente/ClienteResponseDTO";
import type { Estado } from "../enums/Estado";

export interface TurnoResponseDTO{
    id:number;
    fecha: string;
    hora: string;
    clienteResponseDTO: ClienteResponseDTO;
    estado: Estado;
}