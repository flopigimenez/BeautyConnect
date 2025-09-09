import type { TipoDeServicio } from "../enums/TipoDeServicio";

export interface ServicioDTOSimple {
    id: number;
    tipoDeServicio: TipoDeServicio;
    precio: number; 
}
