import type { ProfesionalServicioDTO } from "../types/profesionalServicio/ProfesionalServicioDTO";
import type { ProfesionalServicioResponseDTO } from "../types/profesionalServicio/ProfesionalServicioResponseDTO";
import { BackendClient } from "./BackendClient";

export class ProfesionalServicioService extends BackendClient<ProfesionalServicioDTO, ProfesionalServicioResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/prof-servicios");
    }

    // async getByProfesionalServicio(profId: number, servicioId: number): Promise<ProfesionalServicioResponseDTO> {
    //     const res = await fetch(`${this.baseUrl}/disponibles/prof/${profId}/servicio/${servicioId}`);
    //     if (!res.ok) throw new Error("No se pudo obtener la disponibilidad");
    //     return await res.json();
    // }

    async getProfServicio(servicioId: number): Promise<ProfesionalServicioResponseDTO[]> {
        const res = await fetch(`${this.baseUrl}/getProfServicio/${servicioId}`);
        if (!res.ok) throw new Error("No se pudo obtener los profesionales que brindan el servicio");
        return await res.json();
    }
    async getByProfesionalAndServicio(profId: number, servicioId: number): Promise<ProfesionalServicioResponseDTO> {
        const res = await fetch(`${this.baseUrl}/${profId}/servicios/${servicioId}`);
        if (!res.ok) throw new Error("No se pudo obtener la disponibilidad");
        return await res.json();
    }
    async cambiarEstado(id: number): Promise<ProfesionalServicioResponseDTO> {
        const resp = await fetch(`${this.baseUrl}/cambiarEstado/${id}`, {
            method: "PATCH"
        });
        if (!resp.ok) throw new Error("No se pudo cambiar el estado");
        return await resp.json();
    }
}