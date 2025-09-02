import type { CentroDeEsteticaDTO } from "../centroDeEstetica/CentroDeEsteticaDTO";
import type { TipoDeServicio } from "../enums/TipoDeServicio";

export interface ServicioDTO {
    id: number;
    tipoDeServicio: TipoDeServicio;
    precio: number; 
    centroDeEsteticaDTO: CentroDeEsteticaDTO;
}
