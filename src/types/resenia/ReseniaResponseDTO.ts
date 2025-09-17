import type { CentroEsteticaResponseDTO } from "../centroDeEstetica/CentroDeEsteticaResponseDTO";
import type { ClienteResponseDTO } from "../cliente/ClienteResponseDTO";

export interface ReseniaResponseDTO {
   id: number;
   puntuacion: number;
   comentario: string;
   cliente: ClienteResponseDTO;
   centroDeEstetica: CentroEsteticaResponseDTO;
}