export interface ClienteResponseDTO {
    id: number;
    nombre: string;
    apellido: string;
    telefono: number;
    usuario: UsuarioResponseDTO;
}