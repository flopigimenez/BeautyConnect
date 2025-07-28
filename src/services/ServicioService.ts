import type { ServicioDTO } from "../types/servicio/ServicioDTO";
import type { ServicioResponseDTO } from "../types/servicio/ServicioResponseDTO";
import { BackendClient } from "./BackendClient";
export class ServicioService extends BackendClient<ServicioDTO, ServicioResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/servicio");
    }
}