import type { TurnoDTO } from "../types/turno/TurnoDTO";
import type { TurnoResponseDTO } from "../types/turno/TurnoResponseDTO";
import { BackendClient } from "./BackendClient";

export class TurnoService extends BackendClient<TurnoDTO, TurnoResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/turnos");
    }

    async getByClienteId(clienteId: number): Promise<TurnoResponseDTO[]> {
        const response = await fetch(`${this.baseUrl}/cliente/${clienteId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error("No se pudo cambiar el estado activo");
        return await response.json();
    }
}