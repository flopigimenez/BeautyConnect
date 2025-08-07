import type { UsuarioResponseDTO } from "../usuario/UsuarioResponseDTO";

export interface SuperAdminResponseDTO{
    id: number;
    nombre: string;
    telefono: number;
    usuario: UsuarioResponseDTO;

}