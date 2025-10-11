import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import type { CentroDeEsteticaResponseDTO } from "../types/centroDeEstetica/CentroDeEsteticaResponseDTO";
import { Estado } from "../types/enums/Estado";
import { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";
import { fetchCentrosPorEstado } from "../redux/store/centroSlice";
import Footer from "../components/Footer";
import Swal from "sweetalert2";

// import { RxCross2 } from "react-icons/rx";

export default function SolicitudDeSalones() {
    const dispatch = useAppDispatch();
    const centros = useAppSelector((state) => state.centros.centros ?? []);
    const [busqueda, setBusqueda] = useState("");
    const centroService = new CentroDeEsteticaService();
    const [loadingAceptar, setLoadingAceptar] = useState(false);
    const [loadingRechazar, setLoadingRechazar] = useState(false);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchCentrosPorEstado(Estado.PENDIENTE));
    }, [dispatch]);

    const centrosFiltrados = centros
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

    const cambiarEstado = async (id: number, estado: Estado) => {
        setLoadingAceptar(estado === Estado.ACEPTADO ? true : false);
        setLoadingRechazar(estado === Estado.RECHAZADO ? true : false);
        setLoadingId(id);
        try {
            await centroService.cambiarEstado(id, estado);
            dispatch(fetchCentrosPorEstado(Estado.PENDIENTE));
            if (estado == Estado.ACEPTADO) {
                Swal.fire("Se aceptó el centro")
            } else {
                Swal.fire("Se rechazó el centro")
            }
            setLoadingAceptar(false);
            setLoadingRechazar(false);
        } catch (error) {
            Swal.fire(
                error instanceof Error ? error.message : String(error),
                "No se pudo cambiar el estado",
                "error"
            );
            setLoadingAceptar(false);
            setLoadingRechazar(false);
        }
    }

    return (
        <div className="bg-[#FFFBFA] min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-auto mx-8 my-20">
                    <CustomTable<CentroDeEsteticaResponseDTO>
                        title="Solicitud de Salones"
                        columns={[
                            {
                                header: "", accessor: "imagen", render: row => (
                                    <img src={row.imagen} alt={row.nombre} className="w-13 h-13 object-cover rounded-md" />
                                )
                            },
                            { header: "Nombre", accessor: "nombre" },
                            {
                                header: "Descripción",
                                accessor: "descripcion",
                                render: (row) => {
                                    if (!row.descripcion) return "Sin descripción";

                                    const texto = row.descripcion;
                                    const isExpanded = expandedRow === row.id;
                                    const corto = texto.length > 45 ? texto.slice(0, 45) + "..." : texto;

                                    return (
                                        <div>
                                            <span>{isExpanded ? texto : corto}</span>
                                            {texto.length > 45 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setExpandedRow(isExpanded ? null : row.id)
                                                    }
                                                    className="ml-2 text-[#C19BA8] font-semibold hover:underline"
                                                >
                                                    {isExpanded ? "Ocultar" : "Ver más"}
                                                </button>
                                            )}
                                        </div>
                                    );
                                },
                            },
                            { header: "Cuit", accessor: "cuit" },
                            {
                                header: "Documento", accessor: "docValido",
                                render: (row) =>
                                    row.docValido
                                        ? <a href={row.docValido} target="_blank" rel="noopener noreferrer" className="text-tertiary underline">
                                            Ver documento
                                        </a>
                                        : "No subido"
                            },
                            // {
                            //     header: "Servicios", accessor: "servicios", render: (row) =>
                            //         Array.isArray(row.servicios)
                            //             ? row.servicios.map(servicio => servicio.tipoDeServicio).join(", ")
                            //             : "Sin servicios"
                            // },
                            {
                                header: "Domicilio", accessor: "domicilio", render: (row) =>
                                    row.domicilio
                                        ? `${row.domicilio.calle ?? ""} ${row.domicilio.numero ?? ""}, ${row.domicilio.localidad ?? ""} - CP: ${row.domicilio.codigoPostal}`
                                        : "Sin domicilio"
                            },
                            {
                                header: "Estado", accessor: "estado", render: row => (
                                    // <span className={row.estado === Estado.PENDIENTE ? "bg-secondary/70 text-primary py-1 px-2 rounded-full" : row.estado === Estado.ACEPTADO ? "bg-green-600/45 text-primary py-1 px-2 rounded-full" : "bg-red-600/45  text-primary py-1 px-2 rounded-full"}>
                                    <span className="bg-secondary/70 text-primary py-1 px-1 rounded-full">
                                        {row.estado.toLowerCase()
                                            .split('_')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ')}
                                    </span>
                                )
                            },
                            {
                                header: "Acciones", render: (row) => (
                                    <div className="flex gap-2">
                                        <button className="bg-green-600/50 text-primary py-1 px-2 rounded-full hover:bg-green-600/70 hover:scale-102 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={loadingAceptar || loadingRechazar}
                                            onClick={() => cambiarEstado(row.id, Estado.ACEPTADO)}
                                        >
                                            {loadingAceptar && loadingId === row.id && Estado.ACEPTADO ? "Aprobando..." : "Aprobar"}
                                        </button>
                                        <button className="bg-red-600/50  text-primary py-1 px-2 rounded-full hover:bg-red-600/70 hover:scale-102 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={loadingAceptar || loadingRechazar}
                                            onClick={() => cambiarEstado(row.id, Estado.RECHAZADO)}
                                        >
                                            {loadingRechazar && loadingId === row.id && Estado.RECHAZADO ? "Rechazando..." : "Rechazar"}
                                        </button>
                                    </div>
                                )
                            },
                            // {
                            //     header: "Ver más", render: (row) => (
                            //         <div>
                            //             <button className="border border-tertiary text-tertiary py-1 px-2 rounded-full hover:bg-tertiary hover:text-white hover:scale-102"
                            //                 onClick={() => setVerMas(true)}
                            //             >
                            //                 Ver
                            //             </button>
                            //         </div>

                            //     )
                            // }
                        ]}
                        data={centrosFiltrados}
                        busqueda={{
                            onChange: setBusqueda,
                            placeholder: "Buscar salones...",
                        }}

                    />
                </main>
            </div>
            <Footer />
        </div>
    );
}