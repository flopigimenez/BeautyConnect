import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import type { CentroEsteticaResponseDTO } from "../types/centroDeEstetica/CentroDeEsteticaResponseDTO";
import { Estado } from "../types/enums/Estado";
import { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";
import { fetchCentrosPorEstado } from "../redux/store/centroSlice";
import Footer from "../components/Footer";

// import { RxCross2 } from "react-icons/rx";

export default function SolicitudDeSalones() {
    const dispatch = useAppDispatch();
    const centros = useAppSelector((state) => state.centros.centros ?? []);
    const [busqueda, setBusqueda] = useState("");
    const centroService = new CentroDeEsteticaService();
    // const [verMas, setVerMas] = useState<boolean>(false);

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
        try {
            await centroService.cambiarEstado(id, estado);
            dispatch(fetchCentrosPorEstado(Estado.PENDIENTE));
            if (estado == Estado.ACEPTADO) {
                alert("Se aceptó el centro")
            } else {
                alert("Se rechazó el centro")
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="bg-[#FFFBFA] min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-auto mx-8 my-20">
                    <CustomTable<CentroEsteticaResponseDTO>
                        title="Solicitud de Salones"
                        columns={[
                            {
                                header: "", accessor: "imagen", render: row => (
                                    <img src={row.imagen} alt={row.nombre} className="w-13 h-13 object-cover rounded-md" />
                                )
                            },
                            { header: "Nombre", accessor: "nombre" },
                            {
                                header: "Descripción", accessor: "descripcion", render: (row) =>
                                    row.descripcion
                                        ? (row.descripcion.length > 50
                                            ? row.descripcion.slice(0, 50) + "..."
                                            : row.descripcion)
                                        : "Sin descripción"
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
                                        <button className="bg-green-600/50 text-primary py-1 px-2 rounded-full hover:bg-green-600/70 hover:scale-102"
                                            onClick={() => cambiarEstado(row.id, Estado.ACEPTADO)}
                                        >
                                            Aprobar
                                        </button>
                                        <button className="bg-red-600/50  text-primary py-1 px-2 rounded-full hover:bg-red-600/70 hover:scale-102"
                                            onClick={() => cambiarEstado(row.id, Estado.RECHAZADO)}
                                        >
                                            Rechazar
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