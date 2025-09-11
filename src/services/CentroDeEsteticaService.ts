import type { CentroDeEsteticaDTO } from "../types/centroDeEstetica/CentroDeEsteticaDTO";
import type { CentroEsteticaResponseDTO } from "../types/centroDeEstetica/CentroDeEsteticaResponseDTO";
import { BackendClient } from "./BackendClient";

export class CentroDeEsteticaService extends BackendClient<CentroDeEsteticaDTO, CentroEsteticaResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/centrodeestetica");
    }
}