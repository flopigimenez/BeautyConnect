import type { ClienteResponseDTO } from "../cliente/ClienteResponseDTO";
import type { Estado } from "../enums/Estado";
import type { PrestadorDeServicioResponseDTO } from "../prestadorDeServicio/PrestadorDeServicioResponseDTO";
import type { ServicioResponseDTO } from "../servicio/ServicioResponseDTO";

export interface TurnoResponseDTO{
    id:number;
    fecha: Date;
    hora: Date;
    clienteResponseDTO: ClienteResponseDTO;
    servicioResponseDTO: ServicioResponseDTO;
    prestadorDeServicioResponseDTO: PrestadorDeServicioResponseDTO;
    estado: Estado;
    
}