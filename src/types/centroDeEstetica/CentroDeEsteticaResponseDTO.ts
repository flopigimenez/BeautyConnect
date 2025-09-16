import type { DomicilioResponseDTO } from '../domicilio/DomicilioResponseDTO';
import { Estado } from '../enums/Estado';
import type { HorarioCentroResponseDTO } from '../horarioCentro/HorarioCentroResponseDTO';
import type { ServicioResponseDTOSimple } from '../servicio/ServicioResponseDTOSimple';
import type { ProfesionalResponseDTOSimple } from '../profesional/ProfesionalResponseDTOSimple';
import type { ReseniaResponseDTOSimple } from '../resenia/ReseniaResponseDTOSimple';

export interface CentroEsteticaResponseDTO {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    docValido: string;
    cuit: number;
    estado: Estado;
    domicilio: DomicilioResponseDTO;
    servicios: ServicioResponseDTOSimple[];
    resenias: ReseniaResponseDTOSimple[];
    profesionales: ProfesionalResponseDTOSimple[];
    horariosCentro: HorarioCentroResponseDTO[];
}