import type { UsuarioDTO } from "../usuario/UsuarioDTO";

export interface ClienteDTO {
    nombre: string;
    telefono: number;
    usuario: UsuarioDTO;
}