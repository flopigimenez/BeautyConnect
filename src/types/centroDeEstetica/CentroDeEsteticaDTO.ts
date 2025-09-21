import type { HorarioCentroDTO } from '../horarioCentro/HorarioCentroDTO';
//import type { ServicioDTOSimple } from '../servicio/ServicioDTOSimple';
//import type { ProfesionalDTOSimple } from '../profesional/ProfesionalDTOSimple';
import type { DomicilioDTO } from '../domicilio/DomicilioDTO';

export interface CentroDeEsteticaDTO {
  // id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  docValido: string;
  cuit: number;
  domicilio: DomicilioDTO;
  // servicios: ServicioDTOSimple[];
  // profesionales: ProfesionalDTOSimple[];
  horariosCentro: HorarioCentroDTO[];
}
