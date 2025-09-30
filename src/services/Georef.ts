// src/services/georef.ts
export type Provincia = { id: string; nombre: string };
export type Localidad = { id: string; nombre: string };

const BASE = "https://apis.datos.gob.ar/georef/api";

type ProvinciasResponse = {
  provincias?: Provincia[];
};

type LocalidadesResponse = {
  localidades?: Array<{ id: string | number; nombre: string }>;
};

export async function getProvincias(): Promise<Provincia[]> {
  const url = `${BASE}/provincias?campos=id,nombre&max=100`;
  const r = await fetch(url);
  const data: ProvinciasResponse = await r.json();
  return (data.provincias ?? []).sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export async function getLocalidadesByProvincia(provinciaNombre: string): Promise<Localidad[]> {
  const params = new URLSearchParams({
    provincia: provinciaNombre,
    campos: "id,nombre",
    max: "5000",
    orden: "nombre",
  });
  const r = await fetch(`${BASE}/localidades?${params.toString()}`);
  const data: LocalidadesResponse = await r.json();
  const localidades = data.localidades ?? [];
  return localidades.map((l) => ({ id: String(l.id), nombre: l.nombre }));
}
