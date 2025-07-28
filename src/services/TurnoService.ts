import type { TurnoDTO } from "../types/turno/TurnoDTO";
import type { TurnoResponseDTO } from "../types/turno/TurnoResponseDTO";
import { BackendClient } from "./BackendClient";
export class TurnoService extends BackendClient<TurnoDTO, TurnoResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/turnos");
    }
}