import type { TipoDeServicio } from "../enums/TipoDeServicio";

export interface ServicioDTO {
    active?: boolean;
    tipoDeServicio: TipoDeServicio;
    precio: number; 
    centroDeEsteticaId: number;
    descripcion: string;
    titulo: string;
}
