import Navbar from "../components/Navbar"
import { CiSearch } from "react-icons/ci";
import type { CentroEsteticaResponseDTO } from "../types/centroDeEstetica/CentroEsteticaResponseDTO";
import { Estado } from "../types/enums/Estado";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoFilterCircleOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import type { ServicioResponseDTO } from "../types/servicio/ServicioResponseDTO";
import { TipoDeServicio } from "../types/enums/TipoDeServicio";

const Centros = () => {
    const centros: CentroEsteticaResponseDTO[] = [
        {
            id: 1,
            nombre: "Centro Belleza",
            descripcion: "Centro especializado en tratamientos de belleza y bienestar.",
            domicilios: [{ id: 1, calle: "Calle Falsa 123", numero: 456, codigoPostal: 12345, localidad: "Ciudad Belleza" }],
            imagen: "https://i.pinimg.com/1200x/f0/1f/11/f01f113af00d3cdd2d3d1f6f18b5ed6f.jpg",
            docValido: "https://example.com/doc-valido.pdf",
            cuit: 2131243214,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        },
        {
            id: 2,
            nombre: "Spa Relax",
            descripcion: "Spa de lujo con servicios de relajación y estética.",
            domicilios: [{ id: 2, calle: "Avenida del Spa 456", numero: 789, codigoPostal: 67890, localidad: "Ciudad Relax" }],
            imagen: "https://i.pinimg.com/1200x/f0/1f/11/f01f113af00d3cdd2d3d1f6f18b5ed6f.jpg",
            docValido: "https://example.com/doc-valido-spa.pdf",
            cuit: 2131243215,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        },
        {
            id: 3,
            nombre: "Centro Belleza",
            descripcion: "Centro especializado en tratamientos de belleza y bienestar.",
            domicilios: [{ id: 1, calle: "Calle Falsa 123", numero: 456, codigoPostal: 12345, localidad: "Ciudad Belleza" }],
            imagen: "https://i.pinimg.com/1200x/f0/1f/11/f01f113af00d3cdd2d3d1f6f18b5ed6f.jpg",
            docValido: "https://example.com/doc-valido.pdf",
            cuit: 2131243214,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        },
        {
            id: 4,
            nombre: "Spa Relax",
            descripcion: "Spa de lujo con servicios de relajación y estética.",
            domicilios: [{ id: 2, calle: "Avenida del Spa 456", numero: 789, codigoPostal: 67890, localidad: "Ciudad Relax" }],
            imagen: "https://i.pinimg.com/1200x/f0/1f/11/f01f113af00d3cdd2d3d1f6f18b5ed6f.jpg",
            docValido: "https://example.com/doc-valido-spa.pdf",
            cuit: 2131243215,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        },
        {
            id: 5,
            nombre: "Centro Belleza",
            descripcion: "Centro especializado en tratamientos de belleza y bienestar.",
            domicilios: [{ id: 1, calle: "Calle Falsa 123", numero: 456, codigoPostal: 12345, localidad: "Ciudad Belleza" }],
            imagen: "https://i.pinimg.com/1200x/f0/1f/11/f01f113af00d3cdd2d3d1f6f18b5ed6f.jpg",
            docValido: "https://example.com/doc-valido.pdf",
            cuit: 2131243214,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        },
        {
            id: 6,
            nombre: "Spa Relax",
            descripcion: "Spa de lujo con servicios de relajación y estética.",
            domicilios: [{ id: 2, calle: "Avenida del Spa 456", numero: 789, codigoPostal: 67890, localidad: "Ciudad Relax" }],
            imagen: "https://i.pinimg.com/1200x/f0/1f/11/f01f113af00d3cdd2d3d1f6f18b5ed6f.jpg",
            docValido: "https://example.com/doc-valido-spa.pdf",
            cuit: 2131243215,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        },
        {
            id: 7,
            nombre: "Centro Belleza",
            descripcion: "Centro especializado en tratamientos de belleza y bienestar.",
            domicilios: [{ id: 1, calle: "Calle Falsa 123", numero: 456, codigoPostal: 12345, localidad: "Ciudad Belleza" }],
            imagen: "https://i.pinimg.com/1200x/f0/1f/11/f01f113af00d3cdd2d3d1f6f18b5ed6f.jpg",
            docValido: "https://example.com/doc-valido.pdf",
            cuit: 2131243214,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        },
        {
            id: 8,
            nombre: "Spa Relax",
            descripcion: "Spa de lujo con servicios de relajación y estética.",
            domicilios: [{ id: 2, calle: "Avenida del Spa 456", numero: 789, codigoPostal: 67890, localidad: "Ciudad Relax" }],
            imagen: "https://i.pinimg.com/1200x/f0/1f/11/f01f113af00d3cdd2d3d1f6f18b5ed6f.jpg",
            docValido: "https://example.com/doc-valido-spa.pdf",
            cuit: 2131243215,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        },
        {
            id: 9,
            nombre: "Centro Belleza",
            descripcion: "Centro especializado en tratamientos de belleza y bienestar.",
            domicilios: [{ id: 1, calle: "Calle Falsa 123", numero: 456, codigoPostal: 12345, localidad: "Ciudad Belleza" }],
            imagen: "https://i.pinimg.com/1200x/f0/1f/11/f01f113af00d3cdd2d3d1f6f18b5ed6f.jpg",
            docValido: "https://example.com/doc-valido.pdf",
            cuit: 2131243214,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        },
        {
            id: 10,
            nombre: "Spa Relax",
            descripcion: "Spa de lujo con servicios de relajación y estética.",
            domicilios: [{ id: 2, calle: "Avenida del Spa 456", numero: 789, codigoPostal: 67890, localidad: "Ciudad Relax" }],
            imagen: "https://i.pinimg.com/1200x/f0/1f/11/f01f113af00d3cdd2d3d1f6f18b5ed6f.jpg",
            docValido: "https://example.com/doc-valido-spa.pdf",
            cuit: 2131243215,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        },
        {
            id: 11,
            nombre: "Centro Belleza",
            descripcion: "Centro especializado en tratamientos de belleza y bienestar.",
            domicilios: [{ id: 1, calle: "Calle Falsa 123", numero: 456, codigoPostal: 12345, localidad: "Ciudad Belleza" }],
            imagen: "https://i.pinimg.com/1200x/f0/1f/11/f01f113af00d3cdd2d3d1f6f18b5ed6f.jpg",
            docValido: "https://example.com/doc-valido.pdf",
            cuit: 2131243214,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        },
        {
            id: 12,
            nombre: "Spa Relax",
            descripcion: "Spa de lujo con servicios de relajación y estética.",
            domicilios: [{ id: 2, calle: "Avenida del Spa 456", numero: 789, codigoPostal: 67890, localidad: "Ciudad Relax" }],
            imagen: "https://i.pinimg.com/1200x/f0/1f/11/f01f113af00d3cdd2d3d1f6f18b5ed6f.jpg",
            docValido: "https://example.com/doc-valido-spa.pdf",
            cuit: 2131243215,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        },
        {
            id: 13,
            nombre: "Centro Belleza",
            descripcion: "Centro especializado en tratamientos de belleza y bienestar.",
            domicilios: [{ id: 1, calle: "Calle Falsa 123", numero: 456, codigoPostal: 12345, localidad: "Ciudad Belleza" }],
            imagen: "https://i.pinimg.com/1200x/f0/1f/11/f01f113af00d3cdd2d3d1f6f18b5ed6f.jpg",
            docValido: "https://example.com/doc-valido.pdf",
            cuit: 2131243214,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        },
        {
            id: 14,
            nombre: "Spa Relax",
            descripcion: "Spa de lujo con servicios de relajación y estética.",
            domicilios: [{ id: 2, calle: "Avenida del Spa 456", numero: 789, codigoPostal: 67890, localidad: "Ciudad Relax" }],
            imagen: "https://i.pinimg.com/1200x/f0/1f/11/f01f113af00d3cdd2d3d1f6f18b5ed6f.jpg",
            docValido: "https://example.com/doc-valido-spa.pdf",
            cuit: 2131243215,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        },
        {
            id: 15,
            nombre: "Centro Belleza",
            descripcion: "Centro especializado en tratamientos de belleza y bienestar.",
            domicilios: [{ id: 1, calle: "Calle Falsa 123", numero: 456, codigoPostal: 12345, localidad: "Ciudad Belleza" }],
            imagen: "https://i.pinimg.com/1200x/f0/1f/11/f01f113af00d3cdd2d3d1f6f18b5ed6f.jpg",
            docValido: "https://example.com/doc-valido.pdf",
            cuit: 2131243214,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        },
        {
            id: 16,
            nombre: "Spa Relax",
            descripcion: "Spa de lujo con servicios de relajación y estética.",
            domicilios: [{ id: 2, calle: "Avenida del Spa 456", numero: 789, codigoPostal: 67890, localidad: "Ciudad Relax" }],
            imagen: "https://i.pinimg.com/1200x/f0/1f/11/f01f113af00d3cdd2d3d1f6f18b5ed6f.jpg",
            docValido: "https://example.com/doc-valido-spa.pdf",
            cuit: 2131243215,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        }
    ];


    const [modalFiltro, setModalFiltro] = useState(false);
    const [filtro, setFiltro] = useState<string>("");

    const filtrarCentros = (filtro: string) => {
        return filtro
            ? centros.filter(centro => centro.nombre.toLowerCase().includes(filtro.toLowerCase()) || centro.domicilios.some(domicilio => domicilio.calle.toLowerCase().includes(filtro.toLowerCase())))
            : centros;
    }

    const centrosFiltrados = filtro ? filtrarCentros(filtro) : centros;

    const [paginaActual, setPaginaActual] = useState(1);
    const centrosPorPagina = 9;

    const indiceUltimoCentro = paginaActual * centrosPorPagina;
    const indicePrimerCentro = indiceUltimoCentro - centrosPorPagina;
    const centrosActuales = centrosFiltrados.slice(indicePrimerCentro, indiceUltimoCentro);

    const totalPaginas = Math.ceil(centrosFiltrados.length / centrosPorPagina);

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
                        <button className="cursor-pointer text-tertiary font-secondary font-black hover:underline">Borrar filtro</button>
                    </div>
                </div>
                <div className="mt-8 mx-5 lg:mx-[20vh]">
                    {/* <h2 className="font-secondary text-2xl font-bold">Centros cerca de ti</h2> */}
                    <div className="flex flex-wrap gap-5 mt-6">
                        {centrosActuales.length === 0 ? (
                            <p className="text-gray-600 mt-4">No se encontraron centros para tu búsqueda.</p>
                        ) : (
                            centrosActuales.map((centro) => (
                                <div key={centro.id} className="w-[22rem] shadow-md rounded-lg hover:shadow-lg transition-shadow bg-white p-3">
                                    <img src={centro.imagen} alt={centro.nombre} className="w-full h-40 object-cover rounded-md mb-4" />
                                    <h3 className="text-lg font-bold">{centro.nombre}</h3>
                                    <p className="text-gray-600">{centro.descripcion}</p>
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
                                        className="absolute right-2 text-gray-500 hover:text-gray-700"
                                    >
                                        <RxCross2 size={24} />
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold font-primary mb-4 mt-3 text-center">Filtrar Centros</h2>
                                <div className="flex justify-around mx-3 mb-4">
                                    <div>
                                        <label className="block text-sm font-primary mb-2 font-bold">Servicio</label>
                                        <select name="" id="" className="border border-secondary text-sm font-primary mb-2 px-4 py-1 rounded-full hover:bg-secondary-dark transition">
                                            {Object.values(TipoDeServicio).map((tipo) => (
                                                <option key={tipo} value={tipo}>{tipo}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mx-3 mb-4">
                                        <label className="block text-sm font-primary mb-2 font-bold">Reseña</label>
                                        <button className="border border-secondary text-sm font-primary mb-2 px-4 py-1 rounded-full hover:bg-secondary-dark transition">Mayor calificación</button>
                                    </div>
                                </div>
                                <div className="flex justify-center mx-3">
                                    <button
                                        onClick={() => { setModalFiltro(false); setPaginaActual(1); }}
                                        className="font-primary px-4 py-2 bg-secondary text-white rounded-full hover:scale-105 transition"
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