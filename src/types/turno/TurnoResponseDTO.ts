import type { ServicioResponseDTO } from "../servicio/ServicioResponseDTO";

export interface TurnoResponseDTO{
    id: number;
    fecha: string;
    hora: string;
    // clienteResponseDTO: ClienteResponseDTO;
    servicioResponseDTO: ServicioResponseDTO;
    // prestadorDeServicioResponseDTO: PrestadorDeServicioResponseDTO
    // estado: Estado;
}