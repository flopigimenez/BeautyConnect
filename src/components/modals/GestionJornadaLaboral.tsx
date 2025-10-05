import { useEffect, useMemo, useState } from "react";
import type { ProfesionalResponseDTO } from "../../types/profesional/ProfesionalResponseDTO";
import type { JornadaLaboralResponseDTO } from "../../types/jornadaLaboral/JornadaLaboralResponseDTO";
import type { JornadaLaboralCreateDTO } from "../../types/jornadaLaboral/JornadaLaboralCreateDTO";
import type { JornadaLaboralUpdateDTO } from "../../types/jornadaLaboral/JornadaLaboralUpdateDTO";
import Swal from "sweetalert2";
import { JornadaLaboralService } from "../../services/JornadaLaboralService";

type Props = {
  profesional: ProfesionalResponseDTO;
  onClose?: () => void;
};

const servicio = new JornadaLaboralService();

const DIAS: { key: JornadaLaboralCreateDTO["dia"]; label: string }[] = [
  { key: "MONDAY", label: "Lunes" },
  { key: "TUESDAY", label: "Martes" },
  { key: "WEDNESDAY", label: "Miercoles" },
  { key: "THURSDAY", label: "Jueves" },
  { key: "FRIDAY", label: "Viernes" },
  { key: "SATURDAY", label: "Sabado" },
  { key: "SUNDAY", label: "Domingo" },
];

function toTimeInput(value?: string) {
  if (!value) return "";
  return value.slice(0, 5);
}

function formatRange(start?: string, end?: string) {
  if (!start || !end) return "";
  return `${start} - ${end}`;
}

