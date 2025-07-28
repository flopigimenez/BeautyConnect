import type { ReseñaDTO } from "../types/reseña/ReseñaDTO";
import type { ReseñaResponseDTO } from "../types/reseña/ReseñaResponseDTO";
import { BackendClient } from "./BackendClient";

export class ReseñaService extends BackendClient< ReseñaDTO, ReseñaResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/resenia");
    }
}