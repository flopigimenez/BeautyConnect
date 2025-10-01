import type { Rol } from "../enums/Rol";

export interface UsuarioResponseDTO{
    id: number;
    mail: string;
    rol: Rol;
    uid: string;
}