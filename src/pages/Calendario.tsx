import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import dayjs, { Dayjs } from "dayjs";
import { useAppSelector } from "../redux/store/hooks";
import type { TurnoResponseDTO } from "../types/turno/TurnoResponseDTO";
import { TurnoService } from "../services/TurnoService";
import { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";
import SideBar from "../components/SideBar";
import NavbarPrestador from "../components/NavbarPrestador";
const turnoService = new TurnoService();
const centroService = new CentroDeEsteticaService();

type DayCell = {
  date: Dayjs;
  inCurrentMonth: boolean;
};

export default function Calendario() {
  const { user: authUser, firebaseUser } = useAppSelector((s) => s.user);
  const user = authUser as any;
  const uid = user?.uid ?? user?.usuario?.uid ?? firebaseUser?.uid ?? null;

  const [centroId, setCentroId] = useState<number | null>(null);
  const [loadingCentro, setLoadingCentro] = useState<boolean>(true);
  const [errorCentro, setErrorCentro] = useState<string | null>(null);

  const [month, setMonth] = useState<Dayjs>(dayjs());
  const [turnos, setTurnos] = useState<TurnoResponseDTO[]>([]);
  const [loadingTurnos, setLoadingTurnos] = useState<boolean>(false);
  const [errorTurnos, setErrorTurnos] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Cargar centro del prestador por su UID/ID
  useEffect(() => {
    let isMounted = true;

    const loadCentro = async () => {
      if (!uid) {
        if (isMounted) {
          setErrorCentro("No hay usuario autenticado.");
          setCentroId(null);
          setLoadingCentro(false);
        }
        return;
      }

      if (isMounted) {
        setLoadingCentro(true);
        setErrorCentro(null);
      }

      try {
        const cId = await centroService.getMiCentroId(uid);
        if (isMounted) {
          setCentroId(typeof cId === "number" ? cId : null);
        }
      } catch (e: unknown) {
        if (isMounted) {
          setErrorCentro((e as Error).message ?? "Error al cargar centro");
          setCentroId(null);
        }
      } finally {
        if (isMounted) {
          setLoadingCentro(false);
        }
      }
    };

    loadCentro();

    return () => {
      isMounted = false;
    };
  }, [uid]);

  // Cargar turnos del centro (y filtrar por mes en cliente)
  useEffect(() => {
    (async () => {
      if (!centroId) return;
      try {
        setLoadingTurnos(true);
        setErrorTurnos(null);
        const data = await turnoService.getByCentroId(centroId);
        setTurnos(Array.isArray(data) ? data : []);
        console.log("Turnos cargados:", data);
      } catch (e: unknown) {
        setErrorTurnos((e as Error).message ?? "Error al cargar turnos");
      } finally {
        setLoadingTurnos(false);
      }
    })();
  }, [centroId]);

  // Mapa de turnos por fecha (YYYY-MM-DD)
  const turnosByDate = useMemo(() => {
    const map = new Map<string, TurnoResponseDTO[]>();
    for (const t of turnos) {
      if (centroId) {
        const turnoCentroId =
          t.centroDeEstetica?.id ??
          t.centroDeEsteticaResponseDTO?.id ??
          (t as any).centroId ??
          (t as any).centroDeEsteticaId ??
          null;
        if (turnoCentroId && turnoCentroId !== centroId) continue;
      }
      const f = dayjs(t.fecha).format("YYYY-MM-DD");
      const arr = map.get(f) ?? [];
      arr.push(t);
      map.set(f, arr);
    }
    return map;
  }, [turnos, centroId]);

  // Construccion del grid mensual (6 filas x 7 columnas)
  const grid: DayCell[] = useMemo(() => {
    const startOfMonth = month.startOf("month");
    const endOfMonth = month.endOf("month");
    const startWeekday = startOfMonth.day(); // 0-dom, 1-lun, ...

    const cells: DayCell[] = [];
    // dias del mes anterior para llenar inicio
    for (let i = 0; i < startWeekday; i++) {
      const d = startOfMonth.subtract(startWeekday - i, "day");
      cells.push({ date: d, inCurrentMonth: false });
    }
    // dias del mes actual
    for (let d = 0; d < endOfMonth.date(); d++) {
      const dt = startOfMonth.add(d, "day");
      cells.push({ date: dt, inCurrentMonth: true });
    }
    // completar hasta 42 celdas
    let next = 1;
    while (cells.length < 42) {
      const dt = endOfMonth.add(next++, "day");
      cells.push({ date: dt, inCurrentMonth: false });
    }
    return cells;
  }, [month]);

  const monthName = month.format("MMMM YYYY");

  return (
    <div className="bg-[#FFFBFA] min-h-screen flex flex-col">
      <NavbarPrestador />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block w-64 shrink-0 border-r border-[#E9DDE1] bg-[#FFFBFA] h-[calc(100vh-64px)] sticky top-[64px]">
          <SideBar />
        </aside>
        <main className="flex-1 overflow-auto px-15 py-16">
        <h1 className="font-secondary text-2xl font-bold mb-6">Calendario de turnos</h1>

        {loadingCentro && <p className="font-primary">Cargando centro...</p>}
        {errorCentro && <p className="font-primary text-red-600">{errorCentro}</p>}

        {centroId && (
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <button
                className="rounded-full bg-secondary px-4 py-1 font-primary text-sm"
                onClick={() => setMonth((m) => m.subtract(1, "month"))}
              >
                Mes anterior
              </button>
              <h2 className="font-secondary text-xl font-bold capitalize">{monthName}</h2>
              <div className="flex gap-2">
                <button
                  className="rounded-full bg-secondary px-4 py-1 font-primary text-sm"
                  onClick={() => setMonth(dayjs())}
                >
                  Hoy
                </button>
                <button
                  className="rounded-full bg-secondary px-4 py-1 font-primary text-sm"
                  onClick={() => setMonth((m) => m.add(1, "month"))}
                >
                  Mes siguiente
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {"DLMMJVS".split("").map((w, i) => (
                <div key={i} className="text-center font-primary text-sm text-gray-600">
                  {w}
                </div>
              ))}
            </div>

            {loadingTurnos && (
              <p className="font-primary mb-3">Cargando turnos...</p>
            )}
            {errorTurnos && (
              <p className="font-primary text-red-600 mb-3">{errorTurnos}</p>
            )}

            <div className="grid grid-cols-7 gap-2">
              {grid.map((cell, idx) => {
                const key = cell.date.format("YYYY-MM-DD");
                const isToday = cell.date.isSame(dayjs(), "day");
                const items = turnosByDate.get(key) ?? [];
                const visible = items
                  .filter((t) => cell.date.isSame(dayjs(t.fecha), "month")) // seguridad
                  .slice(0, 3);
                const extraCount = Math.max(0, items.length - visible.length);
                return (
                  <div
                    key={`${key}-${idx}`}
                    className={`border rounded-xl p-2 min-h-[110px] flex flex-col ${
                      cell.inCurrentMonth ? "bg-[#FFFBFA]" : "bg-gray-50 text-gray-400"
                    } ${isToday ? "ring-2 ring-secondary" : ""}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-primary text-sm">{cell.date.date()}</span>
                      {items.length > 0 && (
                        <button
                          className="text-[11px] font-primary text-secondary underline"
                          onClick={() => setSelectedDate(key)}
                        >
                          Ver {items.length}
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {visible.map((t) => {
                        const centroNombre =
                          t.centroDeEstetica?.nombre ??
                          t.centroDeEsteticaResponseDTO?.nombre ??
                          "";
                        return (
                          <div key={t.id} className="bg-secondary/30 text-primary rounded-full px-2 py-[2px] text-[11px] font-primary overflow-hidden text-ellipsis whitespace-nowrap">
                            {`${t.hora} - ${t.profesionalServicio.profesional.nombre}${centroNombre ? ` - ${centroNombre}` : ''}`}
                          </div>
                        );
                      })}
                      {extraCount > 0 && (
                        <div className="text-[11px] text-gray-600 font-primary">+{extraCount} mas</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal simple para ver turnos del dia */}
        {selectedDate && (
          <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow p-5 w-[90%] max-w-xl">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-secondary text-lg font-bold">
                  Turnos del {dayjs(selectedDate).format("DD/MM/YYYY")}
                </h3>
                <button
                  className="font-primary text-sm text-gray-600 hover:text-gray-800"
                  onClick={() => setSelectedDate(null)}
                >
                  Cerrar
                </button>
              </div>
              <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
                {(turnosByDate.get(selectedDate) ?? []).map((t) => {
                  const centroNombre =
                    t.centroDeEstetica?.nombre ??
                    t.centroDeEsteticaResponseDTO?.nombre ??
                    "";
                  return (
                    <div key={t.id} className="border rounded-xl p-3 flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="font-primary font-semibold">{t.hora}</span>
                        <span className="font-primary text-sm">{t.estado}</span>
                      </div>
                      <div className="font-primary text-sm">
                        {t.profesionalServicio.profesional.nombre} {t.profesionalServicio.profesional.apellido}
                      </div>
                      <div className="font-primary text-sm text-gray-600">
                        {t.profesionalServicio.servicio.tipoDeServicio
                          .toLowerCase()
                          .split("_")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </div>
                      <div className="font-primary text-sm text-gray-600">
                        Cliente: {t.cliente.nombre} {t.cliente.apellido}
                      </div>
                      {centroNombre && (
                        <div className="font-primary text-sm text-gray-600">
                          Centro: {centroNombre}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}
