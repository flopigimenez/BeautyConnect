import { TipoDeServicio } from "../enums/TipoDeServicio";
export interface ServicioDTO {
    id: number;
    tipoServicio: TipoDeServicio;
    descripcion: string;
    precio: number;
    duracion: number; // Duración en minutos
    }