import type { Rol } from "../enums/Rol";

export interface UsuarioResponseDTO{
    id: number;
    mail: string;
    contrasenia: string;
    rol: Rol;
    uid: string;
}