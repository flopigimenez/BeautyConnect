// src/components/modals/GestionJornadaLaboral.tsx
import { useEffect, useMemo, useState } from "react";
import type { ProfesionalResponseDTO } from "../../types/profesional/ProfesionalResponseDTO";
import type { JornadaLaboralResponseDTO } from "../../types/jornadaLaboral/JornadaLaboralResponseDTO";
import type { JornadaLaboralCreateDTO } from "../../types/jornadaLaboral/JornadaLaboralCreateDTO";
import type { JornadaLaboralUpdateDTO } from "../../types/jornadaLaboral/JornadaLaboralUpdateDTO";
import { JornadaLaboralService } from "../../services/JornadaLaboralService";

type Props = {
  profesional: ProfesionalResponseDTO;
  onClose?: () => void;
};

const servicio = new JornadaLaboralService();

const DIAS: { key: JornadaLaboralCreateDTO["dia"]; label: string }[] = [
  { key: "MONDAY", label: "Lunes" },
  { key: "TUESDAY", label: "Martes" },
  { key: "WEDNESDAY", label: "Miércoles" },
  { key: "THURSDAY", label: "Jueves" },
  { key: "FRIDAY", label: "Viernes" },
  { key: "SATURDAY", label: "Sábado" },
  { key: "SUNDAY", label: "Domingo" },
];

function toTimeInput(value?: string) {
  if (!value) return "";
  // Acepta "HH:mm" o "HH:mm:ss" -> devolver "HH:mm"
  return value.slice(0, 5);
}

