import type { ServicioDTO } from "../servicio/ServicioDTO";

export interface TurnoDTO{
    id: number;
    fecha: string;
    hora: string;
    // clienteDTO: ClienteDTO;
    servicioDTO: ServicioDTO;
    // PrestadorDeServicioDTO prestadorDeServicioDTO
    // estado: Estado;
}