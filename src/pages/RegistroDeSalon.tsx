import { useState } from "react"
import { TipoDeServicio } from "../types/enums/TipoDeServicio"
import type { CentroDeEsteticaDTO } from "../types/centroDeEstetica/CentroDeEsteticaDTO";
import type { DomicilioDTO } from "../types/domicilio/DomicilioDTO";
import type { ServicioDTO } from "../types/servicio/ServicioDTO";

const RegistroDeSalon = () => {
    const [registroDeSalon, setRegistroDeSalon] = useState<CentroDeEsteticaDTO>({ id: 0, nombre: "", descripcion: "", imagen: "", docValido: "", cuit: parseInt(""), domicilios: [], servicios: [], turnos: [], reseñas: [] });
    const [direcciones, setDirecciones] = useState<DomicilioDTO>({ id: parseInt(""), calle: "", numero: parseInt(""), localidad: "", codigoPostal: parseInt("") });
    const [servicios, setServicios] = useState<ServicioDTO>();

    return (
        <>
            <div className="bg-primary w-screen pt-8 flex flex-col items-center">
                <h1 className="font-secondary text-2xl font-bold">Registra tu salón</h1>
                <form className="mt-5 w-[45rem]">
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="nombre">Nombre del salón</label>
                        <input
                            type="nombre"
                            id="nombre"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa tu nombre completo"
                            value={registroDeSalon.nombre}
                            onChange={(e) => setRegistroDeSalon(prev => ({ ...prev, nombre: e.target.value }))}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="image">Ingresa una imagen de tu salon</label>
                        <input
                            type="file"
                            accept="image/*"
                            id="image"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            value={registroDeSalon.imagen}
                            onChange={(e) => setRegistroDeSalon(prev => ({ ...prev, imagen: e.target.value }))}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="file">Debes ingresar un documento que acredite la validez du salón:</label>
                        <input
                            type="file"
                            id="file"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            value={registroDeSalon.docValido}
                            onChange={(e) => setRegistroDeSalon(prev => ({ ...prev, docValido: e.target.value }))}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="direccion">Dirección</label>
                        <input
                            type="text"
                            id="direccion"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa la dirección de tu salon"
                        // value={registroDeSalon.domicilios}
                        // onChange={(e) => setRegistroDeSalon(prev => ({...prev, domicilios: e.target.value}))}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="cuit">CUIT</label>
                        <input
                            type="number"
                            id="cuit"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa el cuit de tu negocio"
                            value={registroDeSalon.cuit}
                            onChange={(e) => setRegistroDeSalon(prev => ({ ...prev, cuit: parseInt(e.target.value) }))}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="HorarioComercial">Horario comercial</label>
                        <input
                            type="text"
                            id="HorarioComercial"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ej. Lun-Vie: 9 AM - 7 PM, Sáb: 10 AM - 6 PM"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="servicios">Servicios</label>
                        {/* <div>
                            <label className="block text-gray-700 font-primary mb-2" htmlFor="servicios">Servicios</label>
                            <select name="" id="servicios" className="border border-secondary text-sm font-primary p-1 rounded-full hover:bg-secondary-dark transition">
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

                        <div>
                            <label className="block text-gray-700 font-primary mb-2" htmlFor="DescripcionDeServicios">Descripcion de servicios</label>
                            <input
                                type="text"
                                id="DescripcionDeServicios"
                                className="w-[60vh] p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div> */}
                        <div>
                            <button className="border bg-tertiary text-white w-full px-5 py-1 rounded-lg hover:scale-102">
                                Agregar servicios
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-end mb-10">
                        <button
                            type="submit"
                            className="w-[30%] bg-secondary text-white font-bold py-2 rounded-full cursor-pointer hover:bg-[#a27e8f] transition font-secondary"
                        >
                            Enviar
                        </button>
                    </div>

                </form>
            </div>
        </>
    )
}

export default RegistroDeSalon