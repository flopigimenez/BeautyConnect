import type { CentroEsteticaResponseDTO } from "../centroDeEstetica/CentroEsteticaResponseDTO";
import type { TipoDeServicio } from "../enums/TipoDeServicio";

export interface ServicioResponseDTO {
    id: number;
    tipoDeServicio: TipoDeServicio;
    precio: number;
    duracion: number; // Duración en minutos
    CentroDeEstetica: CentroEsteticaResponseDTO;
    servicioResponseDTO: ServicioResponseDTO;
    }
