import type { ClienteDTO } from "../types/cliente/ClienteDTO";
import type { ClienteResponseDTO } from "../types/cliente/ClienteResponseDTO";
import { BackendClient } from "./BackendClient";
export class ClienteService extends BackendClient<ClienteDTO, ClienteResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/cliente");
    }
}