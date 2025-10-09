import type { UsuarioResponseDTO } from "../usuario/UsuarioResponseDTO";

export interface ClienteResponseDTO {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    active: boolean;
    usuario: UsuarioResponseDTO;
}