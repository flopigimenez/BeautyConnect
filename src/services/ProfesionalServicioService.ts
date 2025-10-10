import type { ProfesionalServicioDTO } from "../types/profesionalServicio/ProfesionalServicioDTO";
import type { ProfesionalServicioResponseDTO } from "../types/profesionalServicio/ProfesionalServicioResponseDTO";
import { BackendClient } from "./BackendClient";

export class ProfesionalServicioService extends BackendClient<ProfesionalServicioDTO, ProfesionalServicioResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/prof-servicios");
    }

    async getAll(): Promise<ProfesionalServicioResponseDTO[]> {
        const res = await fetch(`${this.baseUrl}`, {
            credentials: "include",
        });
        if (!res.ok) {
            const errorText = await res.text().catch(() => "");
            throw new Error(errorText || "No se pudieron obtener las relaciones profesional-servicio");
        }
        return (await res.json()) as ProfesionalServicioResponseDTO[];
    }

    async post(data: ProfesionalServicioDTO): Promise<ProfesionalServicioResponseDTO> {
        // Verificar si ya existe una relación entre el profesional y el servicio
        const existingRelations = await this.getProfServicio(data.servicioId);
        const existingRelation = existingRelations.find(
            (rel) => rel.profesional?.id === data.profesionalId
        );

        if (existingRelation) {
            if (!existingRelation.active) {
                // Reactivar la relación si está desactivada
                return await this.cambiarEstado(existingRelation.id);
            } else {
                throw new Error("La relación entre el profesional y el servicio ya existe y está activa.");
            }
        }

        // Crear una nueva relación si no existe
        const res = await fetch(`${this.baseUrl}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorText = await res.text().catch(() => "");
            throw new Error(errorText || "No se pudo crear la relación profesional-servicio");
        }

        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            return (await res.json()) as ProfesionalServicioResponseDTO;
        }
        const raw = await res.text();
        if (raw) {
            try {
                return JSON.parse(raw) as ProfesionalServicioResponseDTO;
            } catch (error) {
                console.error("Error al parsear la respuesta de prof-servicios:", error);
            }
        }
        return (data as unknown) as ProfesionalServicioResponseDTO;
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
    async delete(id: number): Promise<void> {
        const res = await fetch(`${this.baseUrl}/cambiarEstado/${id}`, {
            method: "PATCH",
            credentials: "include",
        });
        if (!res.ok) {
            const errorText = await res.text().catch(() => "");
            throw new Error(errorText || `No se pudo desactivar la relación con ID ${id}`);
        }
    }
    
      async updateProfServicio(id: number, data: ProfesionalServicioDTO): Promise<ProfesionalServicioResponseDTO> {
        const url = `${this.baseUrl}/${id}`;
        const res = await fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("No se pudo actualizar el profesional");
        return (await res.json()) as ProfesionalServicioResponseDTO;
      }
      
      async eliminar(id: number): Promise<void> {
  const res = await fetch(`${this.baseUrl}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  // 204 = borrado OK sin body
  if (res.status === 204) return;

  // 404 = no encontrado (si tu service lanza EntityNotFoundException)
  if (res.status === 404) {
    throw new Error(`ProfesionalServicio no encontrado (id=${id})`);
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || "No se pudo eliminar la relación profesional-servicio");
  }
}
     
}
