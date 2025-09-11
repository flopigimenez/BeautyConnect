import type { HorarioCentroDTO } from '../horarioCentro/HorarioCentroDTO';
import type { ServicioDTOSimple } from '../servicio/ServicioDTOSimple';
import type { ProfesionalDTOSimple } from '../profesional/ProfesionalDTOSimple';

export interface CentroDeEsteticaDTO {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  docValido: string;
  cuit: number;
  domicilio_id: number;
  servicios: ServicioDTOSimple[];
  profesionales: ProfesionalDTOSimple[];
  horarioCentro: HorarioCentroDTO;
}