
export interface CentroDeEsteticaDTO {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  docValido: string;
  cuit: number;
  domicilios: DomicilioDTO[];
  servicios: ServicioDTO[];
  turnos: TurnoDTO[];
  reseñas: ReseñaDTO[];
}

