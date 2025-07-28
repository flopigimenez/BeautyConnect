import type { TipoDeServicio } from "../enums/TipoDeServicio";

export interface ServicioDTO {
    id: number;
    tipoDeServicio: TipoDeServicio;
    descripcion: string;
    duracion: number;
    precio: number; 
    // centroDeEsteticaDTO: CentroDeEsteticaDTO;
}
