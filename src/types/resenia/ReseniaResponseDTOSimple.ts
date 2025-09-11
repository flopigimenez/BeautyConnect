import type { ClienteResponseDTO } from "../cliente/ClienteResponseDTO";

export interface ReseniaResponseDTOSimple {
   id: number;
   puntuacion: number;
   comentario: string;
   cliente: ClienteResponseDTO;
}