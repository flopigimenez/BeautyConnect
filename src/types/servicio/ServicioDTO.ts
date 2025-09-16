import type { TipoDeServicio } from "../enums/TipoDeServicio";

export interface ServicioDTO {
    tipoDeServicio: TipoDeServicio;
    precio: number; 
    centroDeEsteticaId: number;
}
