import type { UsuarioDTO } from "../usuario/UsuarioDTO";

export interface PrestadorServicioDTO {
    id: number;
    nombre: string;
    telefono: number;
    usuario: UsuarioDTO;
}