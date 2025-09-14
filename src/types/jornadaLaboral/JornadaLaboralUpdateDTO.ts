import type { JornadaLaboralCreateDTO } from "./JornadaLaboralCreateDTO";

export interface JornadaLaboralUpdateDTO {
  dia: JornadaLaboralCreateDTO["dia"];
  horaInicio: string;
  horaFin: string;
  activo?: boolean;
}