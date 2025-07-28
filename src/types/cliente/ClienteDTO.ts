import type { UsuarioDTO } from "../usuario/UsuarioDTO";

export interface ClienteDTO {
    id: number;
    nombre: string;
    apellido: string;
    telefono: number;
    usuario: UsuarioDTO;
    }