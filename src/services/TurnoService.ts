import type { EstadoTurno } from "../types/enums/EstadoTurno";
import type { TurnoDTO } from "../types/turno/TurnoDTO";
import type { TurnoResponseDTO } from "../types/turno/TurnoResponseDTO";
import { BackendClient } from "./BackendClient";

export class TurnoService extends BackendClient<TurnoDTO, TurnoResponseDTO> {
  constructor() {
    super(`${import.meta.env.VITE_HOST_BACK}/api/turnos`);
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

  async cambiarEstado(id: number, estado: EstadoTurno): Promise<TurnoResponseDTO> {
    const resp = await fetch(`${this.baseUrl}/${id}/estado/${estado}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    });
    if (!resp.ok) throw new Error("No se pudo cambiar el estado");
    return await resp.json();
  }

  async contarPorFecha(fecha: Date, id: number): Promise<number> {
    const response = await fetch(`${this.baseUrl}/centro/${id}/fecha/${fecha.toISOString().split("T")[0]}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error("Error al obtener cantidad de turnos por semana");
    }
    return await response.json();
  }

  async contarPorSemana(fecha: Date, id: number): Promise<number> {
    const response = await fetch(`${this.baseUrl}/centro/${id}/semana/${fecha.toISOString().split("T")[0]}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error("Error al obtener cantidad de turnos por semana");
    }
    return await response.json();
  }

}
