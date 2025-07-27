import type { DomicilioResponseDTO } from '../domicilio/DomicilioResponseDTO';
import type { ServicioResponseDTO } from '../servicio/ServicioResponseDTO';
import type { TurnoResponseDTO } from '../turno/TurnoResponseDTO';
import type { ReseñaResponseDTO } from '../reseña/ReseñaResponseDTO';
import { Estado } from '../enums/estado';

export interface CentroEsteticaResponseDTO {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    docValido: string;
    cuit: number;
    domicilios: DomicilioResponseDTO[];
    servicios: ServicioResponseDTO[];
    turnos: TurnoResponseDTO[];
    reseñas: ReseñaResponseDTO[];
    estado: Estado;
}