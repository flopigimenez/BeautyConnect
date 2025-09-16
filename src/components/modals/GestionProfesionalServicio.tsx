// src/components/modals/GestionProfesionalServicio.tsx
import { useEffect, useMemo, useState } from "react";
import type { ProfesionalResponseDTO } from "../../types/profesional/ProfesionalResponseDTO";
import type { ServicioResponseDTO } from "../../types/servicio/ServicioResponseDTO";
import type { ProfesionalServicioDTO } from "../../types/profesionalServicio/ProfesionalServicioDTO";
import type { ProfesionalServicioResponseDTO } from "../../types/profesionalServicio/ProfesionalServicioResponseDTO";
import { ProfesionalServicioService } from "../../services/ProfesionalServicioService";
type Props = {
  profesional: ProfesionalResponseDTO;
  onClose?: () => void;
};
  const profesionalServicioService = new ProfesionalServicioService();

export default function GestionProfesionalServicio({ profesional, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [servicios, setServicios] = useState<ServicioResponseDTO[]>([]);
  const [relacion, setRelacion] = useState<Record<number, { // por servicioId
    id?: number; // id de la relación si existe
    duracion: number;
    configured: boolean;
    saving?: boolean;
  }>>({});


  const titulo = useMemo(
    () => `Servicios · ${profesional.nombre} ${profesional.apellido}`,
    [profesional]
  );

  const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8080";
  async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      ...init,
    });
    if (!res.ok) throw new Error((await res.text()) || `Error ${res.status}`);
    return res.json();
  }
  const listarServicios = () => api<ServicioResponseDTO[]>("/api/servicio");
  
  const crearRelacion = (dto: ProfesionalServicioDTO) =>
    api<ProfesionalServicioResponseDTO>(`/api/prof-servicios`, { method: "POST", body: JSON.stringify(dto) });
  const eliminarRelacion = (id: number) =>
    api<void>(`/api/prof-servicios/${id}`, { method: "DELETE" });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const s = await listarServicios();
        setServicios(s);
        const relDraft: Record<number, { duracion: number; configured: boolean }> = {};
        for (const sv of s) relDraft[sv.id] = { duracion: 30, configured: false };
        setRelacion(relDraft);
        // intentar cargar configuración existente por servicio
        for (const sv of s) {
          try {
            const existing = await profesionalServicioService.getByProfesionalAndServicio(profesional.id, sv.id);
            if (existing) {
              setRelacion((prev) => ({
                ...prev,
                [sv.id]: { id: existing.id, duracion: existing.duracion ?? 30, configured: true },
              }));
            }
          } catch {
            // no existe relación
          }
        }
      } catch (e: any) {
        setError(e?.message ?? "Error al cargar servicios");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [profesional.id]);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Contenido */}
      <div className="fixed inset-0 z-50 grid place-items-center p-4" onClick={onClose}>
        <div className="w-[720px] max-w-[95vw] rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-xl font-secondary text-[#703F52] mb-4">{titulo}</h2>

          {loading && <p>Cargando servicios...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                <thead className="bg-[#FFFBFA]">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-left">Servicio</th>
                    <th className="px-4 py-2 text-left">Precio</th>
                    <th className="px-4 py-2 text-left">Duración (min)</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {servicios.map((s) => {
                    const r = relacion[s.id] || { duracion: 30, configured: false };
                    const saving = r.saving;
                    return (
                      <tr key={s.id} className="border-t border-gray-200">
                        <td className="px-4 py-2">{String(s.tipoDeServicio)}</td>
                        <td className="px-4 py-2">${s.precio}</td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min={5}
                            step={5}
                            value={r.duracion}
                            onChange={(e) => setRelacion((prev) => ({ ...prev, [s.id]: { ...prev[s.id], duracion: Number(e.target.value), configured: prev[s.id]?.configured ?? false } }))}
                            className="w-24 border p-1 rounded-full"
                          />
                        </td>
                        <td className="px-4 py-2">
                          {r.configured ? (
                            <span className="text-green-700">Configurado</span>
                          ) : (
                            <span className="text-gray-500">Sin configurar</span>
                          )}
                        </td>
                        <td className="px-4 py-2 space-x-2">
                          <button
                            className="rounded-full bg-[#C19BA8] px-3 py-1 text-sm text-white hover:bg-[#b78fa0] disabled:opacity-50"
                            disabled={saving}
                            onClick={async () => {
                              try {
                                setRelacion((prev) => ({ ...prev, [s.id]: { ...prev[s.id], saving: true } as any }));
                                const dto: ProfesionalServicioDTO = {
                                  id: 0,
                                  profesionalId: profesional.id,
                                  servicioId: s.id,
                                  duracion: r.duracion || 30,
                                  disponibilidades: [],
                                };
                                const created = await crearRelacion(dto);
                                setRelacion((prev) => ({ ...prev, [s.id]: { id: created.id, duracion: created.duracion ?? dto.duracion, configured: true } }));
                              } catch (e: any) {
                                alert(e?.message ?? "Error al guardar relación");
                              } finally {
                                setRelacion((prev) => ({ ...prev, [s.id]: { ...prev[s.id], saving: false } as any }));
                              }
                            }}
                          >
                            {r.configured ? "Guardar" : "+ Crear"}
                          </button>
                          {r.configured && r.id && (
                            <button
                              className="px-3 py-1 text-sm rounded-full border hover:bg-gray-100 disabled:opacity-50"
                              disabled={saving}
                              onClick={async () => {
                                if (!confirm("¿Desvincular servicio de este profesional?")) return;
                                try {
                                  setRelacion((prev) => ({ ...prev, [s.id]: { ...prev[s.id], saving: true } as any }));
                                  await eliminarRelacion(r.id!);
                                  setRelacion((prev) => ({ ...prev, [s.id]: { duracion: 30, configured: false } }));
                                } catch (e: any) {
                                  alert(e?.message ?? "Error al eliminar relación");
                                } finally {
                                  setRelacion((prev) => ({ ...prev, [s.id]: { ...prev[s.id], saving: false } as any }));
                                }
                              }}
                            >
                              Desvincular
                            </button>
                          )}

                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button className="px-4 py-1 text-sm rounded-full border hover:bg-gray-100" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
