import type { UsuarioDTO } from "../usuario/UsuarioDTO";

export interface PrestadorServicioDTO {
    nombre: string;
    apellido: string;
    telefono: number;
    usuario: UsuarioDTO;
}