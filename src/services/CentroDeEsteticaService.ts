import type { CentroDeEsteticaDTO } from "../types/centroDeEstetica/CentroDeEsteticaDTO";
import type { CentroEsteticaResponseDTO } from "../types/centroDeEstetica/CentroEsteticaResponseDTO";
import { BackendClient } from "./BackendClient";
import type { ProfesionalDTO } from "../types/profesional/ProfesionalDTO";

export class CentroDeEsteticaService extends BackendClient<CentroDeEsteticaDTO, CentroEsteticaResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/centrodeestetica");
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

  
}
