import type { DomicilioDTO } from '../domicilio/DomicilioDTO';
import type { ServicioDTO } from '../servicio/ServicioDTO';
import type { TurnoDTO } from '../turno/TurnoDTO';
import type { ReseñaDTO } from '../reseña/ReseñaDTO';
export interface CentroDeEsteticaDTO {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  docValido: string;
  cuit: number;
  domicilio: DomicilioDTO;
  servicios: ServicioDTO[];
  turnos: TurnoDTO[];
  reseñas: ReseñaDTO[];
}

