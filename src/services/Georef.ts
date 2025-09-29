// src/services/georef.ts
export type Provincia = { id: string; nombre: string };
export type Localidad = { id: string; nombre: string };

const BASE = "https://apis.datos.gob.ar/georef/api";

export async function getProvincias(): Promise<Provincia[]> {
  const url = `${BASE}/provincias?campos=id,nombre&max=100`;
  const r = await fetch(url);
  const j = await r.json();
  return (j.provincias ?? []).sort((a: Provincia, b: Provincia) => a.nombre.localeCompare(b.nombre));
}

export async function getLocalidadesByProvincia(provinciaNombre: string): Promise<Localidad[]> {
  const params = new URLSearchParams({
    provincia: provinciaNombre,
    campos: "id,nombre",
    max: "5000",
    orden: "nombre"
  });
  const r = await fetch(`${BASE}/localidades?${params.toString()}`);
  const j = await r.json();
  return (j.localidades ?? []).map((l: any) => ({ id: l.id, nombre: l.nombre }));
}
