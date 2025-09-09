import type { DomicilioDTO } from '../domicilio/DomicilioDTO';
import type { ServicioDTO } from '../servicio/ServicioDTO';
import type { ReseñaDTO } from '../reseña/ReseñaDTO';
import type { ProfesionalDTO } from '../profesional/ProfesionalDTO';
import type { HorarioCentroDTO } from '../horarioCentro/HorarioCentroDTO';

export interface CentroDeEsteticaDTO {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  docValido: string;
  cuit: number;
  domicilio: DomicilioDTO;
  servicios: ServicioDTO[];
  reseñas: ReseñaDTO[];
  profesionales: ProfesionalDTO[];
  horarioCentro: HorarioCentroDTO;
}

