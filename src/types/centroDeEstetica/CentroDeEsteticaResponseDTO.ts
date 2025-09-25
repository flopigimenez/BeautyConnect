import type { DomicilioResponseDTO } from '../domicilio/DomicilioResponseDTO';
import { Estado } from '../enums/Estado';
import type { HorarioCentroResponseDTO } from '../horarioCentro/HorarioCentroResponseDTO';
import type { ServicioResponseDTOSimple } from '../servicio/ServicioResponseDTOSimple';
import type { ProfesionalResponseDTOSimple } from '../profesional/ProfesionalResponseDTOSimple';
import type { ReseniaResponseDTOSimple } from '../resenia/ReseniaResponseDTOSimple';
import type { PrestadorServicioResponseDTO } from '../prestadorDeServicio/PrestadorServicioResponseDTO';

export interface CentroEsteticaResponseDTO {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    docValido: string;
    cuit: number;
    active: boolean;
    estado: Estado;
    prestadorDeServicio: PrestadorServicioResponseDTO;
    domicilio: DomicilioResponseDTO;
    servicios: ServicioResponseDTOSimple[];
    profesionales: ProfesionalResponseDTOSimple[];
    horariosCentro: HorarioCentroResponseDTO[];
    resenias?: ReseniaResponseDTOSimple[];
}
