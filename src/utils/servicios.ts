const normalizarClaveServicio = (tipo: string | undefined | null) =>
  (tipo ?? "").trim().toLowerCase();

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
