import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import type { DisponibilidadResponseDTO } from "../types/disponibilidad/DisponibilidadResponseDTO";
import { fetchCentros } from "../redux/store/centroSlice";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import logo from '../assets/logo.png';
import type { ProfesionalServicioResponseDTO } from "../types/profesionalServicio/ProfesionalServicioResponseDTO";
import type { ProfesionalResponseDTOSimple } from "../types/profesional/ProfesionalResponseDTOSimple";
import type { ServicioResponseDTOSimple } from "../types/servicio/ServicioResponseDTOSimple";
import { ProfesionalServicioService } from "../services/ProfesionalServicioService";
import type { TurnoDTO } from "../types/turno/TurnoDTO";
import { createTurno, setTurno } from "../redux/store/turnoSlice";


const Turnos = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { centros, loading, error } = useAppSelector((state) => state.centros);
    const [value, setValue] = useState<Dayjs | null>(null);
    const profServicioService = new ProfesionalServicioService();
    const cliente = useAppSelector((state) => state.user.user);
 if (!cliente){
        return <div>Por favor, inicia sesión</div>;
    }

    useEffect(() => {
        dispatch(fetchCentros());
    }, [dispatch]);

    // Busca el centro según el id
    const centroSeleccionado = centros.find((c) => c.id === Number(id));
    if (!centroSeleccionado) return <div className="flex justify-center items-center pt-30 flex-col">
        <p className="text-2xl font-primary font-bold text-tertiary">Centro no encontrado</p>
        <img src={logo} alt="" />
    </div>;

    const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioResponseDTOSimple | null>();
    const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<ProfesionalResponseDTOSimple | null>();
    const [profesionalServicio, setProfesionalServicio] = useState<ProfesionalServicioResponseDTO[]>([]);
    const [profServicio, setProfServicio] = useState<ProfesionalServicioResponseDTO>();
    const [disponibilidad, setDisponibiliadad] = useState<DisponibilidadResponseDTO[]>([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>();
    const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>();
    const [pasos, setPasos] = useState<number>(1);


    // Filtra profesionales según servicio
    useEffect(() => {
        const fetchProfesionales = async () => {
            if (servicioSeleccionado) {
                try {
                    const data = await profServicioService.getProfServicio(servicioSeleccionado.id);
                    setProfesionalServicio(data);
                } catch (error) {
                    console.error("Error al obtener profesionales del servicio:", error);
                }
            } else {
                setProfesionalServicio([]);
            }
        };
        fetchProfesionales();
    }, [servicioSeleccionado]);

    // Fechas disponibles para el profesional seleccionado
    useEffect(() => {
        const fetchDisponibilidades = async () => {
            if (profesionalSeleccionado) {
                try {
                    const data = await profServicioService.getByProfesionalServicio(profesionalSeleccionado.id, servicioSeleccionado!.id);
                    setProfServicio(data)
                    setDisponibiliadad(data.disponibilidades!);
                } catch (error) {
                    console.error("Error al obtener disponibilidades del profesional:", error);
                }
            } else {
                setDisponibiliadad([]);
            }
        };
        fetchDisponibilidades();
    }, [profesionalSeleccionado, servicioSeleccionado]);

    // Horas disponibles según fecha seleccionada
    const horasDisponibles: DisponibilidadResponseDTO[] = fechaSeleccionada
        ? disponibilidad.filter(
            (d) =>
                d.fecha ===
                fechaSeleccionada.split("T")[0]
        )
        : [];

    const crearTurno = async () => {
        if(cliente && profServicio){
            const nuevoTurno: TurnoDTO = {
                fecha: fechaSeleccionada!,
                hora: horaSeleccionada!,
                clienteId: cliente!.id,
                profesionalServicioId: profServicio!.id,
            };
            // Aquí puedes agregar la lógica para enviar el turno al backend si es necesario

            try {
                await dispatch(createTurno(nuevoTurno)).unwrap();
                dispatch(setTurno(nuevoTurno));
                alert("Turno creado exitosamente!");
                navigate("/");
            } catch (error) {
                alert(`Error al crear turno: ${error}`);
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="bg-primary w-screen pt-25 flex justify-center items-center flex-col">
                {loading && <p>Cargando...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <h1 className="font-secondary text-2xl font-bold"> Reserva tu turno en {centroSeleccionado.nombre} en 2 simples pasos </h1>
                <div className="mt-10">
                    <p className="font-primary text-left">
                        {pasos === 1 ? "Paso 1 de 2" : "Paso 2 de 2"}
                    </p>
                    <div className="w-[50rem] h-1.5 rounded-full overflow-hidden flex mt-5">
                        <div className="w-1/2 bg-secondary"></div>
                        <div className={`w-1/2 ${pasos === 1 ? "bg-gray-300" : "bg-secondary"}`}></div>
                    </div>

                    {/* Paso 1 */}
                    {pasos === 1 && (
                        <>
                            <h2 className="mt-13 font-secondary text-l font-bold"> Selecciona el servicio </h2>
                            <select className="w-[50rem] p-2 mt-2 border border-gray-300 rounded-full"
                                onChange={(e) => {
                                    const s = centroSeleccionado.servicios.find(
                                        (s) => s.id === Number(e.target.value)
                                    );
                                    setServicioSeleccionado(s ?? null);
                                    setProfesionalSeleccionado(null);
                                }}
                                value={servicioSeleccionado ? servicioSeleccionado.id : ""}
                            >
                                <option value="" disabled>Seleccionar servicio</option>
                                {centroSeleccionado.servicios.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.tipoDeServicio.toLowerCase()
                                            .split('_')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ')} - ${s.precio}
                                    </option>
                                ))}
                            </select>

                            <h2 className="mt-13 font-secondary text-l font-bold">Selecciona el profesional</h2>
                            <select className="w-[50rem] p-2 mt-2 border border-gray-300 rounded-full"
                                onChange={(e) => {
                                    const p = profesionalServicio.find(
                                        (p) => p?.profesional?.id === Number(e.target.value)
                                    );
                                    setProfesionalSeleccionado(p?.profesional ?? null);
                                }}
                                value={profesionalSeleccionado ? profesionalSeleccionado.id : ""}
                            >
                                <option value="" disabled> Seleccionar profesional </option>
                                {profesionalServicio.map((p) => (
                                    <option
                                        key={p?.profesional?.id || `undefined-${Math.random()}`}
                                        value={p?.profesional?.id || ""}
                                    >
                                        {p?.profesional?.nombre} {p?.profesional?.apellido}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    {/* Paso 2 */}
                    {pasos === 2 && (
                        <>
                            <h2 className="mt-13 font-secondary text-l font-bold pb-2"> Selecciona la fecha </h2>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Elegí una fecha"
                                    value={value}
                                    onChange={(newValue) => {
                                        setValue(newValue);
                                        setFechaSeleccionada(newValue ? newValue.format("YYYY-MM-DD") : null);
                                    }}
                                    shouldDisableDate={(date) => {
                                        // No dejar elegir sábados ni domingos
                                        const day = date.day();
                                        if (day === 0 || day === 6) return true;

                                        // No dejar elegir fechas anteriores a hoy
                                        if (date.isBefore(dayjs(), "day")) return true;

                                        // Solo habilitar fechas que estén en fechasDisponibles
                                        const fechaFormateada = date.format("YYYY-MM-DD");
                                        const fechasDisponiblesFormateadas = disponibilidad.map((d) => d.fecha);

                                        // Retornar true para DESHABILITAR fechas que NO estén disponibles
                                        return !fechasDisponiblesFormateadas.includes(fechaFormateada);
                                    }}
                                    format="DD/MM/YYYY"
                                    className="w-[50rem] p-2 mt-2 border border-gray-300 rounded-full"
                                />
                            </LocalizationProvider>

                            <h2 className="mt-13 font-secondary text-l font-bold"> Selecciona la hora </h2>
                            <select className="w-[50rem] p-2 mt-2 border border-gray-300 rounded-full"
                                onChange={(e) => {
                                    setHoraSeleccionada(e.target.value);
                                }}
                                value={horaSeleccionada ?? ""}
                            >
                                <option value="" disabled> Seleccionar hora </option>
                                {horasDisponibles.map((d) => (
                                    <option key={d.id} value={d.horaInicio}>
                                        {d.horaInicio} - {d.horaFinalizacion}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    <div className="flex justify-center items-center mt-15 gap-15">
                        <button className="rounded-full bg-secondary px-33 py-2 font-primary"
                            onClick={() => {
                                if (pasos === 1) {
                                    setServicioSeleccionado(null);
                                    setProfesionalSeleccionado(null);
                                    setFechaSeleccionada(null);
                                    setHoraSeleccionada(null);
                                    alert("Turno cancelado");
                                    navigate("/");
                                } else {
                                    setPasos(1);
                                }
                            }}
                        >
                            {pasos === 1 ? "Cancelar" : "Volver atrás"}
                        </button>
                        <button className="rounded-full bg-secondary px-33 py-2 font-primary"
                            onClick={() => {
                                if (pasos === 1) {
                                    if (servicioSeleccionado && profesionalSeleccionado) {
                                        setPasos(2);
                                    } else {
                                        alert(
                                            "Por favor, selecciona un servicio y un profesional."
                                        );
                                    }
                                } else {
                                    if (fechaSeleccionada && horaSeleccionada) {
                                        crearTurno();
                                        alert(
                                            `Turno confirmado con ${profesionalSeleccionado?.nombre} para el servicio ${servicioSeleccionado?.tipoDeServicio} el ${fechaSeleccionada} a las ${horaSeleccionada}`
                                        );
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
        </>
    );
};

export default Turnos;