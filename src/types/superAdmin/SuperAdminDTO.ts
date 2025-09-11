import type { UsuarioDTO } from "../usuario/UsuarioDTO";

export interface SuperAdminDTO{
    nombre: string;
    apellido: string;
    telefono: string;
    usuario: UsuarioDTO;
}