import type { PrestadorServicioDTO } from "../types/prestadorDeServicio/PestadorServicioDTO";
import type { PrestadorServicioResponseDTO } from "../types/prestadorDeServicio/PrestadorServicioResponseDTO";
import { BackendClient } from "./BackendClient";
export class PrestadorServicioService extends BackendClient<PrestadorServicioDTO, PrestadorServicioResponseDTO> {
    constructor() {
        super("http://localhost:8080/api/prestadordeservicio");
    }

    async getByUid(uid: string): Promise<PrestadorServicioResponseDTO | null> {
        const res = await fetch(`${this.baseUrl}/by-uid/${uid}`);
        if (!res.ok) return null;
        return await res.json();
    }
}