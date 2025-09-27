import { useState } from "react"
import type { CentroDeEsteticaDTO } from "../types/centroDeEstetica/CentroDeEsteticaDTO";
import type { HorarioCentroDTO } from "../types/horarioCentro/HorarioCentroDTO";
import { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";
import { useNavigate } from "react-router-dom";
import { setCentro } from "../redux/store/miCentroSlice";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const RegistroDeSalon = () => {
    const user = useAppSelector((state) => state.user.user);
    const [horariosCentro, setHorariosCentro] = useState<HorarioCentroDTO>({ dia: "", horaMInicio: "", horaMFinalizacion: "", horaTInicio: "", horaTFinalizacion: "" });
    const [registroDeSalon, setRegistroDeSalon] = useState<CentroDeEsteticaDTO>({
        nombre: "",
        descripcion: "",
        imagen: "",
        docValido: "",
        cuit: parseInt(""),
        prestadorDeServicioId: user!.id,
        domicilio: {
            calle: "",
            numero: parseInt(""),
            localidad: "",
            codigoPostal: parseInt(""),
        },
        horariosCentro: [] as HorarioCentroDTO[],
    });
    const centroService = new CentroDeEsteticaService();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
        const file = e.target.files?.[0];

        if (!file || !cloudName || !uploadPreset) {
            throw new Error("Cloudinary config missing");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset!);

        const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${fileType}/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await resp.json();
        if (fileType == "image") {
            setRegistroDeSalon(prev => ({ ...prev, imagen: data.secure_url }))
        } else {
            setRegistroDeSalon(prev => ({ ...prev, docValido: data.secure_url }))
        }

    };

    const handleEliminarHorario = (index: number) => {
        setRegistroDeSalon((prev) => ({
            ...prev,
            horariosCentro: prev.horariosCentro.filter((_, i) => i !== index),
        }));
    };


    const handleRegistrarSalon = async () => {
        try {
            const centro = await centroService.post(registroDeSalon);
            dispatch(setCentro(centro));
            alert("Centro registrado");
            navigate("/PendienteAprobacion");
        } catch (error) {
            console.error("Error al registrar el centro de estética:", error);
        }
    }

    const diasEnEspañol: Record<string, string> = {
        MONDAY: "Lunes",
        TUESDAY: "Martes",
        WEDNESDAY: "Miércoles",
        THURSDAY: "Jueves",
        FRIDAY: "Viernes",
        SATURDAY: "Sábado",
        SUNDAY: "Domingo"
    };

    return (
        <>
            <div className="bg-primary w-screen pt-8 flex flex-col items-center">
                <h1 className="font-secondary text-2xl font-bold">Registra tu salón</h1>
                <form className="mt-5 w-[45rem]">
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="nombre">Nombre del salón</label>
                        <input
                            type="text"
                            id="nombre"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa tu nombre completo"
                            value={registroDeSalon.nombre}
                            onChange={(e) => setRegistroDeSalon(prev => ({ ...prev, nombre: e.target.value }))}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="descripcion">Descripción del salón</label>
                        <input
                            type="text"
                            id="descripcion"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa una descripción del salon"
                            value={registroDeSalon.descripcion}
                            onChange={(e) => setRegistroDeSalon(prev => ({ ...prev, descripcion: e.target.value }))}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="image">Ingresa una imagen de tu salon</label>
                        <input
                            type="file"
                            accept="image/*"
                            id="image"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            onChange={(e) => handleUpload(e, "image")}
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
                                    value={registroDeSalon.domicilio.calle}
                                    onChange={(e) => setRegistroDeSalon((prev) => ({ ...prev, domicilio: { ...prev.domicilio, calle: e.target.value }, }))}
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
                                    value={registroDeSalon.domicilio.numero || ""}
                                    onChange={(e) => setRegistroDeSalon((prev) => ({ ...prev, domicilio: { ...prev.domicilio, numero: parseInt(e.target.value) }, }))}
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
                                    value={registroDeSalon.domicilio.localidad}
                                    onChange={(e) => setRegistroDeSalon((prev) => ({ ...prev, domicilio: { ...prev.domicilio, localidad: e.target.value }, }))}
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
                                    value={registroDeSalon.domicilio.codigoPostal || ""}
                                    onChange={(e) => setRegistroDeSalon((prev) => ({ ...prev, domicilio: { ...prev.domicilio, codigoPostal: parseInt(e.target.value) }, }))}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="file">Ingresa un documento que acredite la validez tu salón:</label>
                        <input
                            type="file"
                            id="file"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            onChange={(e) => handleUpload(e, "auto")}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="cuit">CUIT</label>
                        <input
                            type="number"
                            id="cuit"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa el cuit de tu negocio"
                            value={registroDeSalon.cuit || ""}
                            onChange={(e) => setRegistroDeSalon(prev => ({ ...prev, cuit: parseInt(e.target.value) }))}
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="HorarioComercial">Horario comercial</label>
                        <div className="flex gap-2 mb-5">
                            {/* <p className="font-primary text-gray-400 pt-2">De</p> */}
                            <select
                                id="dia"
                                className="w-[30%] p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                value={horariosCentro.dia}
                                onChange={(e) =>
                                    setHorariosCentro((prev) => ({ ...prev, dia: e.target.value }))
                                }
                                required
                            >
                                <option value="">Selecciona un día</option>
                                <option value="MONDAY">Lunes</option>
                                <option value="TUESDAY">Martes</option>
                                <option value="WEDNESDAY">Miércoles</option>
                                <option value="THURSDAY">Jueves</option>
                                <option value="FRIDAY">Viernes</option>
                                <option value="SATURDAY">Sábado</option>
                            </select>

                            <p className="font-primary text-gray-400 pt-2">, De</p>
                            <input
                                type="time"
                                id="horaInicio"
                                className="w-[25%] p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Hora inicio mañana"
                                value={horariosCentro.horaMInicio}
                                onChange={(e) => setHorariosCentro(prev => ({ ...prev, horaMInicio: e.target.value }))}
                                required
                            />
                            <p className="font-primary text-gray-400 pt-2">hs a</p>

                            <input
                                type="time"
                                id="horaFin"
                                className="w-[25%] p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Hora finalizacion mañana"
                                value={horariosCentro.horaMFinalizacion}
                                onChange={(e) => setHorariosCentro(prev => ({ ...prev, horaMFinalizacion: e.target.value }))}
                                required
                            />

                            <p className="font-primary text-gray-400 pt-2">hs y</p>
                        </div>

                        <div className="flex gap-2">
                            <p className="font-primary text-gray-400 pt-2 ml-[32%]">de</p>

                            <input
                                type="time"
                                id="horaInicio"
                                className="w-[25%] p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Hora inicio tarde"
                                value={horariosCentro.horaTInicio}
                                onChange={(e) => setHorariosCentro(prev => ({ ...prev, horaTInicio: e.target.value }))}
                                required
                            />
                            <p className="font-primary text-gray-400 pt-2">hs a</p>
                            <input
                                type="time"
                                id="horaFin"
                                className="w-[25%] p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Hora finalizacion tarde"
                                value={horariosCentro.horaTFinalizacion}
                                onChange={(e) => setHorariosCentro(prev => ({ ...prev, horaTFinalizacion: e.target.value }))}
                                required
                            />
                            <p className="font-primary text-gray-400 pt-2">hs</p>

                        </div>

                        <div className="flex justify-end pt-5">
                            <button
                                type="button"
                                onClick={() => {
                                    if (horariosCentro.dia && horariosCentro.horaMInicio && horariosCentro.horaMFinalizacion && horariosCentro.horaTInicio && horariosCentro.horaTFinalizacion) {
                                        setRegistroDeSalon((prev) => ({
                                            ...prev,
                                            horariosCentro: [...prev.horariosCentro, horariosCentro]
                                        }));
                                        setHorariosCentro({ dia: "", horaMInicio: "", horaMFinalizacion: "", horaTInicio: "", horaTFinalizacion: "" }); // limpiar inputs
                                    }
                                }}
                                className="font-primary text-sm h-8 px-4 py-1 mb-5 bg-secondary text-white rounded-full hover:scale-105 transition cursor-pointer"
                            >
                                Agregar horario
                            </button>
                        </div>

                        <div className="mb-5 bg-gray-100 rounded-2xl w-[100%] p-3">
                            <h3 className="font-bold mb-2 font-primary">Horarios agregados:</h3>
                            <ul className="list-disc pl-5 font-primary mb-3">
                                {registroDeSalon.horariosCentro.map((d, i) => (
                                    <div key={i} className="flex justify-around">
                                        <li>
                                            {diasEnEspañol[d.dia]} de {d.horaMInicio}hs - {d.horaMFinalizacion}hs y {d.horaTInicio}hs - {d.horaTFinalizacion}hs
                                        </li>
                                        <button
                                            type="button"
                                            className="cursor-pointer text-tertiary"
                                            onClick={() => handleEliminarHorario(i)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </ul>
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