import type { UsuarioResponseDTO } from "../usuario/UsuarioResponseDTO";

export interface SuperAdminResponseDTO{
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    usuario: UsuarioResponseDTO;

}