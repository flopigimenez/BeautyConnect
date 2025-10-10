import type { ServicioDTO } from "../types/servicio/ServicioDTO";
import type { ServicioResponseDTO } from "../types/servicio/ServicioResponseDTO";
import { BackendClient } from "./BackendClient";
import { getAuth } from "firebase/auth";

export class ServicioService extends BackendClient<ServicioDTO, ServicioResponseDTO>{
    constructor(){
        super(`${import.meta.env.VITE_HOST_BACK}/api/servicio`);
    }
    async findByUid(uid: string): Promise<ServicioResponseDTO[]> {
    const res = await fetch(`${this.baseUrl}/por-uid/${uid}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include", // opcional si usás cookies/cors con credenciales
    });
    if (!res.ok) {
      throw new Error(`Error ${res.status} al obtener servicios`);
    }
    return res.json();
  }

    async createServicio(dto: ServicioDTO): Promise<ServicioResponseDTO> {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken?.();

    const res = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(dto),
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Error ${res.status} al crear servicio`);
    return res.json();
  }
  async obtenerporcentro(idCentro: number): Promise<ServicioResponseDTO[]> {
    const res = await fetch(`${this.baseUrl}/by-centro/${idCentro}`, {
      headers: { "Content-Type": "application/json" },    
      credentials: "include", // opcional si usás cookies/cors con credenciales
    });
    if (!res.ok) {
      throw new Error(`Error ${res.status} al obtener servicios`);
    }
    return res.json();
  }
 
    
   async deleteServicio(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el elemento con ID ${id}`);
    }
  }
  
  }