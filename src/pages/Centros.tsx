import Navbar from "../components/Navbar"
import { CiSearch } from "react-icons/ci";
import { useEffect, useMemo, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoFilterCircleOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { TipoDeServicio } from "../types/enums/TipoDeServicio";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { Estado } from "../types/enums/Estado";
import type { CentroDeEsteticaResponseDTO } from "../types/centroDeEstetica/CentroDeEsteticaResponseDTO";
import { ReseniaService } from "../services/ReseniaService";
import { fetchCentrosPorEstadoyActive } from "../redux/store/centroSlice";
import Swal from "sweetalert2";
import Footer from "../components/Footer";
import { FaArrowLeft } from "react-icons/fa6";


const RATING_SCALE = 5;
const FULL_STAR = "\u2605";
const EMPTY_STAR = "\u2606";

type ResenaStats = {
    promedio: number;
    cantidad: number;
};

type FiltroCentroState = {
    servicio: TipoDeServicio | null;
    resena: string | null;
    provincia: string | null;
    localidad: string | null;
};

const construirEtiquetaEstrellas = (promedio: number) => {
    const estrellasLlenas = Math.round(promedio);
    const estrellasVacias = Math.max(0, RATING_SCALE - estrellasLlenas);
    return `${FULL_STAR.repeat(estrellasLlenas)}${EMPTY_STAR.repeat(estrellasVacias)}`;
};

const Centros = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const centros = useAppSelector((state) => state.centros.centros);
    const reseniaService = useMemo(() => new ReseniaService(), []);
    const [reseniasPorCentro, setReseniasPorCentro] = useState<Record<number, ResenaStats>>({});
    const user = useAppSelector((state) => state.user.user);

    useEffect(() => {
        dispatch(fetchCentrosPorEstadoyActive({ estado: Estado.ACEPTADO, active: true }));
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
    const [filtroAplicado, setFiltroAplicado] = useState<FiltroCentroState>({
        servicio: null,
        resena: null,
        provincia: null,
        localidad: null,
    });
    const [filtroTemporal, setFiltroTemporal] = useState<FiltroCentroState>({
        servicio: null,
        resena: null,
        provincia: null,
        localidad: null,
    });
    const [filtro, setFiltro] = useState<string>("");

    const provinciasDisponibles = useMemo(() => {
        const provincias = new Set<string>();
        centros.forEach((centro) => {
            const provincia = centro.domicilio?.provincia;
            if (provincia) {
                provincias.add(provincia);
            }
        });
        return Array.from(provincias).sort((a, b) => a.localeCompare(b));
    }, [centros]);

    const localidadesDisponibles = useMemo(() => {
        const localidades = new Set<string>();
        centros.forEach((centro) => {
            const domicilio = centro.domicilio;
            if (!domicilio) {
                return;
            }
            if (filtroTemporal.provincia && domicilio.provincia !== filtroTemporal.provincia) {
                return;
            }
            if (domicilio.localidad) {
                localidades.add(domicilio.localidad);
            }
        });
        return Array.from(localidades).sort((a, b) => a.localeCompare(b));
    }, [centros, filtroTemporal.provincia]);

    const filtrarCentros = () => {
        let resultado = [...centros];

        if (filtroAplicado.servicio) {
            resultado = resultado.filter(centro =>
                centro.servicios.some(servicio =>
                    servicio.tipoDeServicio === filtroAplicado.servicio
                )
            );
        }

        if (filtroAplicado.provincia) {
            const provinciaFiltro = filtroAplicado.provincia.toLowerCase();
            resultado = resultado.filter(centro => {
                const provinciaCentro = centro.domicilio?.provincia?.toLowerCase();
                return provinciaCentro === provinciaFiltro;
            });
        }

        if (filtroAplicado.localidad) {
            const localidadFiltro = filtroAplicado.localidad.toLowerCase();
            resultado = resultado.filter(centro => {
                const localidadCentro = centro.domicilio?.localidad?.toLowerCase();
                return localidadCentro === localidadFiltro;
            });
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

    //Paginacion
    const [paginaActual, setPaginaActual] = useState(1);
    const centrosPorPagina = 9;

    const indiceUltimoCentro = paginaActual * centrosPorPagina;
    const indicePrimerCentro = indiceUltimoCentro - centrosPorPagina;
    const centrosActuales = centrosFiltrados.slice(indicePrimerCentro, indiceUltimoCentro);

    const totalPaginas = Math.ceil(centrosFiltrados.length / centrosPorPagina);

    const [modalCentro, setModalCentro] = useState(false);
    const [centroSeleccionado, setCentroSeleccionado] = useState<CentroDeEsteticaResponseDTO>();


    useEffect(() => {
        //Cada vez que cambie el filtro, reiniciar a la primera pagina
        setPaginaActual(1);
    }, [filtro, filtroAplicado]);

    return (
        <>
            <Navbar />
            <div className="bg-primary w-full pt-20 min-h-screen flex flex-col">
                <button
                    type="button"
                    onClick={() => navigate('/mapa-centros')}
                    className="flex items-center pl-5 w-50 pb-5 text-sm font-semibold text-secondary hover:text-[#a27e8f] hover:underline transition cursor-pointer"
                >
                    <FaArrowLeft /> <p className="pl-2">Ver centros en el mapa</p>
                </button>
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
                            onClick={() => { setFiltroAplicado({ servicio: null, resena: null, provincia: null, localidad: null }); setFiltroTemporal({ servicio: null, resena: null, provincia: null, localidad: null }); setFiltro(""); }}
                        >
                            Borrar filtro
                        </button>
                    </div>
                </div>
                <div className="mt-8 mx-5 lg:mx-[20vh]">
                    <div className="flex flex-wrap gap-5 mt-6">
                        {centrosActuales.length === 0 ? (
                            <p className="text-gray-600 mt-4">No se encontraron centros para tu busqueda.</p>
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
                                        <h3 className="text-lg font-bold font-primary">{centro.nombre.toLowerCase()
                                            .split('_')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ')}</h3>
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
                            className="px-4 py-2 bg-white disabled:opacity-50 cursor-pointer"
                        >
                            <IoIosArrowBack className="inline-block mr-2" />
                        </button>

                        <span className="text-gray-700">{paginaActual} de {totalPaginas}</span>

                        <button
                            onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
                            disabled={paginaActual === totalPaginas}
                            className="px-4 py-2 bg-white disabled:opacity-50 cursor-pointer"
                        >
                            <IoIosArrowForward className="inline-block ml-2" />
                        </button>
                    </div>

                    {modalCentro && centroSeleccionado && (
                        <div className="fixed inset-0 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md flex items-center justify-center z-[2000] p-4 animate-fadeIn">
                            <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md overflow-hidden transition-all duration-300">

                                <button
                                    onClick={() => setModalCentro(false)}
                                    className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 transition-colors rounded-full p-1 shadow-sm z-10 cursor-pointer"
                                >
                                    <RxCross2 size={22} />
                                </button>

                                <div className="relative">
                                    <img
                                        src={centroSeleccionado.imagen}
                                        alt={centroSeleccionado.nombre}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>

                                <div className="p-5 space-y-3 font-primary text-gray-700">
                                    <h3 className="text-2xl font-bold text-center text-secondary">
                                        {centroSeleccionado.nombre}
                                    </h3>
                                    <p><b>Descripción:</b> {centroSeleccionado.descripcion}</p>

                                    {centroSeleccionado.domicilio && (
                                        <p>
                                            <b>Domicilio:</b> {centroSeleccionado.domicilio.calle}{" "}
                                            {centroSeleccionado.domicilio.numero},{" "}
                                            {centroSeleccionado.domicilio.localidad} –{" "}
                                            CP {centroSeleccionado.domicilio.codigoPostal}
                                        </p>
                                    )}

                                    {centroSeleccionado.servicios?.length > 0 && (
                                        <p>
                                            <b>Servicios:</b>{" "}
                                            {centroSeleccionado.servicios
                                                .map((s) => s.tipoDeServicio.toLowerCase())
                                                .join(", ")}
                                        </p>
                                    )}

                                    <div className="flex justify-around mt-5">
                                        <button
                                            className="bg-gradient-to-r cursor-pointer from-secondary to-[#b38a9b] text-white rounded-full py-2 px-4 font-semibold shadow-md hover:opacity-90 transition-all"
                                            onClick={() =>
                                                navigate(`/centros/${centroSeleccionado.id}/resenias`)
                                            }
                                        >
                                            Ver reseñas
                                        </button>
                                        <button
                                            className="bg-gradient-to-r cursor-pointer from-secondary to-[#b38a9b] text-white rounded-full py-2 px-4 font-semibold shadow-md hover:opacity-90 transition-all"
                                            onClick={() => {
                                                if (user) {
                                                    navigate(`/turno/${centroSeleccionado.id}`);
                                                } else {
                                                    navigate("/IniciarSesion");
                                                    Swal.fire({
                                                        icon: "info",
                                                        title: "Debes iniciar sesión para pedir un turno",
                                                        showConfirmButton: true,
                                                        confirmButtonColor: "#a27e8f",
                                                    });
                                                }
                                            }}
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
                                <div className="flex flex-wrap justify-center gap-4 mx-3 mb-4">
                                    <div className="min-w-[45%]">
                                        <label className="block text-md font-primary mb-2 font-bold pl-2">Servicio</label>
                                        <select
                                            className="border border-secondary text-sm font-primary px-4 py-1 rounded-full hover:bg-secondary-dark transition w-full"
                                            value={filtroTemporal.servicio || ""}
                                            onChange={(e) => {
                                                setPaginaActual(1);
                                                const { value } = e.target;
                                                setFiltroTemporal(prev => ({
                                                    ...prev,
                                                    servicio: value ? value as TipoDeServicio : null,
                                                }));
                                            }}
                                        >
                                            <option value="">Seleccionar servicio</option>
                                            {Object.values(TipoDeServicio).map((tipo) => (
                                                <option key={tipo} value={tipo}>
                                                    {tipo.toLowerCase()
                                                        .split("_")
                                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                        .join(" ")}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="min-w-[45%]">
                                        <label className="block text-md font-primary mb-2 font-bold pl-2">Provincia</label>
                                        <select
                                            className="border border-secondary text-sm font-primary px-4 py-1 rounded-full hover:bg-secondary-dark transition w-full"
                                            value={filtroTemporal.provincia || ""}
                                            onChange={(e) => {
                                                setPaginaActual(1);
                                                const value = e.target.value;
                                                setFiltroTemporal(prev => ({
                                                    ...prev,
                                                    provincia: value || null,
                                                    localidad: null,
                                                }));
                                            }}
                                        >
                                            <option value="">Seleccionar provincia</option>
                                            {provinciasDisponibles.map((provincia) => (
                                                <option key={provincia} value={provincia}>
                                                    {provincia}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="min-w-[45%]">
                                        <label className="block text-md font-primary mb-2 font-bold pl-2">Localidad</label>
                                        <select
                                            className="border border-secondary text-sm font-primary px-4 py-1 rounded-full hover:bg-secondary-dark transition w-full"
                                            value={filtroTemporal.localidad || ""}
                                            onChange={(e) => {
                                                setPaginaActual(1);
                                                const value = e.target.value;
                                                setFiltroTemporal(prev => ({
                                                    ...prev,
                                                    localidad: value || null,
                                                }));
                                            }}
                                            disabled={localidadesDisponibles.length === 0}
                                        >
                                            <option value="">Seleccionar localidad</option>
                                            {localidadesDisponibles.map((localidad) => (
                                                <option key={localidad} value={localidad}>
                                                    {localidad}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col justify-end">
                                        <label className="block text-md font-primary mb-2 font-bold pl-3">Resenas</label>
                                        <button
                                            onClick={() => { setPaginaActual(1); setFiltroTemporal(prev => ({ ...prev, resena: prev.resena === "true" ? null : "true" })); }}
                                            className={`border border-secondary text-sm font-primary px-4 py-1 rounded-full cursor-pointer hover:bg-secondary transition ${filtroTemporal.resena === "true" ? "bg-secondary text-white" : ""}`}
                                        >
                                            Ordenar por resenas
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-center mx-3">
                                    <button
                                        onClick={() => { setModalFiltro(false); setPaginaActual(1); setFiltroAplicado({ ...filtroTemporal }); }}
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
            <Footer />

        </>
    )
}

export default Centros

