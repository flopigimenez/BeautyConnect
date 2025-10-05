import type { CentroDeEsteticaDTO } from "../types/centroDeEstetica/CentroDeEsteticaDTO";
import type { Estado } from "../types/enums/Estado";
import type { CentroDeEsteticaResponseDTO } from "../types/centroDeEstetica/CentroDeEsteticaResponseDTO";
import { BackendClient } from "./BackendClient";
import type { ProfesionalDTO } from "../types/profesional/ProfesionalDTO";

export class CentroDeEsteticaService extends BackendClient<CentroDeEsteticaDTO, CentroDeEsteticaResponseDTO> {
  constructor() {
    super("http://localhost:8080/api/centrodeestetica");
  }

  async cambiarEstado(id: number, estado: Estado): Promise<CentroDeEsteticaResponseDTO> {
    const resp = await fetch(`${this.baseUrl}/cambiarEstado/centro/${id}/estado/${estado}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    });
    if (!resp.ok) throw new Error("No se pudo cambiar el estado");
    return await resp.json();
  }

  async listarPorEstado(estado: Estado): Promise<CentroDeEsteticaResponseDTO[]> {
    const resp = await fetch(`${this.baseUrl}/listarEstado/estado/${estado}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) throw new Error("No se pudo listar por estado");
    return await resp.json();
  }

  async listarPorEstadoyActive(estado: Estado, active: boolean): Promise<CentroDeEsteticaResponseDTO[]> {
    const resp = await fetch(`${this.baseUrl}/listarEstado/estado/${estado}/activo/${active}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) throw new Error("No se pudo listar por estado");
    return await resp.json();
  }

  async create(data: CentroDeEsteticaDTO): Promise<CentroDeEsteticaResponseDTO> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("No se pudo crear el centro");
    return (await res.json()) as CentroDeEsteticaResponseDTO;
  }

  async update(id: number, data: CentroDeEsteticaDTO): Promise<CentroDeEsteticaResponseDTO> {
    const res = await fetch(`${this.baseUrl}/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el centro");
    return (await res.json()) as CentroDeEsteticaResponseDTO;
  }

  async agregarProfesional(centroId: number, data: ProfesionalDTO): Promise<CentroDeEsteticaResponseDTO> {
    const res = await fetch(`${this.baseUrl}/${centroId}/profesionales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al guardar profesional");
    return res.json();
  }

  async getMiCentroId(uid: string): Promise<number> {
    const res = await fetch(`${this.baseUrl}/mi-centro-id/${uid}`);
    if (!res.ok) throw new Error("No se pudo obtener el centro");
    const data = await res.json(); // { id: number }
    return data.id;
  }

  async getByPrestadorId(prestadorId: number): Promise<CentroDeEsteticaResponseDTO | null> {
    const res = await fetch(`${this.baseUrl}/centro-prestador/${prestadorId}`);
    if (!res.ok) return null;
    return (await res.json()) as CentroDeEsteticaResponseDTO;
  }

  async activar_desactivar(id: number): Promise<CentroDeEsteticaResponseDTO> {
    const res = await fetch(`${this.baseUrl}/activar_desactivar/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("No se pudo cambiar el estado del centro");
    return (await res.json()) as CentroDeEsteticaResponseDTO;
  }


}
