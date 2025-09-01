import type { UsuarioDTO } from "../usuario/UsuarioDTO";

export interface SuperAdminDTO{
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    usuario: UsuarioDTO;
}