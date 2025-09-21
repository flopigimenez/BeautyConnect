import Navbar from "../components/Navbar"
import { CiSearch } from "react-icons/ci";
import { useEffect, useMemo, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoFilterCircleOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { TipoDeServicio } from "../types/enums/TipoDeServicio";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { fetchCentrosAceptados } from "../redux/store/centroSlice";
import { Estado } from "../types/enums/Estado";
import type { CentroEsteticaResponseDTO } from "../types/centroDeEstetica/CentroDeEsteticaResponseDTO";
import { ReseniaService } from "../services/ReseniaService";

const RATING_SCALE = 5;
const FULL_STAR = "\u2605";
const EMPTY_STAR = "\u2606";

type ResenaStats = {
    promedio: number;
    cantidad: number;
};

const construirEtiquetaEstrellas = (promedio: number) => {
    const estrellasLlenas = Math.round(promedio);
    const estrellasVacias = Math.max(0, RATING_SCALE - estrellasLlenas);
    return `${FULL_STAR.repeat(estrellasLlenas)}${EMPTY_STAR.repeat(estrellasVacias)}`;
};

const Centros = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const centros = useAppSelector((state) => state.centros.aceptados);
    const reseniaService = useMemo(() => new ReseniaService(), []);
    const [reseniasPorCentro, setReseniasPorCentro] = useState<Record<number, ResenaStats>>({});

    useEffect(() => {
        dispatch(fetchCentrosAceptados(Estado.ACEPTADO));
    }, [dispatch]);

    useEffect(() => {
        let cancelado = false;

        const cargarResenias = async () => {
            if (centros.length === 0) {
                if (!cancelado) {
                    setReseniasPorCentro({});
                }
                return;
            }

            try {
                const entries = await Promise.all(
                    centros.map(async (centro) => {
                        try {
                            const resenias = await reseniaService.getReseniasByCentroId(centro.id);
                            if (resenias.length === 0) {
                                return [centro.id, { promedio: 0, cantidad: 0 }] as const;
                            }
                            const total = resenias.reduce((sum, { puntuacion }) => sum + puntuacion, 0);
                            return [centro.id, { promedio: total / resenias.length, cantidad: resenias.length }] as const;
                        } catch (error) {
                            console.error(`Error al obtener resenas del centro ${centro.id}`, error);
                            return [centro.id, { promedio: 0, cantidad: 0 }] as const;
                        }
                    })
                );

                if (!cancelado) {
                    const stats: Record<number, ResenaStats> = {};
                    for (const [id, info] of entries) {
                        stats[id] = info;
                    }
                    setReseniasPorCentro(stats);
                }
            } catch (error) {
                if (!cancelado) {
                    console.error("Error al cargar resenas de centros", error);
                }
            }
        };

        void cargarResenias();

        return () => {
            cancelado = true;
        };
    }, [centros, reseniaService]);
    //Filtros
    const [modalFiltro, setModalFiltro] = useState(false);
    const [filtroAplicado, setFiltroAplicado] = useState({
        servicio: null as TipoDeServicio | null,
        resena: null as string | null,
    });
    const [filtroTemporal, setFiltroTemporal] = useState({
        servicio: null as TipoDeServicio | null,
        resena: null as string | null,
    });
    const [filtro, setFiltro] = useState<string>("");

    const filtrarCentros = () => {
        let resultado = [...centros];

        if (filtroAplicado.servicio) {
            resultado = resultado.filter(centro =>
                centro.servicios.some(servicio =>
                    servicio.tipoDeServicio === filtroAplicado.servicio
                )
            );
        }

        if (filtroAplicado.resena === "true") {
            resultado = resultado
                .filter((centro) => (reseniasPorCentro[centro.id]?.cantidad ?? 0) > 0)
                .sort((a, b) => (reseniasPorCentro[b.id]?.promedio ?? 0) - (reseniasPorCentro[a.id]?.promedio ?? 0));
        }

        if (filtro.trim() !== "") {
            const filtroLower = filtro.toLowerCase();
            resultado = resultado.filter(centro =>
                centro.nombre.toLowerCase().includes(filtroLower)
                || (
                    centro.domicilio &&
                    (
                        `${centro.domicilio.calle} ${centro.domicilio.numero}, ${centro.domicilio.localidad}`
                            .toLowerCase()
                            .includes(filtroLower)
                    )
                )
            );
        }

        return resultado;
    };

    const centrosFiltrados = filtrarCentros();

    //Paginaci�n
    const [paginaActual, setPaginaActual] = useState(1);
    const centrosPorPagina = 9;

    const indiceUltimoCentro = paginaActual * centrosPorPagina;
    const indicePrimerCentro = indiceUltimoCentro - centrosPorPagina;
    const centrosActuales = centrosFiltrados.slice(indicePrimerCentro, indiceUltimoCentro);

    const totalPaginas = Math.ceil(centrosFiltrados.length / centrosPorPagina);

    const [modalCentro, setModalCentro] = useState(false);
    const [centroSeleccionado, setCentroSeleccionado] = useState<CentroEsteticaResponseDTO>();


    useEffect(() => {
        //Cada vez que cambie el filtro, reiniciar a la primera p�gina
        setPaginaActual(1);
    }, [filtro, filtroAplicado]);

    return (
        <>
            <Navbar />
            <div className="bg-primary w-full pt-25">
                <h1 className="font-secondary text-2xl font-bold text-center mb-5">Centros de Belleza</h1>
                <div className="flex-wrap justify-center items-center px-[5vh] md:flex md:justify-around md:px-[10vh]">
                    <div className="relative md:w-[55%] mt-5">
                        <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input type="search" placeholder="Buscar por nombre o direccion..." value={filtro}
                            className="bg-gray-100 w-full h-10 rounded-full pl-10 font-primary focus:outline-none focus:ring-2 focus:ring-secondary"
                            onChange={(e) => { setPaginaActual(1); setFiltro(e.target.value); }} />
                    </div>
                    <div className="flex justify-center gap-5 md:pr-[15vh] mt-5">
                        <button className="cursor-pointer text-tertiary" onClick={() => setModalFiltro(true)}><IoFilterCircleOutline size={40} /></button>
                        <button className="cursor-pointer text-tertiary font-secondary font-black hover:underline"
                            onClick={() => { setFiltroAplicado({ servicio: null, resena: null }); setFiltroTemporal({ servicio: null, resena: null }); setFiltro("") }}
                        >
                            Borrar filtro
                        </button>
                    </div>
                </div>
                <div className="mt-8 mx-5 lg:mx-[20vh]">
                    <div className="flex flex-wrap gap-5 mt-6">
                        {centrosActuales.length === 0 ? (
                            <p className="text-gray-600 mt-4">No se encontraron centros para tu b�squeda.</p>
                        ) : (
                            centrosActuales.map((centro) => {
                                const stats = reseniasPorCentro[centro.id];
                                const promedioResenias = stats?.promedio ?? 0;
                                const cantidadResenias = stats?.cantidad ?? 0;

                                return (
                                    <div key={centro.id} className="w-[22rem] shadow-md rounded-lg hover:shadow-lg transition-shadow bg-white p-3 cursor-pointer"
                                        // onClick={() => navigate(`/turno/${centro.id}`)}
                                        onClick={() => {
                                            setCentroSeleccionado(centro);
                                            setModalCentro(true);
                                        }}

                                    >
                                        <img src={centro.imagen} alt={centro.nombre} className="w-full h-40 object-cover rounded-md mb-4" />
                                        <h3 className="text-lg font-bold font-primary">{centro.nombre}</h3>
                                        <p className="text-gray-600 font-primary">{centro.descripcion}</p>
                                        {cantidadResenias > 0 && (
                                            <p className="mt-2 text-tertiary font-primary">
                                                {construirEtiquetaEstrellas(promedioResenias)} ({promedioResenias.toFixed(1)})
                                            </p>
                                        )}

                                    </div>
                                );
                            })
                        )}

                    </div>
                    <div className="flex justify-center items-center gap-4 mt-6 mb-5">
                        <button
                            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                            disabled={paginaActual === 1}
                            className="px-4 py-2 bg-white disabled:opacity-50"
                        >
                            <IoIosArrowBack className="inline-block mr-2" />
                        </button>

                        <span className="text-gray-700">{paginaActual} de {totalPaginas}</span>

                        <button
                            onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
                            disabled={paginaActual === totalPaginas}
                            className="px-4 py-2 bg-white disabled:opacity-50"
                        >
                            <IoIosArrowForward className="inline-block ml-2" />
                        </button>
                    </div>

                    {modalCentro && centroSeleccionado && (
                        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white px-4 py-3 rounded-lg shadow-lg w-[90%] max-w-md">
                                <div className="relative">
                                    <button
                                        onClick={() => setModalCentro(false)}
                                        className="absolute right-2 text-gray-500 hover:text-gray-700"
                                    >
                                        <RxCross2 size={24} />
                                    </button>

                                    <h3 className="text-lg font-bold mb-3 font-primary text-center">{centroSeleccionado.nombre}</h3>
                                    <img src={centroSeleccionado.imagen} alt={centroSeleccionado.nombre} className="w-full h-50 object-cover rounded-md mb-4" />
                                    <div className="">
                                        <p className="text-gray-600 font-primary"><b>Descripción:</b> {centroSeleccionado.descripcion}</p>
                                        {centroSeleccionado.domicilio && (
                                            <p className="text-gray-600 font-primary">
                                               <b>Domicilio:</b> {centroSeleccionado.domicilio.calle} {centroSeleccionado.domicilio.numero}, {centroSeleccionado.domicilio.localidad} - CP: {centroSeleccionado.domicilio.codigoPostal}
                                            </p>
                                        )}
                                        <div>
                                            <p className="text-gray-600 font-primary"><b>Servicios:</b> {centroSeleccionado.servicios.map(servicio => servicio.tipoDeServicio.toLowerCase()).join(", ")}</p>
                                        </div>

                                           
                                    </div>
                                    <div className="flex justify-around mt-3 mb-2">
                                        <button className="bg-secondary text-white rounded-full cursor-pointer py-1 px-3 hover:bg-[#a27e8f]"
                                            onClick={() => navigate(`/centros/${centroSeleccionado.id}/resenias`)}
                                        >
                                            Ver reseñas
                                        </button>
                                        <button className="bg-secondary text-white rounded-full cursor-pointer py-1 px-3 hover:bg-[#a27e8f]"
                                            onClick={() => navigate(`/turno/${centroSeleccionado.id}`)}
                                        >
                                            Pedir turno
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                    {modalFiltro && (
                        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white p-3 rounded-lg shadow-lg w-[90%] max-w-md">
                                <div className="relative">
                                    <button
                                        onClick={() => setModalFiltro(false)}
                                        className="absolute right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    >
                                        <RxCross2 size={24} />
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold font-primary mb-4 mt-3 text-center">Filtrar Centros</h2>
                                <div className="flex justify-around mx-3 mb-4">
                                    <div>
                                        <label className="block text-md font-primary mb-2 font-bold pl-2">Servicio</label>
                                        <select
                                            className="border border-secondary text-sm font-primary px-4 py-1 rounded-full hover:bg-secondary-dark transition"
                                            value={filtroTemporal.servicio || ""}
                                            onChange={(e) => { setPaginaActual(1); setFiltroTemporal(prev => ({ ...prev, servicio: e.target.value as TipoDeServicio })); }}
                                        >
                                            <option value="">Seleccionar servicio</option>
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

                                    <div className="mx-3 mb-4">
                                        <label className="block text-md font-primary mb-2 font-bold pl-3">Reseñas</label>
                                        <button
                                            onClick={() => { setPaginaActual(1); setFiltroTemporal(prev => ({ ...prev, resena: prev.resena == "true" ? null : "true" })); }}
                                            className={`border border-secondary text-sm font-primary px-4 py-1 rounded-full cursor-pointer hover:bg-secondary transition ${filtroTemporal.resena === "true" ? "bg-secondary text-white" : ""}`}
                                        >
                                            Ordenar por reseñas
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-center mx-3">
                                    <button
                                        onClick={() => { setModalFiltro(false); setPaginaActual(1); setFiltroAplicado(filtroTemporal); }}
                                        className="font-primary text-md px-4 py-1 mb-3 bg-secondary text-white rounded-full hover:scale-105 transition cursor-pointer"
                                    >
                                        Aplicar Filtro
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </>
    )
}

export default Centros

