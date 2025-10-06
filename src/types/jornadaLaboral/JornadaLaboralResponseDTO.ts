import type { JornadaLaboralCreateDTO } from "./JornadaLaboralCreateDTO";

export interface JornadaLaboralResponseDTO {
  id: number;
  profesionalId: number;
  dia: JornadaLaboralCreateDTO["dia"];
  horaInicio: string;
  horaFin: string;
  active: boolean;
}