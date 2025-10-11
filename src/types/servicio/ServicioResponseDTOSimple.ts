import type { TipoDeServicio } from "../enums/TipoDeServicio";

export interface ServicioResponseDTOSimple {
    id: number;
    tipoDeServicio: TipoDeServicio;
    precio: number;
    descripcion: string;
    titulo: string;
}
