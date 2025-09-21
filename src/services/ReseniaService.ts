import type { ReseniaDTO } from "../types/resenia/ReseniaDTO";
import type { ReseniaResponseDTO } from "../types/resenia/ReseniaResponseDTO";
import { BackendClient } from "./BackendClient";

export class ReseniaService extends BackendClient<ReseniaDTO, ReseniaResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/resenia");
    }
    async getReseniasByCentroId(centroId: number): Promise<ReseniaResponseDTO[]> {
        const response = await fetch(`${this.baseUrl}/centro/${centroId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (!response.ok) throw new Error("No se pudo obtener las reseñas del centro");
        return await response.json();
    }
}