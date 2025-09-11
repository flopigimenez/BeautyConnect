import type { ReseñaDTO } from "../types/resenia/ReseniaDTO";
import type { ReseñaResponseDTO } from "../types/resenia/ReseniaResponseDTO";
import { BackendClient } from "./BackendClient";

export class ReseñaService extends BackendClient< ReseñaDTO, ReseñaResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/resenia");
    }
}