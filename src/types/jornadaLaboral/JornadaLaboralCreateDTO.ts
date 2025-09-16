export interface JornadaLaboralCreateDTO {
  profesionalId: number;
  dia: "MONDAY"|"TUESDAY"|"WEDNESDAY"|"THURSDAY"|"FRIDAY"|"SATURDAY"|"SUNDAY";
  horaInicio: string;   // "HH:mm" o "HH:mm:ss"
  horaFin: string;
  activo?: boolean;
}