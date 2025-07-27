import type { ServicioResponseDTO } from "../servicio/ServicioResponseDTO";

export interface TurnoResponseDTO{
    id:number;
    fecha: Date;
    hora: Date;
    servicio: ServicioResponseDTO;
    estado: Estado;
    
}