import type { CentroDeEsteticaResponseDTO } from "../centroDeEstetica/CentroDeEsteticaResponseDTO";
import type { ClienteResponseDTO } from "../cliente/ClienteResponseDTO";
import type { TurnoResponseDTO } from "../turno/TurnoResponseDTO";

export interface ReseniaResponseDTO {
   id: number;
   puntuacion: number;
   comentario: string;
   cliente: ClienteResponseDTO;
   centroDeEstetica: CentroDeEsteticaResponseDTO;
   turno: TurnoResponseDTO
}