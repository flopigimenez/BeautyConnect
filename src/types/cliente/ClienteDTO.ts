import type { DomicilioDTO } from "../domicilio/DomicilioDTO";
import type { UsuarioDTO } from "../usuario/UsuarioDTO";

export interface ClienteDTO {
    nombre: string;
    apellido: string;
    telefono: string;
    domicilio: DomicilioDTO;
    usuario: UsuarioDTO;   
}