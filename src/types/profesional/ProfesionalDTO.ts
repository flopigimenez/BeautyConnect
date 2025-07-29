import type { CentroDeEsteticaDTO } from "../centroDeEstetica/CentroDeEsteticaDTO";
import type { DisponibilidadDTO } from "../disponibilidad/DisponibilidadDTO";
import type { ServicioDTO } from "../servicio/ServicioDTO";

export interface ProfesionalDTO {
    id: number;
    nombre: string;
    disponibilidades: DisponibilidadDTO[];
    servicios: ServicioDTO[];
    centroDeEstetica: CentroDeEsteticaDTO;
}
