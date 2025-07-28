import type { ClienteDTO } from '../cliente/ClienteDTO';

export interface ReseñaDTO {
    id: number;
    comentario: string;
    calificacion: number;
    fechaCreacion: string;
    cliente: ClienteDTO;
    centroDeEsteticaId: number;
}