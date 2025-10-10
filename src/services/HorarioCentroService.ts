import type { HorarioCentroDTO } from "../types/horarioCentro/HorarioCentroDTO";
import type { HorarioCentroResponseDTO } from "../types/horarioCentro/HorarioCentroResponseDTO";
import { BackendClient } from "./BackendClient";

export class HorarioCentroService extends BackendClient<HorarioCentroDTO, HorarioCentroResponseDTO> {
  constructor() {
    super(`${import.meta.env.VITE_HOST_BACK}/api/horariocentro`);
  }

  async updateHorarioCentro(id: number, data: HorarioCentroDTO): Promise<HorarioCentroResponseDTO> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    return response.json();
  }

  async createHorarioCentro(centroId: number, data: HorarioCentroDTO): Promise<HorarioCentroResponseDTO> {
    const response = await fetch(`${this.baseUrl}/centro/${centroId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    return response.json();
  }
}
