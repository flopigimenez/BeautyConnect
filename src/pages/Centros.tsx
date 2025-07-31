import Navbar from "../components/Navbar"
import { CiSearch } from "react-icons/ci";
import type { CentroEsteticaResponseDTO } from "../types/centroDeEstetica/CentroEsteticaResponseDTO";
import { Estado } from "../types/enums/Estado";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Centros = () => {
    const centros: CentroEsteticaResponseDTO[] = [
        {
            id: 1,
            nombre: "Centro Belleza",
            descripcion: "Centro especializado en tratamientos de belleza y bienestar.",
            domicilios: [{ id: 1, calle: "Calle Falsa 123", numero: 456, codigoPostal: 12345, localidad: "Ciudad Belleza" }],
            imagen: "https://example.com/centro-belleza.jpg",
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
            imagen: "https://example.com/spa-relax.jpg",
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
            imagen: "https://example.com/centro-belleza.jpg",
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
            imagen: "https://example.com/spa-relax.jpg",
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
            imagen: "https://example.com/centro-belleza.jpg",
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
            imagen: "https://example.com/spa-relax.jpg",
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
            imagen: "https://example.com/centro-belleza.jpg",
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
            imagen: "https://example.com/spa-relax.jpg",
            docValido: "https://example.com/doc-valido-spa.pdf",
            cuit: 2131243215,
            servicios: [],
            turnos: [],
            reseñas: [],
            estado: Estado.CONFIRMADO
        }
    ];

    const [paginaActual, setPaginaActual] = useState(1);
    const centrosPorPagina = 6;

    const indiceUltimoCentro = paginaActual * centrosPorPagina;
    const indicePrimerCentro = indiceUltimoCentro - centrosPorPagina;
    const centrosActuales = centros.slice(indicePrimerCentro, indiceUltimoCentro);

    const totalPaginas = Math.ceil(centros.length / centrosPorPagina);

    return (
        <>
            <Navbar />
            <div className="bg-primary w-full pt-25 overflow-x-hidden">
                <h1 className="font-secondary text-2xl font-bold text-center">Centros de Belleza</h1>
                <div className="flex flex-col justify-center items-center">
                    <div className="relative w-[50rem] mt-5">
                        <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input type="search" placeholder="Buscar centros o servicios" className="bg-gray-100 w-full h-10 rounded-md pl-10 font-primary focus:outline-none focus:ring-2 focus:ring-secondary" /> {/* onChange={} */}
                    </div>
                    <div className="flex gap-35 mt-10">
                        <button className="bg-gray-100 rounded-full px-8 py-1 cursor-pointer">Servicios</button>
                        <button className="bg-gray-100 rounded-full px-8 py-1 cursor-pointer">Ubicación</button>
                        <button className="bg-gray-100 rounded-full px-8 py-1 cursor-pointer">Fecha</button>
                    </div>
                </div>
                <div className="mt-8 mx-[20vh]">
                    <h2 className="font-secondary text-2xl font-bold">Centros cerca de ti</h2>
                    <div className="flex flex-wrap gap-5 mt-6">
                        {centrosActuales.map((centro) => (
                            <div key={centro.id} className="w-[22rem] shadow-md rounded-lg hover:shadow-lg transition-shadow bg-white p-3">
                                <img src={centro.imagen} alt={centro.nombre} className="w-full h-40 object-cover rounded-md mb-4" />
                                <h3 className="text-lg font-bold">{centro.nombre}</h3>
                                <p className="text-gray-600">{centro.descripcion}</p>
                            </div>
                        ))}
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
                </div>
            </div>

        </>
    )
}

export default Centros