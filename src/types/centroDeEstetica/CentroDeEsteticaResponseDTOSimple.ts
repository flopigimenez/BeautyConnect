import type { DomicilioResponseDTO } from '../domicilio/DomicilioResponseDTO';
import { Estado } from '../enums/Estado';
import type { HorarioCentroResponseDTO } from '../horarioCentro/HorarioCentroResponseDTO';
import type { PrestadorServicioResponseDTO } from '../prestadorDeServicio/PrestadorServicioResponseDTO';

export interface CentroEsteticaResponseDTOSimple {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    docValido: string;
    cuit: number;
    estado: Estado;
    prestadorDeServicio: PrestadorServicioResponseDTO;
    domicilio: DomicilioResponseDTO;
    horariosCentro: HorarioCentroResponseDTO[];
}