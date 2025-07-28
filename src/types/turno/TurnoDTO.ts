import type { ClienteDTO } from "../cliente/ClienteDTO";
import type { Estado } from "../enums/estado";
import type { PrestadorServicioDTO } from "../prestadorDeServicio/PestadorServicioDTO";
import type { ServicioDTO } from "../servicio/ServicioDTO";

export interface TurnoDTO{
    id: number;
    fecha: Date;
    hora: Date;
    cliente: ClienteDTO;
    servicio: ServicioDTO;
    prestadorDeServicio: PrestadorServicioDTO;
    estado: Estado;

}