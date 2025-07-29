import type { ClienteResponseDTO } from "../cliente/ClienteResponseDTO";
import type { Estado } from "../enums/Estado";
import type { PrestadorServicioResponseDTO } from "../prestadorDeServicio/PrestadorServicioResponseDTO";
import type { ServicioResponseDTO } from "../servicio/ServicioResponseDTO";

export interface TurnoResponseDTO{
    id:number;
    fecha: Date;
    hora: Date;
    clienteResponseDTO: ClienteResponseDTO;
    servicioResponseDTO: ServicioResponseDTO;
    prestadorServicioResponseDTO: PrestadorServicioResponseDTO;
    estado: Estado;
    
}