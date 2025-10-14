import { TipoDeServicio } from "../types/enums/TipoDeServicio";

// Función corregida
export const normalizarClaveServicio = (tipo: string | undefined | null) => {
  switch (tipo) {
    case TipoDeServicio.PELUQUERIA:
      return "Peluquería";
    case TipoDeServicio.MANICURA:
      return "Manicura";
    case TipoDeServicio.PEDICURA:
      return "Pedicura";
    case TipoDeServicio.LIMPIEZAFACIAL:
      return "Limpieza facial";
    case TipoDeServicio.MASAJES:
      return "Masajes";
    case TipoDeServicio.DEPILACION:
      return "Depilación";
    case TipoDeServicio.MAQUILLAJE:
      return "Maquillaje";
    case TipoDeServicio.BRONCEADO:
      return "Bronceado";
    case TipoDeServicio.BARBERIA:
      return "Barbería";
    default:
      return "";
  }
};

type ServicioConTipo = { tipoDeServicio?: string | null };

export const buildServiciosLabel = (servicios: ServicioConTipo[] | undefined | null) => {
  if (!servicios?.length) return "";

  const vistos = new Set<string>();
  const serviciosUnicos = servicios.filter((servicio) => {
    const clave = normalizarClaveServicio(servicio.tipoDeServicio);
    if (!clave || vistos.has(clave)) return false;
    vistos.add(clave);
    return true;
  });

  return serviciosUnicos.map((servicio) => normalizarClaveServicio(servicio.tipoDeServicio)).join(", ");
};
