import type { DomicilioResponseDTO } from "../types/domicilio/DomicilioResponseDTO";
import type { DomicilioDTO } from "../types/domicilio/DomicilioDTO";
import { BackendClient } from "./BackendClient";
export class DomicilioService extends BackendClient<DomicilioDTO, DomicilioResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/domicilio");
    }
}