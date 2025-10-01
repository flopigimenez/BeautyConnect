import type { PrestadorServicioDTO } from "../types/prestadorDeServicio/PestadorServicioDTO";
import type { PrestadorServicioResponseDTO } from "../types/prestadorDeServicio/PrestadorServicioResponseDTO";
import { BackendClient } from "./BackendClient";
export class PrestadorServicioService extends BackendClient<PrestadorServicioDTO, PrestadorServicioResponseDTO> {
    constructor() {
        super("http://localhost:8080/api/prestadordeservicio");
    }

    async getByUid(uid: string): Promise<PrestadorServicioResponseDTO | null> {
        const res = await fetch(`${this.baseUrl}/uid/${uid}`);
        if (!res.ok) return null;
        return await res.json();
    }
    async actualizarPrestadorServicio(id: number, data: PrestadorServicioDTO): Promise<PrestadorServicioResponseDTO> {
        const url = `${this.baseUrl}/update/${id}`;
        const res = await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("No se pudo actualizar el prestador de servicio");
        return (await res.json()) as PrestadorServicioResponseDTO;
    }

    async cambiarEstadoActivo(id: number): Promise<PrestadorServicioResponseDTO> {
        const resp = await fetch(`${this.baseUrl}/cambiarEstadoActivo/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" }
        });
        if (!resp.ok) throw new Error("No se pudo cambiar el estado activo");
        return await resp.json();
    }

}