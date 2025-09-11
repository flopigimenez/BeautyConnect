import type { UsuarioDTO } from "../types/usuario/UsuarioDTO";
import type { UsuarioResponseDTO } from "../types/usuario/UsuarioResponseDTO";
import { BackendClient } from "./BackendClient";
export class UsuarioService extends BackendClient<UsuarioDTO, UsuarioResponseDTO> {
    constructor() {
        super("http://localhost:8080/api/usuario");
    }

    async verificarPorUid(uid: string): Promise<boolean> {
        const res = await fetch(`${this.baseUrl}/existePorUid/${uid}`);
        if (!res.ok) throw new Error("No se pudo obtener el usuario");
        return await res.json();
    }

    async obtenerPorEmail(mail: string): Promise<UsuarioResponseDTO> {
        const res = await fetch(`${this.baseUrl}/obtenerPorEmail/${mail}`);
        if (!res.ok) throw new Error("No se pudo obtener el usuario");
        return await res.json();
    }
}