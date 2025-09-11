import type { DisponibilidadDTO } from "../types/disponibilidad/DisponibilidadDTO";
import type { DisponibilidadResponseDTO } from "../types/disponibilidad/DisponibilidadResponseDTO";
import { BackendClient } from "./BackendClient";

export class DisponibilidadService extends BackendClient<DisponibilidadDTO, DisponibilidadResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/disponibilidad");
    }
}