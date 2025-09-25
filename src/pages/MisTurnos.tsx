import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { CustomTable } from "../components/CustomTable";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import type { TurnoResponseDTO } from "../types/turno/TurnoResponseDTO";
import { fetchTurnosCliente } from "../redux/store/misTurnosSlice";
import { TipoDeServicio } from "../types/enums/TipoDeServicio";
import { EstadoTurno } from "../types/enums/EstadoTurno";
import { ReseniaService } from "../services/ReseniaService";
import { RxCross2 } from "react-icons/rx";
import { TurnoService } from "../services/TurnoService";

export default function MisTurnos() {
    const dispatch = useAppDispatch();
    const misTurnos = useAppSelector((state) => state.misTurnos.misTurnos);
    const user = useAppSelector((state) => state.user.user);
    const turnoService = new TurnoService();

    const [modalFiltro, setModalFiltro] = useState(false);
    const [filtroAplicado, setFiltroAplicado] = useState({
        servicio: null as TipoDeServicio | null,
        profesional: null as string | null,
        estado: null as EstadoTurno | null,
    });
    const [filtroTemporal, setFiltroTemporal] = useState({
        servicio: null as TipoDeServicio | null,
        profesional: null as string | null,
        estado: null as EstadoTurno | null,
    });

    const [resenaModalAbierto, setResenaModalAbierto] = useState(false);
    const [turnoParaResena, setTurnoParaResena] = useState<TurnoResponseDTO | null>(null);
    const [resenaForm, setResenaForm] = useState<{ puntuacion: number; comentario: string; }>({
        puntuacion: 5,
        comentario: "",
    });
    const [enviandoResena, setEnviandoResena] = useState(false);
    const [resenaError, setResenaError] = useState<string | null>(null);
    const [resenaExito, setResenaExito] = useState<string | null>(null);

    const [resenasPorCentro, setResenasPorCentro] = useState<Record<number, number>>({});


    const resenaService = useMemo(() => new ReseniaService(), []);

    const renderStars = (valor: number) => {
        const clamped = Math.max(1, Math.min(5, Math.round(valor)));
        return "★".repeat(clamped) + "☆".repeat(5 - clamped);
    };

    useEffect(() => {
        if (user?.usuario?.rol !== "CLIENTE" || !user?.id) {
            setResenasPorCentro({});
            return;
        }

        let activo = true;

        const cargarResenas = async () => {
            try {
                const todas = await resenaService.getAll();
                if (!activo) return;
                const acumulado: Record<number, number> = {};
                todas
                    .filter(resena => resena.cliente?.id === user.id && resena.centroDeEstetica?.id)
                    .forEach(resena => {
                        const centroId = resena.centroDeEstetica?.id;
                        if (centroId) {
                            acumulado[centroId] = resena.puntuacion;
                        }
                    });
                setResenasPorCentro(acumulado);
            } catch (error) {
                console.error("No se pudieron cargar las reseñas existentes", error);
            }
        };

        void cargarResenas();

        return () => {
            activo = false;
        };
    }, [resenaService, user]);

    let turnosFiltrados: TurnoResponseDTO[] = [...misTurnos];

    const abrirModalResena = (turno: TurnoResponseDTO) => {
        setTurnoParaResena(turno);
        setResenaForm({ puntuacion: 5, comentario: "" });
        setResenaError(null);
        setResenaExito(null);
        setResenaModalAbierto(true);
    };

    const cerrarModalResena = () => {
        setResenaModalAbierto(false);
        setTurnoParaResena(null);
        setResenaError(null);
        setResenaExito(null);
    };

    const handleSubmitResena = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!turnoParaResena || !user || user.usuario?.rol !== "CLIENTE") {
            setResenaError("Solo los clientes pueden dejar reseñas.");
            return;
        }

        const centroId = turnoParaResena.centroDeEstetica?.id ?? turnoParaResena.centroDeEsteticaResponseDTO?.id;

        if (!centroId) {
            setResenaError("No se pudo identificar el centro de estética.");
            return;
        }

        if (resenasPorCentro[centroId] != null) {
            setResenaError("Ya dejaste una reseña para este centro.");
            return;
        }

        if (!resenaForm.comentario.trim()) {
            setResenaError("Por favor escribí un comentario.");
            return;
        }

        try {
            setEnviandoResena(true);
            await resenaService.post({
                puntuacion: resenaForm.puntuacion,
                comentario: resenaForm.comentario.trim(),
                clienteId: user.id,
                centroDeEsteticaId: centroId,
            });
            setResenaExito("Reseña enviada con éxito.");
            setResenaError(null);
            setResenasPorCentro(prev => ({ ...prev, [centroId]: resenaForm.puntuacion }));
            if (user?.id) {
                dispatch(fetchTurnosCliente(user.id));
            }
        } catch (error) {
            setResenaError(error instanceof Error ? error.message : "No se pudo enviar la reseña.");
            setResenaExito(null);
        } finally {
            setEnviandoResena(false);
        }
    };


    if (filtroAplicado.servicio) {
        turnosFiltrados = turnosFiltrados.filter(
            turno => turno.profesionalServicio.servicio.tipoDeServicio === filtroAplicado.servicio
        );
    }

    if (filtroAplicado.profesional) {
        turnosFiltrados = turnosFiltrados.filter(
            turno =>
                `${turno.profesionalServicio.profesional.nombre} ${turno.profesionalServicio.profesional.apellido}`
                    .toLowerCase()
                    .includes(filtroAplicado.profesional?.toLocaleLowerCase() as string)

        );
    }

    if (filtroAplicado.estado) {
        turnosFiltrados = turnosFiltrados.filter(
            turno => turno.estado === filtroAplicado.estado
        );
    }

    useEffect(() => {
        if (user?.usuario?.rol === "CLIENTE" && user) {
            dispatch(fetchTurnosCliente(user.id));
        }
    }, [dispatch, user]);

    const cambiarEstado = async (id: number, estado: EstadoTurno) => {
        try {
            await turnoService.cambiarEstado(id, estado);
            dispatch(fetchTurnosCliente(user!.id))
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="bg-[#FFFBFA] min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-auto px-15 py-16">
                    {turnosFiltrados.length == 0 ? (
                        <h2 className="text-2xl md:text-3xl font-bold font-secondary text-[#703F52] text-center pt-5">No tenes turnos</h2>
                    ) : (
                        <CustomTable<TurnoResponseDTO>
                            title="Mis Turnos"
                            columns={[
                                {
                                    header: "Fecha", accessor: "fecha", render: row => {
                                        const fecha = new Date(row.fecha);
                                        return fecha.toLocaleDateString("es-AR");
                                    }
                                },
                                { header: "Hora", accessor: "hora" },
                                {
                                    header: "Servicio", accessor: "profesionalServicio", render: row =>
                                        row.profesionalServicio.servicio.tipoDeServicio.toLowerCase()
                                            .split('_')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ')
                                },
                                {
                                    header: "Profesional", accessor: "profesionalServicio", render: row =>
                                        `${row.profesionalServicio.profesional.nombre.charAt(0).toUpperCase() + row.profesionalServicio.profesional.nombre.slice(1)} 
                                    ${row.profesionalServicio.profesional.apellido.charAt(0).toUpperCase() + row.profesionalServicio.profesional.apellido.slice(1)}`
                                },
                                {
                                    header: "Estado", accessor: "estado", render: row => (
                                        <span className={row.estado === EstadoTurno.PENDIENTE ? "bg-secondary/70 text-primary py-1 px-2 rounded-full" : row.estado === EstadoTurno.CANCELADO ? "bg-red-600/45  text-primary py-1 px-2 rounded-full" : "bg-green-600/45 text-primary py-1 px-2 rounded-full"}>
                                            {row.estado.toLowerCase()
                                                .split('_')
                                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                .join(' ')}
                                        </span>
                                    )
                                },
                                {
                                    header: "Centro",
                                    accessor: "centroDeEsteticaResponseDTO",
                                    render: (row) => row.centroDeEstetica?.nombre.toLowerCase()
                                        .split('_')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(' ') ?? row.centroDeEsteticaResponseDTO?.nombre.toLowerCase()
                                            .split('_')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ') ?? "Sin centro"
                                },
                                {
                                    header: "Acciones",
                                    render: (row) => {
                                        const centroId = row.centroDeEstetica?.id ?? row.centroDeEsteticaResponseDTO?.id ?? null;
                                        const resenaRegistrada = centroId ? resenasPorCentro[centroId] ?? null : null;

                                        if (resenaRegistrada != null) {
                                            return (
                                                <span className="text-yellow-500 font-semibold" title={`${resenaRegistrada} de 5`}>
                                                    {renderStars(resenaRegistrada)}
                                                </span>
                                            );
                                        }

                                        const habilitado = user?.usuario?.rol === "CLIENTE" && row.estado === EstadoTurno.FINALIZADO;

                                        if (!habilitado) {
                                            return <span className="text-sm text-gray-400">Disponible al finalizar</span>;
                                        }

                                        return (
                                            <button
                                                onClick={() => abrirModalResena(row)}
                                                className="bg-[#C19BA8] text-white px-4 py-1 rounded-full hover:bg-[#C4A1B5] transition"
                                            >
                                                Dejar reseña
                                            </button>
                                        );
                                    }
                                },
                                {
                                    header: "",
                                    accessor: "estado",
                                    render: (row) => {
                                        const isPending = row.estado === EstadoTurno.PENDIENTE;

                                        return (
                                            <div className="flex gap-2">
                                                <button
                                                    disabled={!isPending}
                                                    className={`py-1 px-2 rounded-full text-primary transition ${isPending
                                                            ? "bg-red-600/50 hover:bg-red-600/70 hover:scale-102 cursor-pointer"
                                                            : "bg-gray-400 cursor-not-allowed"
                                                        }`}
                                                    onClick={() => isPending && cambiarEstado(row.id, EstadoTurno.CANCELADO)}
                                                >
                                                    Cancelar turno
                                                </button>
                                            </div>
                                        );
                                    }
                                }

                            ]}
                            data={turnosFiltrados.slice().reverse() ?? []}
                            borrarFiltros={{
                                onClick: () => setFiltroAplicado({ servicio: null, profesional: null, estado: null }),
                            }}
                            filtros={{
                                onClick: () => setModalFiltro(true),
                            }}
                        />
                    )}
                </main>
            </div>
            {modalFiltro && (
                <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50">
                    <div className="bg-white p-3 rounded-lg shadow-lg w-[90%] max-w-md">
                        <div className="relative">
                            <button
                                onClick={() => setModalFiltro(false)}
                                className="absolute right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                <RxCross2 size={24} />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold font-primary mb-4 mt-3 text-center">Filtrar Turnos</h2>
                        <div className="mb-4">
                            <label className="block text-md font-primary mb-2 font-bold pl-2">Tipo de Servicio</label>
                            <select
                                value={filtroTemporal.servicio ?? ""}
                                onChange={(e) => setFiltroTemporal(prev => ({
                                    ...prev,
                                    servicio: (e.target.value || null) as TipoDeServicio | null
                                }))}

                                className="w-full border border-secondary text-md font-primary px-4 py-1 rounded-full hover:bg-secondary-dark transition"
                            >
                                <option value="">Todos</option>
                                {Object.values(TipoDeServicio).map((tipo) => (
                                    <option key={tipo} value={tipo}>
                                        {tipo.toLowerCase()
                                            .split('_')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-md font-primary mb-2 font-bold pl-2">Profesional</label>
                            <input
                                type="text"
                                value={filtroTemporal.profesional ?? ""}
                                onChange={(e) => setFiltroTemporal(prev => ({ ...prev, profesional: e.target.value || null }))}
                                className="w-full border border-secondary rounded-full pl-3 font-primary text-md px-4 py-1 focus:outline-none"
                                placeholder="Nombre del profesional"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-md font-primary mb-2 font-bold pl-2">Estado</label>
                            <select
                                value={filtroTemporal.estado ?? ""}
                                onChange={(e) => setFiltroTemporal(prev => ({ ...prev, estado: e.target.value as EstadoTurno || null }))}
                                className="w-full border border-secondary text-md font-primary px-4 py-1 rounded-full hover:bg-secondary-dark transition"
                            >
                                <option value="">Todos</option>
                                {Object.values(EstadoTurno).map((estado) => (
                                    <option key={estado} value={estado}>
                                        {estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setFiltroAplicado(filtroTemporal);
                                    setModalFiltro(false);
                                }}
                                className="bg-[#C19BA8] px-4 py-2 rounded-full hover:bg-[#C4A1B5] text-white mr-2"
                            >
                                Aplicar Filtro

                            </button>
                        </div>
                    </div>
                </div>
            )}
            {resenaModalAbierto && turnoParaResena && (
                <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold font-primary text-[#703F52]">Dejar reseña</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {turnoParaResena.centroDeEstetica?.nombre ?? turnoParaResena.centroDeEsteticaResponseDTO?.nombre ?? "Centro sin nombre"}
                                </p>
                            </div>
                            <button
                                onClick={cerrarModalResena}
                                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                <RxCross2 size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitResena} className="space-y-4">
                            <div>
                                <label className="block text-md font-primary mb-2 font-bold">Puntuacion</label>
                                <select
                                    value={resenaForm.puntuacion}
                                    onChange={(e) => {
                                        setResenaForm(prev => ({ ...prev, puntuacion: Number(e.target.value) }));
                                        setResenaError(null);
                                        setResenaExito(null);
                                    }}
                                    className="w-full border border-secondary text-md font-primary px-4 py-1 rounded-full hover:bg-secondary-dark transition"
                                >
                                    {Array.from({ length: 5 }, (_, index) => index + 1).map((valor) => (
                                        <option key={valor} value={valor}>
                                            {valor}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-md font-primary mb-2 font-bold">Comentario</label>
                                <textarea
                                    value={resenaForm.comentario}
                                    onChange={(e) => {
                                        setResenaForm(prev => ({ ...prev, comentario: e.target.value }));
                                        setResenaError(null);
                                        setResenaExito(null);
                                    }}
                                    rows={4}
                                    className="w-full border border-secondary rounded-lg font-primary text-md px-4 py-2 focus:outline-none"
                                    placeholder="Contanos cómo fue tu experiencia"
                                />
                            </div>
                            {resenaError && <p className="text-sm text-red-600">{resenaError}</p>}
                            {resenaExito && <p className="text-sm text-green-600">{resenaExito}</p>}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={cerrarModalResena}
                                    className="px-4 py-2 rounded-full border border-[#C19BA8] text-[#C19BA8] hover:bg-[#C19BA8]/10"
                                >
                                    {resenaExito ? "Cerrar" : "Cancelar"}
                                </button>
                                <button
                                    type="submit"
                                    disabled={enviandoResena || Boolean(resenaExito)}
                                    className="bg-[#C19BA8] px-4 py-2 rounded-full text-white hover:bg-[#C4A1B5] disabled:opacity-60"
                                >
                                    {enviandoResena ? "Enviando..." : "Enviar reseña"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <footer className="w-full">
                <Footer />
            </footer>
        </div>
    );
}
