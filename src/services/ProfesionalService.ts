import { BackendClient } from "./BackendClient";
import type { ProfesionalDTO } from "../types/profesional/ProfesionalDTO";
import type { ProfesionalResponseDTO } from "../types/profesional/ProfesionalResponseDTO";

export class ProfesionalService extends BackendClient<ProfesionalDTO, ProfesionalResponseDTO>   {
    constructor(){
        super("http://localhost:8080/api/profesional");

}
}