

export class TurnosDispService {
getHorariosDisponibles(profId: number, servicioId: number, fecha: string, step = 10) {
  const base = import.meta.env.VITE_HOST_BACK;
  return fetch(`${base}/api/profesionales/${profId}/serviciosdispo/${servicioId}/disponibles?fecha=${fecha}&step=${step}`, {
    credentials: "include"
  }).then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json() as Promise<{ fecha: string; duracionMin: number; inicios: string[] }>;
  });
}
}