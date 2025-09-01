import type { ServicioDTO } from "../types/servicio/ServicioDTO";
import type { ServicioResponseDTO } from "../types/servicio/ServicioResponseDTO";
import { BackendClient } from "./BackendClient";

export class ServicioService extends BackendClient<ServicioDTO, ServicioResponseDTO> {
  constructor() {
    super("http://localhost:8080/api/servicio");
  }

  // Algunos controladores usan /save y esperan la clave "CentroDeEstetica" con solo el id
  async create(
    data: Pick<ServicioDTO, "tipoDeServicio" | "duracion" | "precio">,
    centroId: number
  ): Promise<ServicioResponseDTO> {
    const body = {
      tipoDeServicio: data.tipoDeServicio,
      duracion: data.duracion,
      precio: data.precio,
      // Nombre de propiedad como en el Response (backend)
      CentroDeEstetica: { id: centroId },
    } as any;

    const res = await fetch(`${this.baseUrl}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(t || `Error HTTP ${res.status}`);
    }
    return (await res.json()) as ServicioResponseDTO;
  }
}
