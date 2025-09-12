import { useEffect, useRef, useState } from "react"
import { TipoDeServicio } from "../types/enums/TipoDeServicio"
import type { CentroDeEsteticaDTO } from "../types/centroDeEstetica/CentroDeEsteticaDTO";
import type { DomicilioDTO } from "../types/domicilio/DomicilioDTO";
import type { HorarioCentroDTO } from "../types/horarioCentro/HorarioCentroDTO";
import Swal from "sweetalert2";
import { RxCross2 } from "react-icons/rx";
import type { ServicioDTOSimple } from "../types/servicio/ServicioDTOSimple";
import { FaTrashAlt } from "react-icons/fa";
import { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const RegistroDeSalon = () => {
    const [domicilio, setDomicilio] = useState<DomicilioDTO>({ calle: "", numero: parseInt(""), localidad: "", codigoPostal: parseInt("") });
    const [horarioCentro, setHorarioCentro] = useState<HorarioCentroDTO>({ diaDesde: "", diaHasta: "", horaInicio: "", horaFinalizacion: "" });
    const [nuevoServicio, setNuevoServicio] = useState<ServicioDTOSimple>({
        tipoDeServicio: TipoDeServicio.PELUQUERIA,
        precio: parseInt(""),
    });
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [registroDeSalon, setRegistroDeSalon] = useState<CentroDeEsteticaDTO>({
        id: 0,
        nombre: "",
        descripcion: "",
        imagen: imageUrl!,
        docValido: "",
        cuit: parseInt(""),
        domicilio: domicilio,
        servicios: [],
        profesionales: [],
        horarioCentro: horarioCentro,
    });
    // const [agregarServicios, setAgregarServicios] = useState<boolean>();
    const centroService = new CentroDeEsteticaService();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file || !cloudName || !uploadPreset) {
            throw new Error("Cloudinary config missing");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset!);

        const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await resp.json();
        setImageUrl(data.secure_url);
    };

    const handleEliminarServicio = (index: number) => {
        setRegistroDeSalon((prev) => ({
            ...prev,
            servicios: prev.servicios.filter((_, i) => i !== index),
        }));
    };

    const handleRegistrarSalon = async () => {
        try {
            await centroService.post(registroDeSalon);
            alert("Centro registrado");
        } catch (error) {
            alert("Error al registrar");
        }
    }

    return (
        <>
            <div className="bg-primary w-screen pt-8 flex flex-col items-center">
                <h1 className="font-secondary text-2xl font-bold">Registra tu salón</h1>
                <form className="mt-5 w-[45rem]">
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="nombre">Nombre del salón</label>
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
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="image">Ingresa una imagen de tu salon</label>
                        <input
                            type="file"
                            accept="image/*"
                            id="image"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            onChange={(e) => handleUpload(e)}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="direccion">Direccion</label>
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
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="file">Ingresa un documento que acredite la validez du salón:</label>
                        <input
                            type="file"
                            id="file"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            value={registroDeSalon.docValido}
                            onChange={(e) => setRegistroDeSalon(prev => ({ ...prev, docValido: e.target.value }))}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="cuit">CUIT</label>
                        <input
                            type="number"
                            id="cuit"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa el cuit de tu negocio"
                            value={registroDeSalon.cuit}
                            onChange={(e) => setRegistroDeSalon(prev => ({ ...prev, cuit: parseInt(e.target.value) }))}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="servicios">Servicios</label>
                        {/* {agregarServicios && (
                            <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50">
                                <div className="bg-white p-5 rounded-lg shadow-lg w-[90%] max-w-md">
                                    <div className="relative">
                                        <button
                                            onClick={() => setAgregarServicios(false)}
                                            className="absolute right-0.5 text-gray-500 hover:text-gray-700"
                                        >
                                            <RxCross2 size={24} />
                                        </button>
                                    </div>
                                    <h2 className="text-xl font-bold font-primary mb-4 text-center">Filtrar Centros</h2>

                                    <div className="flex justify-between mb-3">
                                        <div className="mb-3">
                                            <label className="block text-gray-400 font-primary text-sm mb-1 pl-1" htmlFor="servicios">Servicios</label>
                                            <select name="" id="servicios" className="border border-secondary text-sm font-primary p-1 rounded-lg hover:bg-secondary-dark transition">
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

                                        <div className="mb-3">
                                            <label className="block text-gray-400 font-primary text-sm mb-1 pl-1" htmlFor="PrecioDelServicio">Precio del servicio</label>
                                            <input
                                                type="text"
                                                id="PrecioDelServicio"
                                                className="p-1 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            // onClick={() => { }}
                                            className="font-primary text-md px-4 py-1 mb-3 bg-secondary text-white rounded-full hover:scale-105 transition cursor-pointer"
                                        >
                                            Agregar servicio
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )} */}
                        {/* {agregarServicios && (
                            <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50">
                                <div className="bg-white p-5 rounded-lg shadow-lg w-[90%] max-w-md">
                                    <div className="relative">
                                        <button
                                            onClick={() => setAgregarServicios(false)}
                                            className="absolute right-0.5 text-gray-500 hover:text-gray-700"
                                        >
                                            <RxCross2 size={24} />
                                        </button>
                                    </div>
                                    <h2 className="text-xl font-bold font-primary mb-4 text-center">Agregar Servicios</h2> */}

                        <div className="flex justify-between">
                            <div className="mb-3">
                                <label className="block text-gray-400 font-primary text-sm mb-1 pl-1" htmlFor="servicios">Servicio</label>
                                <select
                                    id="servicios"
                                    value={nuevoServicio.tipoDeServicio}
                                    onChange={(e) =>
                                        setNuevoServicio((prev) => ({ ...prev, tipoDeServicio: e.target.value as TipoDeServicio }))
                                    }
                                    className="border border-secondary bg-gray-100 text-sm font-primary p-1 rounded-lg hover:bg-secondary-dark transition"
                                >
                                    <option value="">Seleccionar servicio</option>
                                    {Object.values(TipoDeServicio).map((tipo) => (
                                        <option key={tipo} value={tipo}>
                                            {tipo.toLowerCase()
                                                .split("_")
                                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                .join(" ")}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="block text-gray-400 font-primary text-sm mb-1 pl-1" htmlFor="PrecioDelServicio">Precio del servicio</label>
                                <input
                                    type="number"
                                    id="PrecioDelServicio"
                                    value={nuevoServicio.precio}
                                    onChange={(e) =>
                                        setNuevoServicio((prev) => ({ ...prev, precio: parseInt(e.target.value) }))
                                    }
                                    className="p-1 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                />
                            </div>

                            <div className="flex justify-end pt-5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (nuevoServicio.tipoDeServicio && nuevoServicio.precio > 0) {
                                            setRegistroDeSalon((prev) => ({
                                                ...prev,
                                                servicios: [...prev.servicios, nuevoServicio]
                                            }));
                                            setNuevoServicio({ tipoDeServicio: TipoDeServicio.PELUQUERIA, precio: parseInt("") }); // limpiar inputs
                                        }
                                    }}
                                    className="font-primary text-sm h-8 px-4 py-1 mb-5 bg-secondary text-white rounded-full hover:scale-105 transition cursor-pointer"
                                >
                                    Agregar servicio
                                </button>
                            </div>
                        </div>

                        {/* Listar los servicios agregados */}
                        <div className="mb-5 bg-gray-100 rounded-2xl w-[100%] p-3">
                            <h3 className="font-bold mb-2 font-primary">Servicios agregados:</h3>
                            <ul className="list-disc pl-5 font-primary mb-3">
                                {registroDeSalon.servicios.map((s, i) => (
                                    <div key={i} className="flex gap-5">
                                        <li>
                                            {s.tipoDeServicio.toLowerCase()
                                                .split("_")
                                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                .join(" ")} - ${s.precio}
                                        </li>
                                        <button className="cursor-pointer"
                                            onClick={() => handleEliminarServicio(i)}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                ))}
                            </ul>


                            {/* <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => { setAgregarServicios(false); }}
                                    className="font-primary text-sm px-4 py-1 mb-3 bg-tertiary text-white rounded-full hover:scale-105 transition cursor-pointer"
                                >
                                    Aceptar
                                </button>
                            </div> */}
                        </div>
                        {/* </div>
                            </div>
                         )} */}

                        {/* <div>
                            <button className="border bg-tertiary text-white w-[60%] px-5 py-1 rounded-lg hover:scale-102"
                                onClick={() => setAgregarServicios(true)}>
                                Agregar servicios
                            </button>
                        </div> */}
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="HorarioComercial">Horario comercial</label>
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

                    <div className="flex flex-col items-end mb-10">
                        <button
                            type="submit"
                            className="w-[30%] bg-secondary text-white font-bold py-2 rounded-full cursor-pointer hover:bg-[#a27e8f] transition font-secondary"
                            onClick={handleRegistrarSalon}
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