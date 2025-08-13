import type { UsuarioDTO } from "../usuario/UsuarioDTO";

export interface ClienteDTO {
    nombre: string;
    apellido: string;
    telefono: number;
    usuario: UsuarioDTO;
}