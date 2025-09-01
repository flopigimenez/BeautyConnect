import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import type { CentroEsteticaResponseDTO } from "../types/centroDeEstetica/CentroEsteticaResponseDTO";
import { fetchCentros } from "../redux/store/centroSlice";

export default function SolicitudDeSalones() {
    const dispatch = useAppDispatch();
    const centros = useAppSelector((state) => state.centros.centros ?? []);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        dispatch(fetchCentros());
    }, [dispatch]);

    const centrosFiltrados = centros
        .filter(centro => centro.estado === "PENDIENTE")
        .filter(centro =>
            centro.nombre?.toLowerCase().includes(busqueda.toLowerCase())
            || (centro.domicilio &&
                `${centro.domicilio.calle ?? ""} ${centro.domicilio.numero ?? ""}, ${centro.domicilio.localidad ?? ""}`
                    .toLowerCase().includes(busqueda.toLowerCase())
            )
            || (Array.isArray(centro.servicios) &&
                centro.servicios.some(servicio => servicio.tipoDeServicio.toLowerCase().includes(busqueda.toLowerCase()))
            )
        );

    return (
        <div className="bg-[#FFFBFA] min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-auto px-15 py-16">
                    <CustomTable<CentroEsteticaResponseDTO>
                        title="Solicitud de Salones"
                        columns={[
                            //{ header: "", accessor: "imagen" },
                            { header: "Nombre", accessor: "nombre" },
                            { header: "Descripción", accessor: "descripcion", render: (row) => row.descripcion ?? "Sin descripción" },
                            { header: "Cuit", accessor: "cuit" },
                            { header: "Documento", accessor: "docValido" },
                            {
                                header: "Servicios", accessor: "servicios", render: (row) =>
                                    Array.isArray(row.servicios)
                                        ? row.servicios.map(servicio => servicio.tipoDeServicio).join(", ")
                                        : "Sin servicios"
                            },
                            {
                                header: "Domicilio", accessor: "domicilio", render: (row) =>
                                    row.domicilio
                                        ? `${row.domicilio.calle ?? ""} ${row.domicilio.numero ?? ""}, ${row.domicilio.localidad ?? ""}`
                                        : "Sin domicilio"
                            },
                            {
                                header: "Estado", accessor: "estado", render: (row) =>
                                    row.estado === "PENDIENTE"
                                        ? "Pendiente"
                                        : (row.estado === "ACEPTADO"
                                            ? "Aprobado"
                                            : "Rechazado")
                            },
                            {
                                header: "Acciones", render: () => (
                                    <div className="flex gap-2">
                                        <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">Aprobar</button>
                                        <button className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600">Rechazar</button>
                                    </div>
                                )
                            },
                        ]}
                        data={centrosFiltrados}
                        busqueda={{
                            onChange: setBusqueda,
                            placeholder: "Buscar salones...",
                        }}
                    />
                </main>
            </div>
        </div>
    );
}