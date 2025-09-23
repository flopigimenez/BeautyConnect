import { BackendClient } from "./BackendClient";
import type { ProfesionalDTO } from "../types/profesional/ProfesionalDTO";
import type { ProfesionalResponseDTO } from "../types/profesional/ProfesionalResponseDTO";
import { getAuth } from "firebase/auth";
export class ProfesionalService extends BackendClient<ProfesionalDTO, ProfesionalResponseDTO>   {
    constructor(){
        super("http://localhost:8080/api/profesional");

}
    async post(data: ProfesionalDTO): Promise<ProfesionalResponseDTO> {
        const res = await fetch(`${this.baseUrl}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("No se pudo crear el profesional");
        return (await res.json()) as ProfesionalResponseDTO;
    }

  async update(id: number, data: ProfesionalDTO): Promise<ProfesionalResponseDTO> {
    const url = `${this.baseUrl}/update/${id}`;
    const res = await fetch(url, {
      method: "POST", // <- tu backend usa POST /update
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el profesional");
    return (await res.json()) as ProfesionalResponseDTO;
  }

   async findByUid(uid: string): Promise<ProfesionalResponseDTO[]> {
    const res = await fetch(`${this.baseUrl}/por-uid/${uid}`);
    if (!res.ok) throw new Error(`Error ${res.status} al listar profesionales`);
    return res.json();
  }

  async createProfesional(dto: ProfesionalDTO): Promise<ProfesionalResponseDTO> {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken?.();
    const res = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error(`Error ${res.status} al crear profesional`);
    return res.json();
  }

}