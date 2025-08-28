import { useEffect } from "react";
import { CustomTable } from "../components/CustomTable";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import type { TurnoResponseDTO } from "../types/turno/TurnoResponseDTO";
import { fetchTurnosCliente } from "../redux/store/turnosSlice";

export default function MisTurnos() {
    const dispatch = useAppDispatch();
    const turnos = useAppSelector((state) => state.turnos.turnos);
    const user = useAppSelector((state) => state.user.user);

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
                    />
                </main>
            </div>
            <footer className="w-full">
                <Footer />
            </footer>
        </div>
    );
}