import { useState } from "react"
import type { CentroDeEsteticaDTO } from "../types/centroDeEstetica/CentroDeEsteticaDTO";
import type { DomicilioDTO } from "../types/domicilio/DomicilioDTO";
import type { HorarioCentroDTO } from "../types/horarioCentro/HorarioCentroDTO";
import type { ServicioDTO } from "../types/servicio/ServicioDTO";

const RegistroDeSalon = () => {
    const [domicilio, setDomicilio] = useState<DomicilioDTO>({ calle: "", numero: parseInt(""), localidad: "", codigoPostal: parseInt("") });
    const [horarioCentro, setHorarioCentro] = useState<HorarioCentroDTO>({ diaDesde: "", diaHasta: "", horaInicio: "", horaFinalizacion: "" });
    //const [servicio, setServicio] = useState<ServicioDTO[]>();
    const [registroDeSalon, setRegistroDeSalon] = useState<CentroDeEsteticaDTO>({
        id: 0,
        nombre: "",
        descripcion: "",
        imagen: "",
        docValido: "",
        cuit: parseInt(""),
        domicilio: domicilio,
        servicios: [],
        profesionales: [],
        horarioCentro: horarioCentro,
    });

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
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="direccion">Direccion</label>
                        <div className="flex gap-2 mb-5">
                            <div className="w-[50%]">
                                <label className="block text-gray-400 font-primary text-sm mb-1 pl-1" htmlFor="calle">Calle</label>
                                <input
                                    type="text"
                                    id="direccion"
                                    className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Calle"
                                    value={domicilio.calle}
                                    onChange={(e) => setDomicilio(prev => ({ ...prev, calle: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="w-[50%]">
                                <label className="block text-gray-400 font-primary text-sm mb-1 pl-1" htmlFor="numero">Numero</label>
                                <input
                                    type="number"
                                    id="numero"
                                    className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Número"
                                    value={domicilio.numero}
                                    onChange={(e) => setDomicilio(prev => ({ ...prev, numero: parseInt(e.target.value) }))}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-[50%]">
                                <label className="block text-gray-400 font-primary text-sm mb-1 pl-1" htmlFor="localidad">Localidad</label>
                                <input
                                    type="text"
                                    id="localidad"
                                    className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Localidad"
                                    value={domicilio.localidad}
                                    onChange={(e) => setDomicilio(prev => ({ ...prev, localidad: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="w-[50%]">
                                <label className="block text-gray-400 font-primary text-sm mb-1 pl-1" htmlFor="codigoPostal">Código postal</label>
                                <input
                                    type="number"
                                    id="codigoPostal"
                                    className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Código postal"
                                    value={domicilio.codigoPostal}
                                    onChange={(e) => setDomicilio(prev => ({ ...prev, codigoPostal: parseInt(e.target.value) }))}
                                    required
                                />
                            </div>
                        </div>
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
                        <div className="flex gap-2 mb-5">
                            <div className="w-[50%]">
                                <label className="block text-gray-400 font-primary text-sm mb-1 pl-1" htmlFor="diaDesde">Día desde</label>
                                <input
                                    type="text"
                                    id="diaDesde"
                                    className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Día desde"
                                    value={horarioCentro.diaDesde}
                                    onChange={(e) => setHorarioCentro(prev => ({ ...prev, diaDesde: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="w-[50%]">
                                <label className="block text-gray-400 font-primary text-sm mb-1 pl-1" htmlFor="diaHasta">Día hasta</label>
                                <input
                                    type="text"
                                    id="diaHasta"
                                    className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Día hasta"
                                    value={horarioCentro.diaHasta}
                                    onChange={(e) => setHorarioCentro(prev => ({ ...prev, diaHasta: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-[50%]">
                                <label className="block text-gray-400 font-primary text-sm mb-1 pl-1" htmlFor="horaInicio">Hora inicio</label>
                                <input
                                    type="text"
                                    id="horaInicio"
                                    className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Hora inicio"
                                    value={horarioCentro.horaInicio}
                                    onChange={(e) => setHorarioCentro(prev => ({ ...prev, horaInicio: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="w-[50%]">
                                <label className="block text-gray-400 font-primary text-sm mb-1 pl-1" htmlFor="horaFin">Hora finalizacion</label>
                                <input
                                    type="text"
                                    id="horaFin"
                                    className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Hora finalizacion"
                                    value={horarioCentro.horaFinalizacion}
                                    onChange={(e) => setHorarioCentro(prev => ({ ...prev, horaFinalizacion: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>
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
                            <button className="border bg-tertiary text-white w-[60%] px-5 py-1 rounded-lg hover:scale-102">
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