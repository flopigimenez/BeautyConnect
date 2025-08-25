import type { Rol } from "../enums/Rol";

export interface UsuarioResponseDTO{
    id: number;
    mail: string;
    contraseña: string;
    rol: Rol;
    activo: boolean;
}