export default function GestionJornadaLaboral({ profesional, onClose }: Props) {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<
    Record<
      JornadaLaboralCreateDTO["dia"],
      {
        current?: JornadaLaboralResponseDTO;
        horaInicio: string;
        horaFin: string;
        activo: boolean;
        saving?: boolean;
      }
    >
  >({
    MONDAY: { horaInicio: "", horaFin: "", activo: false },
    TUESDAY: { horaInicio: "", horaFin: "", activo: false },
    WEDNESDAY: { horaInicio: "", horaFin: "", activo: false },
    THURSDAY: { horaInicio: "", horaFin: "", activo: false },
    FRIDAY: { horaInicio: "", horaFin: "", activo: false },
    SATURDAY: { horaInicio: "", horaFin: "", activo: false },
    SUNDAY: { horaInicio: "", horaFin: "", activo: false },
  });

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
      } catch (e: unknown) {
        setError((e as Error).message ?? "Error al cargar jornadas laborales");
      } finally {
        setCargando(false);
      }
    };
    load();
  }, [profesional.id]);

  const titulo = useMemo(
    () => `Jornada laboral - ${profesional.nombre} ${profesional.apellido}`,
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
        [field]: value as unknown,
      },
    }));
  };

  const saveRow = async (dia: JornadaLaboralCreateDTO["dia"]) => {
    const row = rows[dia];
    if (!row.horaInicio || !row.horaFin) {
      await Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Debes completar hora de inicio y fin",
        confirmButtonColor: "#703F52",
      });
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
    } catch (e: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: (e as Error).message ?? "Error al guardar jornada",
        confirmButtonColor: "#703F52",
      });
    } finally {
      setRows((prev) => ({ ...prev, [dia]: { ...prev[dia], saving: false } }));
    }
  };

  const toggleActivo = async (dia: JornadaLaboralCreateDTO["dia"], value: boolean) => {
    const row = rows[dia];
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
    } catch (e: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: (e as Error).message ?? "Error al cambiar estado",
        confirmButtonColor: "#703F52",
      });
    } finally {
      setRows((prev) => ({ ...prev, [dia]: { ...prev[dia], saving: false } }));
    }
  };

  const borrar = async (dia: JornadaLaboralCreateDTO["dia"]) => {
    const row = rows[dia];
    if (!row.current) {
      setRows((prev) => ({
        ...prev,
        [dia]: { horaInicio: "", horaFin: "", activo: false },
      }));
      return;
    }
    const confirmation = await Swal.fire({
      icon: "warning",
      title: "Eliminar jornada",
      text: "\u00bfQuer\u00e9s eliminar el horario de este d\u00eda?",
      showCancelButton: true,
      confirmButtonText: "S\u00ed, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#703F52",
      cancelButtonColor: "#C19BA8",
    });
    if (!confirmation.isConfirmed) {
      return;
    }
    try {
      setRows((prev) => ({ ...prev, [dia]: { ...prev[dia], saving: true } }));
      await servicio.delete(row.current.id);
      setRows((prev) => ({
        ...prev,
        [dia]: { horaInicio: "", horaFin: "", activo: false },
      }));
    } catch (e: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: (e as Error).message ?? "Error al eliminar jornada",
        confirmButtonColor: "#703F52",
      });
    } finally {
      setRows((prev) => ({ ...prev, [dia]: { ...prev[dia], saving: false } }));
    }
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-50 grid place-items-center p-4" onClick={onClose}>
        <div className="w-[780px] max-w-[95vw] rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-xl font-secondary text-[#703F52] mb-2">{titulo}</h2>
          <p className="text-sm text-gray-600 mb-4">Cada tarjeta resume el horario guardado y los cambios que podes aplicar para ese dia.</p>

          {cargando && <p className="text-sm text-gray-600">Cargando datos...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {!cargando && !error && (
            <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto pr-2">
              {DIAS.map(({ key, label }) => {
                const row = rows[key];
                const saving = Boolean(row?.saving);
                const savedRange = row?.current
                  ? formatRange(toTimeInput(row.current.horaInicio), toTimeInput(row.current.horaFin))
                  : "Sin horario guardado";
                const editedRange = formatRange(row?.horaInicio, row?.horaFin) || "Sin horario definido";
                const hasPendingChanges = row?.current
                  ? row.horaInicio !== toTimeInput(row.current.horaInicio) ||
                    row.horaFin !== toTimeInput(row.current.horaFin) ||
                    row.activo !== row.current.activo
                  : Boolean(row?.horaInicio || row?.horaFin);
                const statusColor = row?.current
                  ? row.current.activo
                    ? "text-emerald-600"
                    : "text-red-500"
                  : "text-gray-500";
                const statusLabel = row?.current
                  ? row.current.activo
                    ? "Horario activo"
                    : "Horario inactivo"
                  : "Sin horario creado";

                return (
                  <section
                    key={key}
                    className="rounded-2xl border border-[#E9DDE1] bg-[#FFFBFA] p-4 shadow-sm"
                  >
                    <header className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-[#C19BA8]">{label}</p>
                        <p className={`text-sm font-medium ${statusColor}`}>{statusLabel}</p>
                        <p className="text-xs text-gray-500">Guardado: {savedRange}</p>
                      </div>
                      {hasPendingChanges && (
                        <span className="rounded-full bg-[#703F52]/10 px-3 py-1 text-xs font-medium text-[#703F52]">
                          Cambios sin guardar
                        </span>
                      )}
                    </header>

                    <div className="mt-4 grid gap-4 md:grid-cols-[repeat(3,minmax(0,1fr))] md:items-center">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#703F52]" htmlFor={`inicio-${key}`}>
                          Inicio
                        </label>
                        <input
                          id={`inicio-${key}`}
                          type="time"
                          value={row?.horaInicio ?? ""}
                          onChange={(e) => handleChange(key, "horaInicio", e.target.value)}
                          className="w-full rounded-full border border-[#E9DDE1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#703F52]" htmlFor={`fin-${key}`}>
                          Fin
                        </label>
                        <input
                          id={`fin-${key}`}
                          type="time"
                          value={row?.horaFin ?? ""}
                          onChange={(e) => handleChange(key, "horaFin", e.target.value)}
                          className="w-full rounded-full border border-[#E9DDE1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                        />
                      </div>
                      <label className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-[#703F52]">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-[#C19BA8]"
                          checked={!!row?.activo}
                          onChange={(e) => toggleActivo(key, e.target.checked)}
                        />
                        <span>{row?.activo ? "Activo" : "Inactivo"}</span>
                      </label>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full bg-[#703F52] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5e3443] disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() => saveRow(key)}
                          disabled={saving}
                        >
                          {saving ? "Guardando..." : row?.current ? "Actualizar horario" : "Crear horario"}
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full border border-[#E9DDE1] px-4 py-2 text-sm font-medium text-[#703F52] transition hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() => borrar(key)}
                          disabled={saving}
                        >
                          {row?.current ? "Eliminar horario" : "Limpiar campos"}
                        </button>
                      </div>
                      <span className="text-xs text-gray-500">Editable: {editedRange}</span>
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              className="rounded-full border border-[#E9DDE1] px-4 py-2 text-sm font-medium text-[#703F52] transition hover:bg-[#FFFBFA]"
              onClick={onClose}
              type="button"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}









