import type { HorarioCentroDTO } from '../horarioCentro/HorarioCentroDTO';

export interface CentroDeEsteticaDTOSimple {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  docValido: string;
  cuit: number;
  domicilio_id: number;
  horarioCentro: HorarioCentroDTO;
}