import type { TipoDeServicio } from "../enums/TipoDeServicio";

export interface ServicioDTOSimple {
    tipoDeServicio: TipoDeServicio;
    precio: number; 
}
