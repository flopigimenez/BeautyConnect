import type { CentroEsteticaResponseDTO } from "../centroDeEstetica/CentroEsteticaResponseDTO";
import { TipoDeServicio } from "../enums/TipoDeServicio";
export interface ServicioResponseDTO {
    id: number;
    tipoServicio: TipoDeServicio;
    descripcion: string;
    precio: number;
    duracion: number; // Duración en minutos
    CentroDeEstetica: CentroEsteticaResponseDTO;
    }