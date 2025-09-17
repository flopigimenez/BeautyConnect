import type { Rol } from "../enums/Rol";

export interface UsuarioDTO{
    mail: string;
    rol: Rol;
    uid: string;
}