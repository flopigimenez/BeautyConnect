// src/pages/Turnos.tsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCentros } from "../redux/store/centroSlice";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import logo from "../assets/logo.png";

import type { ProfesionalServicioResponseDTO } from "../types/profesionalServicio/ProfesionalServicioResponseDTO";
import type { ProfesionalResponseDTOSimple } from "../types/profesional/ProfesionalResponseDTOSimple";
import type { ServicioResponseDTOSimple } from "../types/servicio/ServicioResponseDTOSimple";
import type { TurnoDTO } from "../types/turno/TurnoDTO";

import { ProfesionalServicioService } from "../services/ProfesionalServicioService";
import { TurnosDispService } from "../services/TurnosDispService";
import { createTurno, setTurno } from "../redux/store/turnoSlice";

const Turnos = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // Estado global
  const { centros, loading, error } = useAppSelector((state) => state.centros);
  const cliente = useAppSelector((state) => state.user.user);
  console.log("Cliente en Turnos:", cliente);

  // Servicios (instancias simples; si querés, memoizá con useMemo)
  const profServicioService = new ProfesionalServicioService();
  const turnosDispService = new TurnosDispService();

  // Fecha (MUI)
  const [value, setValue] = useState<Dayjs | null>(null);

  // Selecciones del usuario
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioResponseDTOSimple | null>(null);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<ProfesionalResponseDTOSimple | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null); // "YYYY-MM-DD"
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);   // "HH:mm"

  // Datos derivados
  const [profesionalServicio, setProfesionalServicio] = useState<ProfesionalServicioResponseDTO[]>([]);
  const [profServicio, setProfServicio] = useState<ProfesionalServicioResponseDTO | undefined>(undefined);
  const [inicios, setInicios] = useState<string[]>([]);
  const [pasos, setPasos] = useState<number>(1);

  // ---- Hooks SIEMPRE al tope, sin returns antes ----

  // Cargar centros
  useEffect(() => {
    dispatch(fetchCentros());
  }, [dispatch]);

  // 1) Al elegir servicio -> cargar relaciones Profesional-Servicio de ese servicio
  useEffect(() => {
    const fetchProfesionales = async () => {
      if (servicioSeleccionado) {
        try {
          const data = await profServicioService.getProfServicio(servicioSeleccionado.id);
          setProfesionalServicio(data);
        } catch (err) {
          console.error("Error al obtener profesionales del servicio:", err);
          setProfesionalServicio([]);
        }
      } else {
        setProfesionalServicio([]);
      }
    };
    fetchProfesionales();
  }, [servicioSeleccionado]);

  // 2) Cuando hay profesional y servicio -> cargar relación exacta (duración y psId)
  useEffect(() => {
    (async () => {
      if (!profesionalSeleccionado || !servicioSeleccionado) {
        setProfServicio(undefined);
        return;
      }
      try {
        const data = await profServicioService.getByProfesionalAndServicio(
          profesionalSeleccionado.id,
          servicioSeleccionado.id
        );
        console.log("Profesional-Servicio seleccionado:", data);
        setProfServicio(data);
      } catch {
        setProfServicio(undefined);
      }
    })();
  }, [profesionalSeleccionado, servicioSeleccionado]);

  // 3) Cuando cambia la fecha -> limpiar hora elegida
  useEffect(() => {
    setHoraSeleccionada(null);
  }, [fechaSeleccionada]);

  // 4) Al tener profesional, servicio y fecha -> pedir horarios on-demand (pool compartido)
  useEffect(() => {
    (async () => {
      if (!profesionalSeleccionado || !servicioSeleccionado || !fechaSeleccionada) {
        setInicios([]);
        return;
      }
      try {
        const resp = await turnosDispService.getHorariosDisponibles(
          profesionalSeleccionado.id,
          servicioSeleccionado.id,
          fechaSeleccionada,
          10 // step en minutos; podés hacerlo configurable
        );
        setInicios(resp.inicios ?? []);
      } catch (e) {
        console.error(e);
        setInicios([]);
      }
    })();
  }, [profesionalSeleccionado, servicioSeleccionado, fechaSeleccionada]);

  // ---- Helpers / derived ----
  const centroSeleccionado = centros.find((c) => c.id === Number(id));
  const puedeConfirmar = pasos === 2 && !!(fechaSeleccionada && horaSeleccionada && profServicio);

  // ---- Render ----
  return (
    <>
      <Navbar />

      {/* Bloqueos de vista, sin afectar hooks */}
      {!cliente ? (
        <div className="flex justify-center items-center pt-30 flex-col">
          <p className="text-2xl font-primary font-bold text-tertiary">Por favor, inicia sesión</p>
        </div>
      ) : !centroSeleccionado ? (
        <div className="flex justify-center items-center pt-30 flex-col">
          <p className="text-2xl font-primary font-bold text-tertiary">Centro no encontrado</p>
          <img src={logo} alt="" />
        </div>
      ) : (
        <div className="bg-primary w-screen pt-25 flex justify-center items-center flex-col">
          {loading && <p>Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <h1 className="font-secondary text-2xl font-bold">
            Reserva tu turno en {centroSeleccionado.nombre} en 2 simples pasos
          </h1>

          <div className="mt-10">
            <p className="font-primary text-left">{pasos === 1 ? "Paso 1 de 2" : "Paso 2 de 2"}</p>
            <div className="w-[50rem] h-1.5 rounded-full overflow-hidden flex mt-5">
              <div className="w-1/2 bg-secondary"></div>
              <div className={`w-1/2 ${pasos === 1 ? "bg-gray-300" : "bg-secondary"}`}></div>
            </div>

            {/* Paso 1: servicio & profesional */}
            {pasos === 1 && (
              <>
                <h2 className="mt-13 font-secondary text-l font-bold">Selecciona el servicio</h2>
                <select
                  className="w-[50rem] p-2 mt-2 border border-gray-300 rounded-full"
                  onChange={(e) => {
                    const s = centroSeleccionado.servicios.find((srv) => srv.id === Number(e.target.value));
                    setServicioSeleccionado(s ?? null);
                    setProfesionalSeleccionado(null);
                    setFechaSeleccionada(null);
                    setHoraSeleccionada(null);
                    setInicios([]);
                  }}
                  value={servicioSeleccionado ? servicioSeleccionado.id : ""}
                >
                  <option value="" disabled>
                    Seleccionar servicio
                  </option>
                  {centroSeleccionado.servicios.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.tipoDeServicio
                        .toLowerCase()
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}{" "}
                      - ${s.precio}
                    </option>
                  ))}
                </select>

                <h2 className="mt-13 font-secondary text-l font-bold">Selecciona el profesional</h2>
                <select
                  className="w-[50rem] p-2 mt-2 border border-gray-300 rounded-full"
                  onChange={(e) => {
                    const p = profesionalServicio.find((ps) => ps?.profesional?.id === Number(e.target.value));
                    setProfesionalSeleccionado(p?.profesional ?? null);
                    setFechaSeleccionada(null);
                    setHoraSeleccionada(null);
                    setInicios([]);
                  }}
                  value={profesionalSeleccionado ? profesionalSeleccionado.id : ""}
                  disabled={!servicioSeleccionado}
                >
                  <option value="" disabled>
                    Seleccionar profesional
                  </option>
                  {profesionalServicio.map((p) => (
                    <option key={p?.profesional?.id || `undefined-${Math.random()}`} value={p?.profesional?.id || ""}>
                      {p?.profesional?.nombre} {p?.profesional?.apellido}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* Paso 2: fecha & hora */}
            {pasos === 2 && (
              <>
                <h2 className="mt-13 font-secondary text-l font-bold pb-2">Selecciona la fecha</h2>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Elegí una fecha"
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                      setFechaSeleccionada(newValue ? newValue.format("YYYY-MM-DD") : null);
                    }}
                    shouldDisableDate={(date) => {
                      // Deshabilitar fechas pasadas
                      if (date.isBefore(dayjs(), "day")) return true;
                      // (Opcional) Deshabilitar fines de semana
                      const d = date.day();
                      if (d === 0 || d === 6) return true;
                      return false;
                    }}
                    format="DD/MM/YYYY"
                    className="w-[50rem] p-2 mt-2 border border-gray-300 rounded-full"
                  />
                </LocalizationProvider>

                <h2 className="mt-13 font-secondary text-l font-bold">Selecciona la hora</h2>
                <select
                  className="w-[50rem] p-2 mt-2 border border-gray-300 rounded-full"
                  onChange={(e) => setHoraSeleccionada(e.target.value)}
                  value={horaSeleccionada ?? ""}
                  disabled={!fechaSeleccionada || inicios.length === 0}
                >
                  <option value="" disabled>
                    Seleccionar hora
                  </option>
                  {inicios.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>

                {fechaSeleccionada && inicios.length === 0 && (
                  <p className="mt-3 text-sm text-gray-600">
                    No hay horarios disponibles para la fecha seleccionada. Probá con otro día.
                  </p>
                )}
              </>
            )}

            <div className="flex justify-center items-center mt-15 gap-15">
              <button
                className="rounded-full bg-secondary px-33 py-2 font-primary"
                onClick={() => {
                  if (pasos === 1) {
                    setServicioSeleccionado(null);
                    setProfesionalSeleccionado(null);
                    setFechaSeleccionada(null);
                    setHoraSeleccionada(null);
                    setInicios([]);
                    alert("Turno cancelado");
                    navigate("/");
                  } else {
                    setPasos(1);
                  }
                }}
              >
                {pasos === 1 ? "Cancelar" : "Volver atrás"}
              </button>

              <button
                className="rounded-full bg-secondary px-33 py-2 font-primary disabled:opacity-50"
                disabled={pasos === 2 && !puedeConfirmar}
                onClick={() => {
                  if (pasos === 1) {
                    if (servicioSeleccionado && profesionalSeleccionado) {
                      setPasos(2);
                    } else {
                      alert("Por favor, selecciona un servicio y un profesional.");
                    }
                  } else {
                    if (puedeConfirmar && cliente && profServicio && fechaSeleccionada && horaSeleccionada) {
                            const horaToSend = horaSeleccionada.length === 5
                        ? `${horaSeleccionada}:00`
                        : horaSeleccionada;

                      const nuevoTurno: TurnoDTO = {
                        fecha: fechaSeleccionada,
                        hora: horaToSend,
                        clienteId: cliente.id,
                        profesionalServicioId: profServicio.id,

                      };
                      
                      dispatch(createTurno(nuevoTurno))
                        .unwrap()
                        .then(() => {
                          dispatch(setTurno(nuevoTurno));
                          alert("Turno creado exitosamente!");
                          navigate("/");
                        })
                        .catch((err) => alert(`Error al crear turno: ${String(err)}`));
                    } else {
                      alert("Por favor, selecciona fecha y hora.");
                    }
                  }
                }}
              >
                {pasos === 1 ? "Siguiente" : "Confirmar turno"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Turnos;
