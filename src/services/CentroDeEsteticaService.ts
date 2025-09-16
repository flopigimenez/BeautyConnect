import type { CentroDeEsteticaDTO } from "../types/centroDeEstetica/CentroDeEsteticaDTO";
import type { CentroEsteticaResponseDTO } from "../types/centroDeEstetica/CentroEsteticaResponseDTO";
import type { Estado } from "../types/enums/Estado";
import { BackendClient } from "./BackendClient";

export class CentroDeEsteticaService extends BackendClient<CentroDeEsteticaDTO, CentroEsteticaResponseDTO> {
    constructor() {
        super("http://localhost:8080/api/centrodeestetica");
    }

    async cambiarEstado(id: number, estado: Estado): Promise<CentroEsteticaResponseDTO> {
        const resp = await fetch(`${this.baseUrl}/cambiarEstado/centro/${id}/estado/${estado}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        });
        if (!resp.ok) throw new Error("No se pudo cambiar el estado");
        return await resp.json();
    }

     async listarPorEstado(estado: Estado): Promise<CentroEsteticaResponseDTO[]> {
        const resp = await fetch(`${this.baseUrl}/listarEstado/estado/${estado}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!resp.ok) throw new Error("No se pudo listar por estado");
        return await resp.json();
    }
}