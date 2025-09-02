import type { CentroDeEsteticaDTO } from "../centroDeEstetica/CentroDeEsteticaDTO";

export interface ProfesionalDTO {
    id: number;
    nombre: string;
    apellido: string;
    centroDeEstitica: CentroDeEsteticaDTO
}
