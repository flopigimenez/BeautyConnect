import type { UsuarioResponseDTO } from "../usuario/UsuarioResponseDTO";

export interface PrestadorServicioResponseDTO {
    id: number;
    nombre: string;
    telefono: number;
    usuario: UsuarioResponseDTO;
}