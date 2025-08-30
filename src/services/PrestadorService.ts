import { BackendClient } from "./BackendClient";
import type { PrestadorServicioResponseDTO } from "../types/prestadorDeServicio/PrestadorServicioResponseDTO"
export class PrestadorService extends BackendClient<Partial<PrestadorServicioResponseDTO>, PrestadorServicioResponseDTO> {
  constructor() {
    super("http://localhost:8080/api/prestador");
  }

  update(id: number, data: Partial<PrestadorServicioResponseDTO>) {
    return fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => {
      if (!r.ok) throw new Error("Error al actualizar prestador");
      return r.json() as Promise<PrestadorServicioResponseDTO>;
    });
  }
}
