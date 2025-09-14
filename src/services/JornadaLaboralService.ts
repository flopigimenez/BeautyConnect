import type { JornadaLaboralCreateDTO } from "../types/jornadaLaboral/JornadaLaboralCreateDTO";
import type { JornadaLaboralResponseDTO } from "../types/jornadaLaboral/JornadaLaboralResponseDTO";
import type { JornadaLaboralUpdateDTO } from "../types/jornadaLaboral/JornadaLaboralUpdateDTO";

export class JornadaLaboralService {
  base = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

  async create(dto: JornadaLaboralCreateDTO): Promise<JornadaLaboralResponseDTO> {
    const r = await fetch(`${this.base}/api/jornadas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dto),
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  async bulkCreate(dtos: JornadaLaboralCreateDTO[]): Promise<JornadaLaboralResponseDTO[]> {
    const r = await fetch(`${this.base}/api/jornadas/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dtos),
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  async listByProfesional(profesionalId: number): Promise<JornadaLaboralResponseDTO[]> {
    const r = await fetch(`${this.base}/api/jornadas/profesional/${profesionalId}`, { credentials: "include" });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  async listByProfesionalAndDia(profesionalId: number, dia: JornadaLaboralCreateDTO["dia"]) {
    const r = await fetch(`${this.base}/api/jornadas/profesional/${profesionalId}/dia/${dia}`, { credentials: "include" });
    if (!r.ok) throw new Error(await r.text());
    return r.json() as Promise<JornadaLaboralResponseDTO[]>;
  }

  async update(id: number, dto: JornadaLaboralUpdateDTO): Promise<JornadaLaboralResponseDTO> {
    const r = await fetch(`${this.base}/api/jornadas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dto),
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  async toggleActivo(id: number, activo: boolean): Promise<JornadaLaboralResponseDTO> {
    const r = await fetch(`${this.base}/api/jornadas/${id}/activo?activo=${activo}`, {
      method: "PATCH",
      credentials: "include",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  async delete(id: number): Promise<void> {
    const r = await fetch(`${this.base}/api/jornadas/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!r.ok) throw new Error(await r.text());
  }
}