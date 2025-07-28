import type { TipoDeServicio } from "../enums/TipoDeServicio";

export interface ServicioResponseDTO {
    id: number;
    tipoDeServicio: TipoDeServicio;
    duracion: number;
    precio: number;
    // centroDeEsteticaDTO: CentroDeEsteticaDTO;
}