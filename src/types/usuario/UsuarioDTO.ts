import type { Rol } from "../enums/Rol";

export interface UsuarioDTO{
    mail: string;
    contraseña: string;
    rol: Rol;
}