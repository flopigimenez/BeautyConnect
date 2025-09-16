import type { TurnoDTO } from "../types/turno/TurnoDTO";
import type { TurnoResponseDTO } from "../types/turno/TurnoResponseDTO";
import { BackendClient } from "./BackendClient";

export class TurnoService extends BackendClient<TurnoDTO, TurnoResponseDTO> {
  constructor() {
    const base =  "http://localhost:8080";
    super(`${base}/api/turnos`);
  }

  async getByClienteId(clienteId: number): Promise<TurnoResponseDTO[]> {
    const response = await fetch(`${this.baseUrl}/cliente/${clienteId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error("No se pudo obtener turnos del cliente");
    return await response.json();
  }

  async getByCentroId(centroId: number): Promise<TurnoResponseDTO[]> {
    const response = await fetch(`${this.baseUrl}/centro/${centroId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error("No se pudo obtener turnos del centro");
    return await response.json();
  }
}
