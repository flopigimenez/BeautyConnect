import type { PrestadorServicioDTO } from "../types/prestadorDeServicio/PestadorServicioDTO";
import type { PrestadorServicioResponseDTO } from "../types/prestadorDeServicio/PrestadorServicioResponseDTO";
import { BackendClient } from "./BackendClient";
export class PrestadorServicioService extends BackendClient< PrestadorServicioDTO, PrestadorServicioResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/prestadordeservicio");
    }
    async getByUid(uid: string): Promise<PrestadorServicioResponseDTO | null> {
    const res = await fetch(`${this.baseUrl}/uid/${uid}`);
    if (!res.ok) return null;
    return (await res.json()) as PrestadorServicioResponseDTO;
  }

  async create(data: PrestadorServicioDTO): Promise<PrestadorServicioResponseDTO> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("No se pudo crear el prestador");
    return (await res.json()) as PrestadorServicioResponseDTO;
  }

  async update(id: number, data: PrestadorServicioDTO): Promise<PrestadorServicioResponseDTO> {
    const res = await fetch(`${this.baseUrl}/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el prestador");
    return (await res.json()) as PrestadorServicioResponseDTO;
  }
}