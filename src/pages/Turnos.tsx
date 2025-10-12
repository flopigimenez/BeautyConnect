// src/pages/Turnos.tsx
import { useEffect, useMemo, useState } from "react";
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
import type { ServicioResponseDTO } from "../types/servicio/ServicioResponseDTO";
import type { TurnoDTO } from "../types/turno/TurnoDTO";
import type { ClienteResponseDTO } from "../types/cliente/ClienteResponseDTO";
import { ClienteService } from "../services/ClienteService";
import { ProfesionalServicioService } from "../services/ProfesionalServicioService";
import { ServicioService } from "../services/ServicioService";
import { TurnosDispService } from "../services/TurnosDispService";
import { createTurno, setTurno } from "../redux/store/turnoSlice";
import { setUser } from "../redux/store/authSlice";
import Footer from "../components/Footer";

import Swal from "sweetalert2";

const Turnos = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // Estado global
  const { centros, loading, error } = useAppSelector((state) => state.centros);
  const cliente = useAppSelector((state) => state.user.user);

  // Servicios 
  const profServicioService = new ProfesionalServicioService();
  const turnosDispService = new TurnosDispService();
  const clienteService = new ClienteService();
  const servicioService = new ServicioService();

  const isEntityActive = (entity: unknown): boolean => {
    if (!entity || typeof entity !== "object") return true;
    const maybeActive = (entity as { active?: boolean }).active;
    return maybeActive === undefined ? true : maybeActive === true;
  };

  // Fecha (MUI)
  const [value, setValue] = useState<Dayjs | null>(null);

  // Selecciones del usuario
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioResponseDTO | null>(null);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<ProfesionalResponseDTOSimple | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null); // "YYYY-MM-DD"
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);   // "HH:mm"

  // Datos derivados
  const [profesionalServicio, setProfesionalServicio] = useState<ProfesionalServicioResponseDTO[]>([]);
  const [serviciosCentro, setServiciosCentro] = useState<ServicioResponseDTO[]>([]);
  const [profServicio, setProfServicio] = useState<ProfesionalServicioResponseDTO | undefined>(undefined);
  const [inicios, setInicios] = useState<string[]>([]);
  const [pasos, setPasos] = useState<number>(1);
  const [clienteInfo, setClienteInfo] = useState<ClienteResponseDTO | null>(null);
  const [loadingClienteInfo, setLoadingClienteInfo] = useState(false);
  const [errorClienteInfo, setErrorClienteInfo] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [verMas, setVerMas] = useState(false);

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
          const activos = data.filter((item) =>
            isEntityActive(item) && isEntityActive(item?.servicio) && isEntityActive(item?.profesional)
          );
          setProfesionalServicio(activos);
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
        if (
          data &&
          isEntityActive(data) &&
          isEntityActive(data?.servicio) &&
          isEntityActive(data?.profesional)
        ) {
          console.log("Profesional-Servicio seleccionado:", data);
          setProfServicio(data);
        } else {
          setProfServicio(undefined);
        }
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

  useEffect(() => {
    let active = true;

    const hydrateCliente = async () => {
      if (!cliente) {
        if (active) {
          setClienteInfo(null);
          setErrorClienteInfo(null);
          setLoadingClienteInfo(false);
        }
        return;
      }

      if ((cliente as ClienteResponseDTO).id) {
        if (active) {
          setClienteInfo(cliente as ClienteResponseDTO);
          setErrorClienteInfo(null);
          setLoadingClienteInfo(false);
        }
        return;
      }

      const uid = (cliente as { uid?: string }).uid;
      if (!uid) {
        if (active) {
          setClienteInfo(null);
          setErrorClienteInfo("No se pudo identificar al cliente");
        }
        return;
      }

      if (active) {
        setLoadingClienteInfo(true);
        setErrorClienteInfo(null);
      }
      try {
        const dto = await clienteService.getByUid(uid);
        if (!active) return;
        if (dto?.id) {
          setClienteInfo(dto);
          setErrorClienteInfo(null);
          dispatch(setUser(dto));
        } else {
          setClienteInfo(null);
          setErrorClienteInfo("No se encontró información del cliente");
        }
      } catch (e: unknown) {
        if (!active) return;
        setClienteInfo(null);
        setErrorClienteInfo((e as Error).message ?? "No se pudo cargar la información del cliente");
      } finally {
        if (active) {
          setLoadingClienteInfo(false);
        }
      }
    };

    hydrateCliente();

    return () => {
      active = false;
    };
  }, [cliente, dispatch]);

  // ---- Helpers / derived ----
  const centroSeleccionado = centros.find((c) => c.id === Number(id));

  useEffect(() => {
    let active = true;

    const loadServicios = async () => {
      if (!centroSeleccionado?.id) {
        if (active) {
          setServiciosCentro([]);
        }
        return;
      }
      try {
        const servicios = await servicioService.obtenerporcentro(centroSeleccionado.id);
        if (!active) return;
        setServiciosCentro(servicios.filter((srv) => srv.active !== false));
      } catch (err) {
        console.error("Error al obtener servicios del centro:", err);
        if (active) {
          setServiciosCentro([]);
        }
      }
    };

    loadServicios();

    return () => {
      active = false;
    };
  }, [centroSeleccionado?.id]);

  const serviciosActivos = useMemo(() => serviciosCentro, [serviciosCentro]);

  useEffect(() => {
    if (servicioSeleccionado && !serviciosActivos.some((srv) => srv.id === servicioSeleccionado.id)) {
      setServicioSeleccionado(null);
    }
  }, [servicioSeleccionado, serviciosActivos]);

  useEffect(() => {
    if (profesionalSeleccionado && !profesionalServicio.some((ps) => ps?.profesional?.id === profesionalSeleccionado.id)) {
      setProfesionalSeleccionado(null);
    }
  }, [profesionalSeleccionado, profesionalServicio]);


  const puedeConfirmar = pasos === 2 && !!(fechaSeleccionada && horaSeleccionada && profServicio && clienteInfo?.id);

  // ---- Render ----
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBFA]">
      <Navbar />

      {/* Bloqueos de vista, sin afectar hooks */}
      {!cliente ? (
        <div className="flex flex-1 justify-center items-center pt-30 flex-col w-full bg-[#FFFBFA]">
          <p className="text-2xl font-primary font-bold text-tertiary">Por favor, inicia sesión</p>
        </div>
      ) : !centroSeleccionado ? (
        <div className="flex flex-1 justify-center items-center pt-30 flex-col w-full bg-[#FFFBFA]">
          <p className="text-2xl font-primary font-bold text-tertiary">Centro no encontrado</p>
          <img src={logo} alt="" />
        </div>
      ) : (
        <div className="w-full flex-1 bg-[#FFFBFA]">
          <div className="flex justify-center flex-col items-center px-4 pb-12 pt-20 sm:px-8 sm:pt-20 lg:px-0 lg:pt-24"> {/*lg:items-start lg:mx-[25%] h-full w-full max-w-[60rem]*/}
            {loading && <p>Cargando...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {loadingClienteInfo && <p className="font-primary text-sm mt-2">Cargando datos del cliente...</p>}
            {!loadingClienteInfo && errorClienteInfo && (
              <p className="font-primary text-sm text-red-500 mt-2">{errorClienteInfo}</p>
            )}

            <h1 className="font-secondary text-2xl font-bold text-center lg:text-left">
              Reserva tu turno en {centroSeleccionado.nombre} en 2 simples pasos
            </h1>

            <div className="mt-10"> {/*w-full max-w-[50rem] self-stretch space-y-10*/}
              <p className="font-primary text-center sm:text-left">{pasos === 1 ? "Paso 1 de 2" : "Paso 2 de 2"}</p>
              <div className="mt-5 flex h-1.5 w-full overflow-hidden rounded-full">
                <div className="w-1/2 bg-secondary"></div>
                <div className={`w-1/2 ${pasos === 1 ? "bg-gray-300" : "bg-secondary"}`}></div>
              </div>

              {/* Paso 1: servicio & profesional */}
              {pasos === 1 && (
                <>
                  <h2 className="mt-13 font-secondary text-l font-bold">Selecciona el servicio</h2>
                  <select
                    className="w-full max-w-[50rem] p-2 mt-2 border border-gray-300 rounded-full"
                    onChange={(e) => {
                      const s = serviciosActivos.find((srv) => srv.id === Number(e.target.value));
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
                    {serviciosActivos.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.tipoDeServicio
                          .toLowerCase()
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}{" "}
                        -
                        {" "}
                        {s.titulo
                        }{" "}
                        - ${s.precio}
                      </option>
                    ))}
                  </select>
                  {servicioSeleccionado && (
                    <div className="mt-4 w-[100%] rounded-2xl border border-gray-300 shadow flex flex-col gap-2 p-6">
                      <h3 className="font-secondary text-xl font-bold text-tertiary mb-2">
                        {servicioSeleccionado.titulo}
                      </h3>
                      <p className="font-primary text-base max-w-[100vh] text-gray-700">
                        <span className="font-semibold text-secondary">Descripción: </span>
                        {verMas
                          ? servicioSeleccionado.descripcion
                          : servicioSeleccionado.descripcion.length > 50
                            ? servicioSeleccionado.descripcion.slice(0, 50) + "..."
                            : servicioSeleccionado.descripcion}

                        {servicioSeleccionado.descripcion.length > 50 && (
                          <button
                            type="button"
                            onClick={() => setVerMas(!verMas)}
                            className="ml-2 text-secondary font-semibold hover:underline"
                          >
                            {verMas ? "Ocultar" : "Ver más"}
                          </button>
                        )}
                      </p>
                      <p className="font-primary text-base text-gray-700">
                        <span className="font-semibold text-secondary">Tipo: </span>
                        {servicioSeleccionado.tipoDeServicio.toLowerCase()
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </p>
                      <p className="font-primary text-base text-gray-700">
                        <span className="font-semibold text-secondary">Precio: </span>
                        ${servicioSeleccionado.precio}
                      </p>
                    </div>
                  )}

                  <h2 className="mt-13 font-secondary text-l font-bold">Selecciona el profesional</h2>
                  <select
                    className="w-full max-w-[50rem] p-2 mt-2 border border-gray-300 rounded-full"
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
                        if (!date) return false;
                        const today = dayjs();
                        // Deshabilitar fechas pasadas y el día actual
                        if (date.isSame(today, "day") || date.isBefore(today, "day")) return true;
                        return false;
                      }}
                      format="DD/MM/YYYY"
                      className="w-full max-w-[50rem] p-2 mt-2 border border-gray-300 rounded-full"
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </LocalizationProvider>

                  <h2 className="mt-13 font-secondary text-l font-bold">Selecciona la hora</h2>
                  <select
                    className="w-full max-w-[50rem] p-2 mt-2 border border-gray-300 rounded-full"
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
                      No hay horarios disponibles para la fecha seleccionada. Prueba con otro día.
                    </p>
                  )}
                  {!loadingClienteInfo && !clienteInfo && (
                    <p className="mt-3 text-sm text-red-500 font-primary">
                      No pudimos cargar tus datos de cliente. Intenta recargar la página o volver a iniciar sesión.
                    </p>
                  )}
                </>
              )}

              <div className="mt-10 flex w-full max-w-[50rem] flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-start sm:gap-10">
                <button
                  className="w-full sm:w-auto rounded-full bg-secondary text-primary px-33 py-2 font-primary cursor-pointer"
                  onClick={() => {
                    if (pasos === 1) {
                      setServicioSeleccionado(null);
                      setProfesionalSeleccionado(null);
                      setFechaSeleccionada(null);
                      setHoraSeleccionada(null);
                      setInicios([]);
                      navigate("/centros");
                    } else {
                      setPasos(1);
                    }
                  }}
                >
                  Volver
                </button>

                <button
                  className={`btn ${isConfirming ? "btn-disabled" : ""} w-full sm:w-auto rounded-full bg-secondary text-primary px-25 md:px-33 py-2 font-primary disabled:opacity-50 cursor-pointer`}
                  disabled={pasos === 2 && !puedeConfirmar && isConfirming}
                  onClick={() => {
                    if (pasos === 1) {
                      if (servicioSeleccionado && profesionalSeleccionado) {
                        setPasos(2);
                      } else {
                        alert("Por favor, selecciona un servicio y un profesional.");
                      }
                    } else {
                      if (puedeConfirmar && clienteInfo && profServicio && fechaSeleccionada && horaSeleccionada) {
                        setIsConfirming(true);
                        const horaToSend =
                          horaSeleccionada.length === 5 ? `${horaSeleccionada}:00` : horaSeleccionada;

                        const nuevoTurno: TurnoDTO = {
                          fecha: fechaSeleccionada,
                          hora: horaToSend,
                          clienteId: clienteInfo.id,
                          profesionalServicioId: profServicio.id,
                          centroId: centroSeleccionado.id,
                        };

                        dispatch(createTurno(nuevoTurno))
                          .unwrap()
                          .then(() => {
                            dispatch(setTurno(nuevoTurno));
                            Swal.fire("Turno creado exitosamente!");
                            navigate("/");
                          })
                          .catch((err) => Swal.fire(`Error al crear turno: ${String(err)}`));
                      } else {
                        Swal.fire("Por favor, selecciona fecha y hora.");
                      }
                    }
                    setIsConfirming(false);
                  }}
                >
                  {pasos === 1 ? "Siguiente" : isConfirming ? "Confirmando..." : "Confirmar Turno"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Turnos;
