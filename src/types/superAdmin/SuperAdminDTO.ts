import type { UsuarioDTO } from "../usuario/UsuarioDTO";

export interface SuperAdminDTO{
    id: number;
    nombre: string;
    telefono: number;
    usuario: UsuarioDTO;
}