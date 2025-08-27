import type { ClienteDTO } from "../types/cliente/ClienteDTO";
import type { ClienteResponseDTO } from "../types/cliente/ClienteResponseDTO";
import { BackendClient } from "./BackendClient";
const API = "http://localhost:8080/api/cliente";
export class ClienteService extends BackendClient<ClienteDTO, ClienteResponseDTO>{
    
    constructor(){
        super("http://localhost:8080/api/cliente");
    }
     async getByUid(uid: string): Promise<ClienteResponseDTO | null> {
    const res = await fetch(`${this.baseUrl}/by-uid/${uid}`);
    if (!res.ok) return null;
    return await res.json();
  }
   async update(id: number, data: ClienteDTO): Promise<ClienteResponseDTO> {
    const res = await fetch(`${API}/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  }

  async create(data: ClienteDTO): Promise<ClienteResponseDTO> {
    const res = await fetch(`${API}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  }
  
}