export default function GestionJornadaLaboral({ profesional, onClose }: Props) {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<
    Record<
      JornadaLaboralCreateDTO["dia"],
      {
        current?: JornadaLaboralResponseDTO; // registro existente si hay
        horaInicio: string; // HH:mm
        horaFin: string; // HH:mm
        activo: boolean;
        saving?: boolean;
      }
    >
  >({
    MONDAY: { horaInicio: "", horaFin: "", activo: true },
    TUESDAY: { horaInicio: "", horaFin: "", activo: true },
    WEDNESDAY: { horaInicio: "", horaFin: "", activo: true },
    THURSDAY: { horaInicio: "", horaFin: "", activo: true },
    FRIDAY: { horaInicio: "", horaFin: "", activo: true },
    SATURDAY: { horaInicio: "", horaFin: "", activo: true },
    SUNDAY: { horaInicio: "", horaFin: "", activo: true },
  });

  // Nota: en este modal ya no se gestiona Profesional-Servicio

  // Bloquear scroll mientras el modal está abierto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setCargando(true);
        const data = await servicio.listByProfesional(profesional.id);
        setRows((prev) => {
          const draft = { ...prev };
          for (const d of data) {
            draft[d.dia] = {
              current: d,
              horaInicio: toTimeInput(d.horaInicio),
              horaFin: toTimeInput(d.horaFin),
              activo: d.activo,
            };
          }
          return draft;
        });

        // No más carga de servicios aquí
      } catch (e: any) {
        setError(e?.message ?? "Error al cargar jornadas laborales");
      } finally {
        setCargando(false);
      }
    };
    load();
  }, [profesional.id]);

  const titulo = useMemo(
    () => `Jornada laboral · ${profesional.nombre} ${profesional.apellido}`,
    [profesional]
  );

  const handleChange = (
    dia: JornadaLaboralCreateDTO["dia"],
    field: "horaInicio" | "horaFin" | "activo",
    value: string | boolean
  ) => {
    setRows((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [field]: value as any,
      },
    }));
  };

  const saveRow = async (dia: JornadaLaboralCreateDTO["dia"]) => {
    const row = rows[dia];
    if (!row.horaInicio || !row.horaFin) {
      alert("Debe completar hora de inicio y fin");
      return;
    }
    try {
      setRows((prev) => ({ ...prev, [dia]: { ...prev[dia], saving: true } }));
      if (row.current) {
        const dto: JornadaLaboralUpdateDTO = {
          dia,
          horaInicio: row.horaInicio,
          horaFin: row.horaFin,
          activo: row.activo,
        };
        const updated = await servicio.update(row.current.id, dto);
        setRows((prev) => ({
          ...prev,
          [dia]: {
            current: updated,
            horaInicio: toTimeInput(updated.horaInicio),
            horaFin: toTimeInput(updated.horaFin),
            activo: updated.activo,
          },
        }));
      } else {
        const dto: JornadaLaboralCreateDTO = {
          profesionalId: profesional.id,
          dia,
          horaInicio: row.horaInicio,
          horaFin: row.horaFin,
          activo: row.activo,
        };
        const created = await servicio.create(dto);
        setRows((prev) => ({
          ...prev,
          [dia]: {
            current: created,
            horaInicio: toTimeInput(created.horaInicio),
            horaFin: toTimeInput(created.horaFin),
            activo: created.activo,
          },
        }));
      }
    } catch (e: any) {
      alert(e?.message ?? "Error al guardar jornada");
    } finally {
      setRows((prev) => ({ ...prev, [dia]: { ...prev[dia], saving: false } }));
    }
  };

  const toggleActivo = async (dia: JornadaLaboralCreateDTO["dia"], value: boolean) => {
    const row = rows[dia];
    // Si aún no existe el registro, solo actualizar estado local
    if (!row.current) {
      handleChange(dia, "activo", value);
      return;
    }
    try {
      setRows((prev) => ({ ...prev, [dia]: { ...prev[dia], saving: true } }));
      const updated = await servicio.toggleActivo(row.current.id, value);
      setRows((prev) => ({
        ...prev,
        [dia]: {
          current: updated,
          horaInicio: toTimeInput(updated.horaInicio),
          horaFin: toTimeInput(updated.horaFin),
          activo: updated.activo,
        },
      }));
    } catch (e: any) {
      alert(e?.message ?? "Error al cambiar estado");
    } finally {
      setRows((prev) => ({ ...prev, [dia]: { ...prev[dia], saving: false } }));
    }
  };

  const borrar = async (dia: JornadaLaboralCreateDTO["dia"]) => {
    const row = rows[dia];
    if (!row.current) {
      // limpiar campos locales
      setRows((prev) => ({
        ...prev,
        [dia]: { horaInicio: "", horaFin: "", activo: true },
      }));
      return;
    }
    if (!confirm("¿Eliminar jornada de este día?")) return;
    try {
      setRows((prev) => ({ ...prev, [dia]: { ...prev[dia], saving: true } }));
      await servicio.delete(row.current.id);
      setRows((prev) => ({
        ...prev,
        [dia]: { horaInicio: "", horaFin: "", activo: true },
      }));
    } catch (e: any) {
      alert(e?.message ?? "Error al eliminar jornada");
    } finally {
      setRows((prev) => ({ ...prev, [dia]: { ...prev[dia], saving: false } }));
    }
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Contenido */}
      <div className="fixed inset-0 z-50 grid place-items-center p-4" onClick={onClose}>
        <div className="w-[720px] max-w-[95vw] rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-xl font-secondary text-[#703F52] mb-4">{titulo}</h2>

          {cargando && <p>Cargando datos...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {/* Sección de servicios removida de este modal */}

          {!cargando && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-[#FFFBFA]">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-left font-primary">Día</th>
                    <th className="px-4 py-2 text-left font-primary">Inicio</th>
                    <th className="px-4 py-2 text-left font-primary">Fin</th>
                    <th className="px-4 py-2 text-left font-primary">Activo</th>
                    <th className="px-4 py-2 text-left font-primary">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {DIAS.map(({ key, label }) => {
                    const row = rows[key];
                    const saving = row?.saving;
                    return (
                      <tr key={key} className="border-t border-gray-200">
                        <td className="px-4 py-2 font-primary">{label}</td>
                        <td className="px-4 py-2 font-primary">
                          <input
                            type="time"
                            value={row?.horaInicio ?? ""}
                            onChange={(e) => handleChange(key, "horaInicio", e.target.value)}
                            className="border p-2 rounded-full"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="time"
                            value={row?.horaFin ?? ""}
                            onChange={(e) => handleChange(key, "horaFin", e.target.value)}
                            className="border p-2 rounded-full"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#C19BA8]"
                            checked={!!row?.activo}
                            onChange={(e) => toggleActivo(key, e.target.checked)}
                          />
                        </td>
                        <td className="px-4 py-2 space-x-2">
                          <button
                            className="rounded-full bg-[#C19BA8] px-3 py-1 text-sm text-white hover:bg-[#b78fa0] disabled:opacity-50"
                            disabled={saving}
                            onClick={() => saveRow(key)}
                          >
                            {saving ? "Guardando..." : row?.current ? "Actualizar" : "Crear"}
                          </button>
                          <button
                            className="px-3 py-1 text-sm rounded-full border hover:bg-gray-100 disabled:opacity-50"
                            disabled={saving || !row}
                            onClick={() => borrar(key)}
                          >
                            Borrar
                          </button>
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
