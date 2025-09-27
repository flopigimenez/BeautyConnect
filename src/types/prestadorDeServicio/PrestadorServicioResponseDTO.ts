import type { DomicilioResponseDTO } from "../domicilio/DomicilioResponseDTO";
import type { UsuarioResponseDTO } from "../usuario/UsuarioResponseDTO";

export interface PrestadorServicioResponseDTO {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    active: boolean;
    domicilio?: DomicilioResponseDTO;
    usuario: UsuarioResponseDTO;   
}