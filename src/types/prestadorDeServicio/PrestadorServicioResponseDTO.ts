import type { UsuarioResponseDTO } from "../usuario/UsuarioResponseDTO";

export interface PrestadorServicioResponseDTO {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    usuario: UsuarioResponseDTO;
    active: boolean;
}