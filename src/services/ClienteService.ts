import type { ClienteDTO } from "../types/cliente/ClienteDTO";
import type { ClienteResponseDTO } from "../types/cliente/ClienteResponseDTO";
import { BackendClient } from "./BackendClient";
export class ClienteService extends BackendClient<ClienteDTO, ClienteResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/cliente");
    }

    async cambiarEstadoActivo(id: number): Promise<ClienteResponseDTO> {
        const resp = await fetch(`${this.baseUrl}/cambiarEstadoActivo/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" }
        });
        if (!resp.ok) throw new Error("No se pudo cambiar el estado activo");
        return await resp.json();
    }
}