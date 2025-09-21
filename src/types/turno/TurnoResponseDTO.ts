import type { ClienteResponseDTO } from "../cliente/ClienteResponseDTO";
import type { ProfesionalServicioResponseDTO } from "../profesionalServicio/ProfesionalServicioResponseDTO";
import type { CentroEsteticaResponseDTO } from "../centroDeEstetica/CentroDeEsteticaResponseDTO";
import type { EstadoTurno } from "../enums/EstadoTurno";

export interface TurnoResponseDTO {
    id: number;
    fecha: string;
    hora: string;
    estado: EstadoTurno;
    cliente: ClienteResponseDTO;
    profesionalServicio: ProfesionalServicioResponseDTO;
    centroDeEsteticaResponseDTO?: CentroEsteticaResponseDTO | null;
    centroDeEstetica?: CentroEsteticaResponseDTO | null;
}
