import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import type { TurnoResponseDTO } from "../types/turno/TurnoResponseDTO";
import { fetchTurnosCliente } from "../redux/store/turnosSlice";
import { TipoDeServicio } from "../types/enums/TipoDeServicio";
import { Estado } from "../types/enums/Estado";
import { RxCross2 } from "react-icons/rx";

export default function MisTurnos() {
    const dispatch = useAppDispatch();
    const turnos = useAppSelector((state) => state.turnos.turnos);
    const user = useAppSelector((state) => state.user.user);

    const [filtro, setFiltro] = useState("");
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

    const filtrarTurnos = () => {
        let turnosFiltrados = turnos ?? [];

        if (filtroAplicado.servicio) {
            turnosFiltrados = turnosFiltrados.filter(turno => turno.servicioResponseDTO.tipoDeServicio === filtroAplicado.servicio);
        }

        if (filtroAplicado.profesional) {
            turnosFiltrados = turnosFiltrados.filter(turno => `${turno.profesionalResponseDTO.nombre} ${turno.profesionalResponseDTO.apellido}`.toLowerCase().includes(filtroAplicado.profesional!.toLowerCase()));
        }

        if (filtroAplicado.estado) {
            turnosFiltrados = turnosFiltrados.filter(turno => turno.estado === filtroAplicado.estado);
        }

        return turnosFiltrados;
    }

    useEffect(() => {
        if (user && user.usuario.rol === "CLIENTE") {
            dispatch(fetchTurnosCliente(user.id));
        }
    }, [dispatch, user]);

    return (
        <div className="bg-[#FFFBFA] min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-auto px-6 py-16">
                    <CustomTable<TurnoResponseDTO>
                        title="Mis Turnos"
                        columns={[
                            { header: "Fecha", accessor: "fecha" },
                            { header: "Hora", accessor: "hora" },
                            { header: "Servicio", accessor: "servicioResponseDTO", render: row => row.servicioResponseDTO.tipoDeServicio },
                            { header: "Profesional", accessor: "profesionalResponseDTO", render: row => `${row.profesionalResponseDTO.nombre} ${row.profesionalResponseDTO.apellido}` },
                            { header: "Estado", accessor: "estado" },
                        ]}
                        data={turnos ?? []}
                        filtros={{
                            onClick: () => setModalFiltro(true),
                        }}
                    />
                </main>
            </div>
            {modalFiltro && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-80">
                        <div className="relative">
                            <button
                                onClick={() => setModalFiltro(false)}
                                className="absolute right-2 text-gray-500 hover:text-gray-700"
                            >
                                <RxCross2 size={24} />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold mb-4">Filtrar Turnos</h2>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Tipo de Servicio</label>
                            <select
                                value={filtroTemporal.servicio ?? ""}
                                onChange={(e) => setFiltroTemporal(prev => ({ ...prev, servicio: e.target.value as TipoDeServicio || null }))}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="">Todos</option>
                                {Object.values(TipoDeServicio).map((tipo) => (
                                    <option key={tipo} value={tipo}>{tipo}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Profesional</label>
                            <input
                                type="text"
                                value={filtroTemporal.profesional ?? ""}
                                onChange={(e) => setFiltroTemporal(prev => ({ ...prev, profesional: e.target.value || null }))}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                placeholder="Nombre del profesional"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Estado</label>
                            <select
                                value={filtroTemporal.estado ?? ""}
                                onChange={(e) => setFiltroTemporal(prev => ({ ...prev, estado: e.target.value as Estado || null }))}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="">Todos</option>
                                {Object.values(Estado).map((estado) => (
                                    <option key={estado} value={estado}>{estado}</option>
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