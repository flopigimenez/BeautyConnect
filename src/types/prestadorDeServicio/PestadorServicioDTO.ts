import type { UsuarioDTO } from "../usuario/UsuarioDTO";

export interface PrestadorServicioDTO {
    nombre: string;
    telefono: number;
    usuario: UsuarioDTO;
}