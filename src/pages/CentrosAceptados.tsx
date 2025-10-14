import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import type { CentroDeEsteticaResponseDTO } from "../types/centroDeEstetica/CentroDeEsteticaResponseDTO";
import { Estado } from "../types/enums/Estado";
import { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";
import { Switch } from "@mui/material";
import Swal from "sweetalert2";
import { fetchCentrosPorEstado } from "../redux/store/centroSlice";
import Footer from "../components/Footer";
import { buildServiciosLabel } from "../utils/servicios";
import DescripcionColumna from "../utils/DescripcionColumna";

export default function CentrosAceptados() {
    const dispatch = useAppDispatch();
    const centros = useAppSelector((state) => state.centros.centros ?? []);
    const [busqueda, setBusqueda] = useState("");
    const centroService = new CentroDeEsteticaService();

    useEffect(() => {
        dispatch(fetchCentrosPorEstado(Estado.ACEPTADO));
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


    return (
        <div className="bg-[#FFFBFA] min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-auto mx-8 my-20">
                    <CustomTable<CentroDeEsteticaResponseDTO>
                        title="Centros Aceptados"
                        columns={[
                            {
                                header: "", accessor: "imagen", render: row => (
                                    <img src={row.imagen} alt={row.nombre} className="w-25 h-10 object-cover rounded-md" />
                                )
                            },
                            { header: "Nombre", accessor: "nombre" },
                            {
                                header: "Descripción",
                                accessor: "descripcion",
                                render: (row) => <DescripcionColumna descripcion={row.descripcion}  />,
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
                            {
                                header: "Servicios",
                                accessor: "servicios",
                                render: (row) => buildServiciosLabel(row.servicios)
                            },
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
                                header: "Acciones",
                                accessor: "active",
                                render: (centro: CentroDeEsteticaResponseDTO) => (
                                    <Switch
                                        checked={centro.active}
                                        onChange={async () => {
                                            try {
                                                await centroService.activar_desactivar(centro.id);
                                                dispatch(fetchCentrosPorEstado(Estado.ACEPTADO));
                                            } catch (error) {
                                                Swal.fire(
                                                    error instanceof Error ? error.message : String(error),
                                                    "No se pudo actualizar el estado",
                                                    "error"
                                                );
                                            }
                                        }}
                                        color="secondary"
                                    />
                                ),
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
            <Footer />
        </div>
    );
}