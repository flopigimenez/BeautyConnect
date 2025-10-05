import type { CentroDeEsteticaResponseDTO } from "../centroDeEstetica/CentroDeEsteticaResponseDTO";
import type { TipoDeServicio } from "../enums/TipoDeServicio";

export interface ServicioResponseDTO {
    id: number;
    tipoDeServicio: TipoDeServicio;
    precio: number;
    centroDeEstetica: CentroDeEsteticaResponseDTO;
}
