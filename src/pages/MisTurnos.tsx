import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import type { TurnoResponseDTO } from "../types/turno/TurnoResponseDTO";
import { fetchTurnosCliente } from "../redux/store/misTurnosSlice";
import { TipoDeServicio } from "../types/enums/TipoDeServicio";
import { Estado } from "../types/enums/Estado";
import { RxCross2 } from "react-icons/rx";

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
        if (user?.usuario?.rol === "CLIENTE" && user) {
            dispatch(fetchTurnosCliente(user.id));
            console.log(user.nombre);
        }
    }, [dispatch, user]);

    return (
        <div className="bg-[#FFFBFA] min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-auto px-15 py-16">
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
                            }
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