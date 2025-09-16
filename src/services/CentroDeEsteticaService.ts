import type { CentroDeEsteticaDTO } from "../types/centroDeEstetica/CentroDeEsteticaDTO";
import type { Estado } from "../types/enums/Estado";
import type { CentroEsteticaResponseDTO } from "../types/centroDeEstetica/CentroDeEsteticaResponseDTO";
import { BackendClient } from "./BackendClient";
import type { ProfesionalDTO } from "../types/profesional/ProfesionalDTO";

export class CentroDeEsteticaService extends BackendClient<CentroDeEsteticaDTO, CentroEsteticaResponseDTO> {
    constructor() {
        super("http://localhost:8080/api/centrodeestetica");
    }

    async cambiarEstado(id: number, estado: Estado): Promise<CentroEsteticaResponseDTO> {
        const resp = await fetch(`${this.baseUrl}/cambiarEstado/centro/${id}/estado/${estado}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        });
        if (!resp.ok) throw new Error("No se pudo cambiar el estado");
        return await resp.json();
    }

     async listarPorEstado(estado: Estado): Promise<CentroEsteticaResponseDTO[]> {
        const resp = await fetch(`${this.baseUrl}/listarEstado/estado/${estado}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!resp.ok) throw new Error("No se pudo listar por estado");
        return await resp.json();
    }

    async getByPrestadorUid(uid: string): Promise<CentroEsteticaResponseDTO | null> {
    const res = await fetch(`${this.baseUrl}/by-prestador-uid/${uid}`);
    if (!res.ok) return null;
    return (await res.json()) as CentroEsteticaResponseDTO;
  }

  async create(data: CentroDeEsteticaDTO): Promise<CentroEsteticaResponseDTO> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("No se pudo crear el centro");
    return (await res.json()) as CentroEsteticaResponseDTO;
  }

  async update(id: number, data: CentroDeEsteticaDTO): Promise<CentroEsteticaResponseDTO> {
    const res = await fetch(`${this.baseUrl}/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el centro");
    return (await res.json()) as CentroEsteticaResponseDTO;
  }

  async agregarProfesional(centroId: number, data: ProfesionalDTO): Promise<CentroEsteticaResponseDTO> {
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
  async getByPrestadorId(prestadorId: number): Promise<CentroEsteticaResponseDTO | null> {
    const res = await fetch(`${this.baseUrl}/centro-prestador/${prestadorId}`);
    if (!res.ok) return null;
    return (await res.json()) as CentroEsteticaResponseDTO;
  }

  
}
