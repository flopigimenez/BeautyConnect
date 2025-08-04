import type { CentroEsteticaResponseDTO } from "../centroDeEstetica/CentroEsteticaResponseDTO";
import type { ClienteResponseDTO } from "../cliente/ClienteResponseDTO";

export interface ReseñaResponseDTO {
   id: number;
   comentario: string;
    calificacion: number;
    fechaCreacion: string;
   //  cliente: ClienteResponseDTO;
   //  centroDeEstetica: CentroEsteticaResponseDTO;
    }