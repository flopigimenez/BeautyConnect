import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import type { TurnoResponseDTO } from "../types/turno/TurnoResponseDTO";
import type { ClienteResponseDTO } from "../types/cliente/ClienteResponseDTO";
import { fetchTurnosCliente } from "../redux/store/misTurnosSlice";
import { ClienteService } from "../services/ClienteService";
import { setUser } from "../redux/store/authSlice";
import { TipoDeServicio } from "../types/enums/TipoDeServicio";
import { Estado } from "../types/enums/Estado";
import { RxCross2 } from "react-icons/rx";

const clienteService = new ClienteService();

export default function MisTurnos() {
    const dispatch = useAppDispatch();
    const misTurnos = useAppSelector((state) => state.misTurnos.misTurnos);
    const user = useAppSelector((state) => state.user.user);

    const [modalFiltro, setModalFiltro] = useState(false);
    const [filtroAplicado, setFiltroAplicado] = useState({
        servicio: null as TipoDeServicio | null,
        profesional: null as string | null,
        estado: null as Estado | null,
    });
    const [filtroTemporal, setFiltroTemporal] = useState({
        servicio: null as TipoDeServicio | null,
        profesional: null as string | null,
        estado: null as Estado | null,
    });
    const [clienteInfo, setClienteInfo] = useState<ClienteResponseDTO | null>(null);
    const [loadingClienteInfo, setLoadingClienteInfo] = useState(false);
    const [errorClienteInfo, setErrorClienteInfo] = useState<string | null>(null);

    let turnosFiltrados: TurnoResponseDTO[] = [...misTurnos];

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
        let active = true;

        const hydrateCliente = async () => {
            if (!user) {
                if (active) {
                    setClienteInfo(null);
                    setErrorClienteInfo(null);
                    setLoadingClienteInfo(false);
                }
                return;
            }

            if ((user as ClienteResponseDTO).id) {
                if (active) {
                    setClienteInfo(user as ClienteResponseDTO);
                    setErrorClienteInfo(null);
                    setLoadingClienteInfo(false);
                }
                return;
            }

            const uid = (user as { uid?: string }).uid;
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
            } catch (e: any) {
                if (!active) return;
                setClienteInfo(null);
                setErrorClienteInfo(e?.message ?? "No se pudo cargar la información del cliente");
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
    }, [user, dispatch]);

    useEffect(() => {
        if (clienteInfo?.id) {
            dispatch(fetchTurnosCliente(clienteInfo.id));
        }
    }, [dispatch, clienteInfo?.id]);
    console.log(misTurnos);

    return (
        <div className="bg-[#FFFBFA] min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-auto px-15 py-16">
                    {loadingClienteInfo && (
                        <p className="font-primary text-sm mb-4">Cargando información del cliente...</p>
                    )}
                    {!loadingClienteInfo && errorClienteInfo && (
                        <p className="font-primary text-sm text-red-600 mb-4">{errorClienteInfo}</p>
                    )}
                    {!loadingClienteInfo && !clienteInfo && !errorClienteInfo && (
                        <p className="font-primary text-sm text-gray-600 mb-4">No pudimos obtener tus datos de cliente. Intenta recargar la página.</p>
                    )}
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
                                    <span className={row.estado === Estado.PENDIENTE ? "bg-secondary/70 text-primary py-1 px-2 rounded-full" : row.estado === Estado.ACEPTADO ? "bg-green-600/45 text-primary py-1 px-2 rounded-full" : "bg-red-600/45  text-primary py-1 px-2 rounded-full"}>
                                        {row.estado.toLowerCase()
                                            .split('_')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ')}
                                    </span>
                                )
                            },
                            { header: "Centro", accessor: "centroDeEsteticaResponseDTO", render: row => row.centroDeEsteticaResponseDTO?.nombre ?? "-" }
                        ]}
                        data={turnosFiltrados ?? []}
                        borrarFiltros={{
                            onClick: () => setFiltroAplicado({ servicio: null, profesional: null, estado: null }),
                        }}
                        filtros={{
                            onClick: () => setModalFiltro(true),
                        }}
                    />
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
                                onChange={(e) => setFiltroTemporal(prev => ({ ...prev, servicio: e.target.value as TipoDeServicio || null }))}
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
                                onChange={(e) => setFiltroTemporal(prev => ({ ...prev, estado: e.target.value as Estado || null }))}
                                className="w-full border border-secondary text-md font-primary px-4 py-1 rounded-full hover:bg-secondary-dark transition"
                            >
                                <option value="">Todos</option>
                                {Object.values(Estado).map((estado) => (
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
            <footer className="w-full">
                <Footer />
            </footer>
        </div>
    );
}