// src/components/modals/GestionProfesionalServicio.tsx
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import type { ProfesionalResponseDTO } from "../../types/profesional/ProfesionalResponseDTO";
import type { ServicioResponseDTO } from "../../types/servicio/ServicioResponseDTO";
import type { ProfesionalServicioDTO } from "../../types/profesionalServicio/ProfesionalServicioDTO";
import { ProfesionalServicioService } from "../../services/ProfesionalServicioService";
import { ServicioService } from "../../services/ServicioService";
import type { ProfesionalServicioResponseDTO } from "../../types/profesionalServicio/ProfesionalServicioResponseDTO";

type Props = {
  profesional: ProfesionalResponseDTO;
  centroId?: number;
  onClose?: () => void;
};

type RelacionEntry = {
  id?: number;
  duracion: number;
  configured: boolean;
  saving?: boolean;
};

const profesionalServicioService = new ProfesionalServicioService();
const servicioService = new ServicioService();

export default function GestionProfesionalServicio({ profesional, centroId: centroIdProp, onClose }: Props) {
  const centroId = centroIdProp ?? profesional.centroDeEstetica?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [servicios, setServicios] = useState<ServicioResponseDTO[]>([]);
  const [relacion, setRelacion] = useState<Record<number, RelacionEntry>>({});

  const titulo = useMemo(
    () => `Servicios - ${profesional.nombre} ${profesional.apellido}`,
    [profesional]
  );

  const serviciosConfigurados = useMemo(
    () => servicios.filter((servicio) => relacion[servicio.id]?.configured),
    [servicios, relacion]
  );

  const serviciosDisponibles = useMemo(
    () => servicios.filter((servicio) => !relacion[servicio.id]?.configured),
    [servicios, relacion]
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!centroId) {
          throw new Error("El profesional no tiene un centro asociado");
        }
        const listaServicios = await servicioService.obtenerporcentro(centroId);
        setServicios(listaServicios);

        let relacionesProfesional: ProfesionalServicioResponseDTO[] = [];
        try {
          const todasLasRelaciones = await profesionalServicioService.getAll();
          relacionesProfesional = (todasLasRelaciones ?? []).filter(
            (relacion) => relacion?.profesional?.id === profesional.id
          );
        } catch (consultaError) {
          console.error("No se pudieron cargar las relaciones profesional-servicio:", consultaError);
        }

        const draft: Record<number, RelacionEntry> = {};
        for (const servicio of listaServicios) {
          const relacionExistente = relacionesProfesional.find((rel) => rel?.servicio?.id === servicio.id);
          if (relacionExistente) {
            const activa = relacionExistente.active;
            draft[servicio.id] = {
              id: relacionExistente.id,
              duracion: relacionExistente.duracion ?? 30,
              configured: activa === undefined ? true : activa,
              saving: false,
            };
          } else {
            draft[servicio.id] = { duracion: 30, configured: false, saving: false };
          }
        }

        setRelacion(draft);
      } catch (e: unknown) {
        setError((e as Error).message ?? "Error al cargar servicios");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [profesional.id, centroId]);

  const buildRelacionEntry = (
    entry?: RelacionEntry,
    overrides?: Partial<RelacionEntry>
  ): RelacionEntry => ({
    id: entry?.id,
    duracion: entry?.duracion ?? 30,
    configured: entry?.configured ?? false,
    saving: entry?.saving ?? false,
    ...entry,
    ...overrides,
  });

  const handleDuracionChange = (servicioId: number, value: number) => {
    setRelacion((prev) => ({
      ...prev,
      [servicioId]: buildRelacionEntry(prev[servicioId], { duracion: value }),
    }));
  };

  const handleCrearRelacion = async (servicio: ServicioResponseDTO) => {
    const relActual = buildRelacionEntry(relacion[servicio.id]);

    try {
      setRelacion((prev) => ({
        ...prev,
        [servicio.id]: buildRelacionEntry(prev[servicio.id], { saving: true }),
      }));

      const payload: ProfesionalServicioDTO = {
        id: 0,
        duracion: relActual.duracion,
        profesionalId: profesional.id,
        servicioId: servicio.id,
      };

      const creada = await profesionalServicioService.post(payload);

      setRelacion((prev) => ({
        ...prev,
        [servicio.id]: buildRelacionEntry(prev[servicio.id], {
          id: creada.id,
          duracion: creada.duracion ?? relActual.duracion,
          configured: true,
        }),
      }));

      await Swal.fire({
        icon: "success",
        title: "Servicio vinculado",
        text: "El profesional ahora ofrece este servicio",
        confirmButtonColor: "#a27e8f",
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (e: unknown) {
      const mensaje = (e as Error).message ?? "Error al guardar la relacion";
      await Swal.fire({ icon: "error", title: "Error", text: mensaje, confirmButtonColor: "#a27e8f" });
    } finally {
      setRelacion((prev) => ({
        ...prev,
        [servicio.id]: buildRelacionEntry(prev[servicio.id], { saving: false }),
      }));
    }
  };

  const handleActualizarRelacion = async (servicio: ServicioResponseDTO) => {
    const relActual = buildRelacionEntry(relacion[servicio.id]);
    const relacionId = relActual.id;
    if (typeof relacionId !== "number") {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontro la relacion a actualizar",
        confirmButtonColor: "#a27e8f",
      });
      return;
    }

    try {
      setRelacion((prev) => ({
        ...prev,
        [servicio.id]: buildRelacionEntry(prev[servicio.id], { saving: true }),
      }));

      const payload: ProfesionalServicioDTO = {
        id: relacionId,
        duracion: relActual.duracion,
        profesionalId: profesional.id,
        servicioId: servicio.id,
      };

      const actualizada = await profesionalServicioService.updateProfServicio(relacionId, payload);

      setRelacion((prev) => ({
        ...prev,
        [servicio.id]: buildRelacionEntry(prev[servicio.id], {
          id: actualizada.id,
          duracion: actualizada.duracion ?? relActual.duracion,
          configured: true,
        }),
      }));

      await Swal.fire({
        icon: "success",
        title: "Cambios guardados",
        text: "La duracion del servicio fue actualizada",
        confirmButtonColor: "#a27e8f",
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (e: unknown) {
      const mensaje = (e as Error).message ?? "Error al guardar la relacion";
      await Swal.fire({ icon: "error", title: "Error", text: mensaje, confirmButtonColor: "#a27e8f" });
    } finally {
      setRelacion((prev) => ({
        ...prev,
        [servicio.id]: buildRelacionEntry(prev[servicio.id], { saving: false }),
      }));
    }
  };

  const handleDesvincularRelacion = async (servicio: ServicioResponseDTO) => {
    const relActual = buildRelacionEntry(relacion[servicio.id]);
    const relacionId = relActual.id;
    if (typeof relacionId !== "number") {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontro la relacion a desvincular",
        confirmButtonColor: "#a27e8f",
      });
      return;
    }

    const decision = await Swal.fire({
      icon: "warning",
      title: "Desvincular servicio",
      text: "Podras activarlo nuevamente cuando quieras",
      showCancelButton: true,
      confirmButtonColor: "#703F52",
      cancelButtonColor: "#C19BA8",
      confirmButtonText: "Desvincular",
      cancelButtonText: "Cancelar",
    });
    if (!decision.isConfirmed) return;

    try {
      setRelacion((prev) => ({
        ...prev,
        [servicio.id]: buildRelacionEntry(prev[servicio.id], { saving: true }),
      }));

      await profesionalServicioService.delete(relacionId);

      setRelacion((prev) => ({
        ...prev,
        [servicio.id]: buildRelacionEntry(prev[servicio.id], {
          duracion: 30,
          configured: false,
          id: undefined,
        }),
      }));

      await Swal.fire({
        icon: "success",
        title: "Servicio desvinculado",
        text: "El servicio ya no esta disponible para este profesional",
        confirmButtonColor: "#a27e8f",
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (e: unknown) {
      const mensaje = (e as Error).message ?? "Error al desvincular relacion";
      await Swal.fire({ icon: "error", title: "Error", text: mensaje, confirmButtonColor: "#a27e8f" });
    } finally {
      setRelacion((prev) => ({
        ...prev,
        [servicio.id]: buildRelacionEntry(prev[servicio.id], { saving: false }),
      }));
    }
  };

  const renderEstadoChip = (entry: RelacionEntry | undefined) => {
    if (!entry?.configured) {
      return <span className="inline-flex items-center gap-1 rounded-full bg-[#F0E3E7] px-3 py-1 text-xs font-semibold text-[#703F52]">Inactivo</span>;
    }
    return <span className="inline-flex items-center gap-1 rounded-full bg-[#703F52]/10 px-3 py-1 text-xs font-semibold text-[#703F52]">Activo</span>;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFFBFA] via-white to-[#F7EEF2] shadow-[0px_30px_80px_-40px_rgba(112,63,82,0.45)] ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#F0E3E7] bg-gradient-to-r from-[#F9EFF3] to-white px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#C19BA8]">Gestion de servicios</p>
            <h2 className="mt-2 text-2xl font-secondary font-semibold text-[#703F52]">{titulo}</h2>
            <p className="mt-2 text-sm text-[#856272]">
              Configura la duracion y disponibilidad de cada servicio ofrecido por este profesional.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E9DDE1] text-lg text-[#703F52] transition hover:bg-white hover:text-[#4A1F2F] focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/50"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>

        <div className="px-6 pb-6 pt-5">
          {loading && (
            <div className="mb-4 rounded-xl border border-dashed border-[#E9DDE1] bg-white/80 px-4 py-3 text-sm text-[#856272]">
              Cargando servicios...
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-8">
              <section>
                <h3 className="mb-4 text-base font-semibold text-[#703F52]">Servicios vinculados</h3>
                {serviciosConfigurados.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#E9DDE1] bg-white/80 px-4 py-6 text-center text-sm text-[#856272]">
                    Este profesional todavia no tiene servicios activos. Vincula nuevos servicios desde la seccion siguiente.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-[#F0E3E7] bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-[#F0E3E7] text-sm">
                      <thead className="bg-[#FFFBFA] text-[#703F52]">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold">Titulo</th>
                          <th className="px-6 py-3 text-left font-semibold">Servicio</th>
                          <th className="px-6 py-3 text-left font-semibold">Precio</th>
                          <th className="px-6 py-3 text-left font-semibold">Duracion (min)</th>
                          <th className="px-6 py-3 text-left font-semibold">Estado</th>
                          <th className="px-6 py-3 text-left font-semibold">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0E3E7]">
                        {serviciosConfigurados.map((servicio) => {
                          const relActual = buildRelacionEntry(relacion[servicio.id]);
                          const saving = relActual.saving ?? false;
                          const precio = typeof servicio.precio === "number" ? `$${servicio.precio.toFixed(2)}` : "-";

                          return (
                            <tr key={servicio.id} className="bg-white transition hover:bg-[#FFFBFA]">
                              <td className="px-6 py-4 align-middle text-[#4A1F2F]">{servicio.titulo}</td>
                              <td className="px-6 py-4 align-middle text-[#856272]">
                                {servicio.tipoDeServicio?.replaceAll("_", " ") ?? "-"}
                              </td>
                              <td className="px-6 py-4 align-middle text-[#4A1F2F]">{precio}</td>
                              <td className="px-6 py-4 align-middle">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="number"
                                    min={10}
                                    step={5}
                                    value={relActual.duracion}
                                    onChange={(event) => handleDuracionChange(servicio.id, Number(event.target.value))}
                                    className="w-24 rounded-xl border border-[#E9DDE1] bg-white px-3 py-2 text-sm text-[#4A1F2F] focus:border-[#C19BA8] focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                                    disabled={saving}
                                  />
                                  <span className="text-xs text-[#856272]">en minutos</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 align-middle">{renderEstadoChip(relActual)}</td>
                              <td className="px-6 py-4 align-middle">
                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    className="inline-flex items-center justify-center rounded-full bg-[#703F52] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#5e3443] disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={saving}
                                    onClick={() => void handleActualizarRelacion(servicio)}
                                  >
                                    Guardar cambios
                                  </button>

                                  <button
                                    className="inline-flex items-center justify-center rounded-full border border-[#E9DDE1] px-4 py-2 text-xs font-semibold text-[#703F52] transition hover:bg-[#FFFBFA] disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={saving}
                                    onClick={() => void handleDesvincularRelacion(servicio)}
                                  >
                                    Desvincular
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section>
                <h3 className="mb-4 text-base font-semibold text-[#703F52]">Agregar nuevos servicios</h3>
                {serviciosDisponibles.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#E9DDE1] bg-white/80 px-4 py-6 text-center text-sm text-[#856272]">
                    Todos los servicios del centro ya estan asignados a este profesional.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-[#F0E3E7] bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-[#F0E3E7] text-sm">
                      <thead className="bg-[#FFFBFA] text-[#703F52]">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold">Titulo</th>
                          <th className="px-6 py-3 text-left font-semibold">Servicio</th>
                          <th className="px-6 py-3 text-left font-semibold">Precio</th>
                          <th className="px-6 py-3 text-left font-semibold">Duracion (min)</th>
                          <th className="px-6 py-3 text-left font-semibold">Estado</th>
                          <th className="px-6 py-3 text-left font-semibold">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0E3E7]">
                        {serviciosDisponibles.map((servicio) => {
                          const relActual = buildRelacionEntry(relacion[servicio.id]);
                          const saving = relActual.saving ?? false;
                          const precio = typeof servicio.precio === "number" ? `$${servicio.precio.toFixed(2)}` : "-";

                          return (
                            <tr key={servicio.id} className="bg-white transition hover:bg-[#FFFBFA]">
                              <td className="px-6 py-4 align-middle text-[#4A1F2F]">{servicio.titulo}</td>
                              <td className="px-6 py-4 align-middle text-[#856272]">
                                {servicio.tipoDeServicio?.replaceAll("_", " ") ?? "-"}
                              </td>
                              <td className="px-6 py-4 align-middle text-[#4A1F2F]">{precio}</td>
                              <td className="px-6 py-4 align-middle">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="number"
                                    min={10}
                                    step={5}
                                    value={relActual.duracion}
                                    onChange={(event) => handleDuracionChange(servicio.id, Number(event.target.value))}
                                    className="w-24 rounded-xl border border-[#E9DDE1] bg-white px-3 py-2 text-sm text-[#4A1F2F] focus:border-[#C19BA8] focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                                    disabled={saving}
                                  />
                                  <span className="text-xs text-[#856272]">en minutos</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 align-middle">{renderEstadoChip(relActual)}</td>
                              <td className="px-6 py-4 align-middle">
                                <button
                                  className="inline-flex items-center justify-center rounded-full bg-[#703F52] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#5e3443] disabled:cursor-not-allowed disabled:opacity-60"
                                  disabled={saving}
                                  onClick={() => void handleCrearRelacion(servicio)}
                                >
                                  Vincular servicio
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button
              className="inline-flex items-center justify-center rounded-full border border-transparent bg-white px-6 py-2.5 text-sm font-semibold text-[#703F52] shadow-sm transition hover:border-[#E9DDE1] hover:bg-[#FFFBFA]"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
