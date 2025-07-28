import type { UsuarioDTO } from "../types/usuario/UsuarioDTO";
import type { UsuarioResponseDTO } from "../types/usuario/UsuarioResponseDTO";
import { BackendClient } from "./BackendClient";
export class UsuarioService extends BackendClient< UsuarioDTO, UsuarioResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/prestadordeservicio");
    }
}