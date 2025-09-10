import type { Rol } from "../enums/Rol";

export interface UsuarioDTO{
    mail: string;
    contrasenia: string;
    rol: Rol;
    uid: string;
}