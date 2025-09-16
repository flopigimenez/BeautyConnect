import Navbar from "../components/Navbar"
import { CiSearch } from "react-icons/ci";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoFilterCircleOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { TipoDeServicio } from "../types/enums/TipoDeServicio";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { fetchCentrosAceptados } from "../redux/store/centroSlice";
import { Estado } from "../types/enums/Estado";

const Centros = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const centros = useAppSelector((state) => state.centros.aceptados);

    useEffect(() => {
        dispatch(fetchCentrosAceptados(Estado.ACEPTADO));
    }, [dispatch]);

    //Filtros
    const [modalFiltro, setModalFiltro] = useState(false);
    const [filtroAplicado, setFiltroAplicado] = useState({
        servicio: null as TipoDeServicio | null,
        reseña: null as string | null,
    });
    const [filtroTemporal, setFiltroTemporal] = useState({
        servicio: null as TipoDeServicio | null,
        reseña: null as string | null,
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

        if (filtroAplicado.reseña === "true") {
            resultado = resultado.filter(centro => centro.resenias.length > 0);
            resultado.sort((a, b) => {
                const calificacionA = a.resenias.reduce((sum, r) => sum + r.puntuacion, 0) / a.resenias.length;
                const calificacionB = b.resenias.reduce((sum, r) => sum + r.puntuacion, 0) / b.resenias.length;
                return calificacionB - calificacionA;
            });
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

    //Paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const centrosPorPagina = 9;

    const indiceUltimoCentro = paginaActual * centrosPorPagina;
    const indicePrimerCentro = indiceUltimoCentro - centrosPorPagina;
    const centrosActuales = centrosFiltrados.slice(indicePrimerCentro, indiceUltimoCentro);

    const totalPaginas = Math.ceil(centrosFiltrados.length / centrosPorPagina);

    useEffect(() => {
        //Cada vez que cambie el filtro, reiniciar a la primera página
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
                            onClick={() => { setFiltroAplicado({ servicio: null, reseña: null }); setFiltroTemporal({ servicio: null, reseña: null }); setFiltro("") }}
                        >
                            Borrar filtro
                        </button>
                    </div>
                </div>
                <div className="mt-8 mx-5 lg:mx-[20vh]">
                    <div className="flex flex-wrap gap-5 mt-6">
                        {centrosActuales.length === 0 ? (
                            <p className="text-gray-600 mt-4">No se encontraron centros para tu búsqueda.</p>
                        ) : (
                            centrosActuales.map((centro) => (
                                <div key={centro.id} className="w-[22rem] shadow-md rounded-lg hover:shadow-lg transition-shadow bg-white p-3 cursor-pointer"
                                    onClick={() => navigate(`/turno/${centro.id}`)}
                                >
                                    <img src={centro.imagen} alt={centro.nombre} className="w-full h-40 object-cover rounded-md mb-4" />
                                    <h3 className="text-lg font-bold">{centro.nombre}</h3>
                                    <p className="text-gray-600">{centro.descripcion}</p>
                                    {centro.domicilio && (
                                        <p className="text-gray-500 text-sm mt-2">
                                            {centro.domicilio.calle} {centro.domicilio.numero}, {centro.domicilio.localidad} - CP: {centro.domicilio.codigoPostal}
                                        </p>
                                    )}
                                    {/* {centro.reseñas.length > 0 && (
                                        <p className="mt-2 text-yellow-500">
                                            {"★".repeat(Math.round(centro.reseñas.reduce((sum, r) => sum + r.calificacion, 0) / centro.reseñas.length))
                                                + "☆".repeat(5 - Math.round(centro.reseñas.reduce((sum, r) => sum + r.calificacion, 0) / centro.reseñas.length))
                                            } ({centro.reseñas.reduce((sum, r) => sum + r.calificacion, 0) / centro.reseñas.length})
                                        </p>
                                    )} */}
                                </div>
                            ))
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
                                        <label className="block text-md font-primary mb-2 font-bold pl-3">Reseña</label>
                                        <button
                                            onClick={() => { setPaginaActual(1); setFiltroTemporal(prev => ({ ...prev, reseña: prev.reseña == "true" ? null : "true" })); }}
                                            className={`border border-secondary text-sm font-primary px-4 py-1 rounded-full cursor-pointer hover:bg-secondary transition ${filtroTemporal.reseña === "true" ? "bg-secondary text-white" : ""}`}
                                        >
                                            Ordenar por reseña
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