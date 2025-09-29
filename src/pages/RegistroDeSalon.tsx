import { useState, type FormEvent } from "react";
import type { CentroDeEsteticaDTO } from "../types/centroDeEstetica/CentroDeEsteticaDTO";
import type { HorarioCentroDTO } from "../types/horarioCentro/HorarioCentroDTO";
import type { DomicilioDTO } from "../types/domicilio/DomicilioDTO";
import { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";
import { useNavigate } from "react-router-dom";
import { setCentro } from "../redux/store/miCentroSlice";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import AddressFieldset, { AddressValue } from "../components/AddressFieldset";

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
        cuit: 0,
        prestadorDeServicioId: user?.id ?? 0,
        domicilio: {
            calle: "",
            numero: 0,
            localidad: "",
            codigoPostal: 0,
            provincia: "",
        },
        horariosCentro: [] as HorarioCentroDTO[],
    });
    const [domicilioForm, setDomicilioForm] = useState<AddressValue>({
        calle: "",
        numero: undefined,
        codigoPostal: undefined,
        provincia: "",
        localidad: "",
    });
    const centroService = new CentroDeEsteticaService();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleAddressChange = (next: AddressValue) => {
        setDomicilioForm(next);
        setRegistroDeSalon((prev) => ({
            ...prev,
            domicilio: {
                calle: next.calle,
                numero: next.numero ?? 0,
                localidad: next.localidad,
                codigoPostal: next.codigoPostal ?? 0,
                provincia: next.provincia,
            },
        }));
    };

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
        if (fileType === "image") {
            setRegistroDeSalon((prev) => ({ ...prev, imagen: data.secure_url }));
        } else {
            setRegistroDeSalon((prev) => ({ ...prev, docValido: data.secure_url }));
        }
    };

    const handleEliminarHorario = (index: number) => {
        setRegistroDeSalon((prev) => ({
            ...prev,
            horariosCentro: prev.horariosCentro.filter((_, i) => i !== index),
        }));
    };

    const handleRegistrarSalon = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user?.id) {
            alert("No se encontro el usuario prestador asociado.");
            return;
        }

        if (!domicilioForm.calle || !domicilioForm.numero || !domicilioForm.provincia || !domicilioForm.localidad) {
            alert("Completa la direccion del salon (calle, altura, provincia y localidad).");
            return;
        }

        const domicilioDTO: DomicilioDTO = {
            calle: domicilioForm.calle,
            numero: domicilioForm.numero ?? 0,
            localidad: domicilioForm.localidad,
            codigoPostal: domicilioForm.codigoPostal ?? 0,
            provincia: domicilioForm.provincia,
        };

        if (!registroDeSalon.nombre || !registroDeSalon.descripcion) {
            alert("Completa los datos basicos del salon (nombre y descripcion).");
            return;
        }

        if (!registroDeSalon.cuit) {
            alert("Ingresa un CUIT valido.");
            return;
        }

        const payload: CentroDeEsteticaDTO = {
            ...registroDeSalon,
            cuit: Number(registroDeSalon.cuit),
            prestadorDeServicioId: user.id,
            domicilio: domicilioDTO,
        };

        try {
            const centro = await centroService.post(payload);
            dispatch(setCentro(centro));
            alert("Centro registrado");
            navigate("/PendienteAprobacion");
        } catch (error) {
            console.error("Error al registrar el centro de estetica:", error);
            alert("No se pudo registrar el centro. Intentalo nuevamente.");
        }
    };

    const diasEnEspanol: Record<string, string> = {
        MONDAY: "Lunes",
        TUESDAY: "Martes",
        WEDNESDAY: "Miercoles",
        THURSDAY: "Jueves",
        FRIDAY: "Viernes",
        SATURDAY: "Sabado",
        SUNDAY: "Domingo",
    };

    return (
        <>
            <div className="bg-primary w-screen pt-8 flex flex-col items-center">
                <h1 className="font-secondary text-2xl font-bold">Registra tu salón</h1>
                <form className="mt-5 w-[45rem]" onSubmit={handleRegistrarSalon}>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="nombre">Nombre del salón</label>
                        <input
                            type="text"
                            id="nombre"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa tu nombre completo"
                            value={registroDeSalon.nombre}
                            onChange={(e) => setRegistroDeSalon((prev) => ({ ...prev, nombre: e.target.value }))}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="descripcion">Descripción del salón</label>
                        <input
                            type="text"
                            id="descripcion"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa una descripción del salón"
                            value={registroDeSalon.descripcion}
                            onChange={(e) => setRegistroDeSalon((prev) => ({ ...prev, descripcion: e.target.value }))}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="image">Ingresa una imagen de tu salón</label>
                        <input
                            type="file"
                            accept="image/*"
                            id="image"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            onChange={(e) => handleUpload(e, "image")}
                        />
                    </div>
                    <div className="mb-5">
                        <AddressFieldset
                            value={domicilioForm}
                            onChange={handleAddressChange}
                            className="bg-gray-50 rounded-2xl p-4"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="file">Ingresa un documento que acredite la validez tu salón:</label>
                        <input
                            type="file"
                            accept="image/*,application/pdf"
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
                            onChange={(e) => setRegistroDeSalon((prev) => ({ ...prev, cuit: e.target.value ? parseInt(e.target.value, 10) : 0 }))}
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary font-bold mb-2">Horarios</label>
                        <div className="flex gap-2 mb-3">
                            <div className="w-1/2">
                                <label className="block text-gray-400 font-primary text-sm mb-1 pl-1" htmlFor="dia">Día</label>
                                <select
                                    id="dia"
                                    className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    value={horariosCentro.dia}
                                    onChange={(e) => setHorariosCentro((prev) => ({ ...prev, dia: e.target.value }))}
                                >
                                    <option value="">Selecciona un día</option>
                                    {Object.entries(diasEnEspanol).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2 mb-2">
                            <input
                                type="time"
                                className="w-1/4 p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Hora inicio"
                                value={horariosCentro.horaMInicio}
                                onChange={(e) => setHorariosCentro((prev) => ({ ...prev, horaMInicio: e.target.value }))}
                                required
                            />
                            <input
                                type="time"
                                className="w-1/4 p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Hora finalización"
                                value={horariosCentro.horaMFinalizacion}
                                onChange={(e) => setHorariosCentro((prev) => ({ ...prev, horaMFinalizacion: e.target.value }))}
                                required
                            />
                            <input
                                type="time"
                                className="w-1/4 p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Hora inicio tarde"
                                value={horariosCentro.horaTInicio}
                                onChange={(e) => setHorariosCentro((prev) => ({ ...prev, horaTInicio: e.target.value }))}
                                required
                            />
                            <input
                                type="time"
                                className="w-1/4 p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Hora finalización tarde"
                                value={horariosCentro.horaTFinalizacion}
                                onChange={(e) => setHorariosCentro((prev) => ({ ...prev, horaTFinalizacion: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    if (horariosCentro.dia && horariosCentro.horaMInicio && horariosCentro.horaMFinalizacion && horariosCentro.horaTInicio && horariosCentro.horaTFinalizacion) {
                                        setRegistroDeSalon((prev) => ({
                                            ...prev,
                                            horariosCentro: [...prev.horariosCentro, horariosCentro],
                                        }));
                                        setHorariosCentro({ dia: "", horaMInicio: "", horaMFinalizacion: "", horaTInicio: "", horaTFinalizacion: "" });
                                    }
                                }}
                                className="font-primary text-sm h-8 px-4 py-1 mb-5 bg-secondary text-white rounded-full hover:scale-105 transition cursor-pointer"
                            >
                                Agregar horario
                            </button>
                        </div>

                        <div className="mb-5 bg-gray-100 rounded-2xl w-full p-3">
                            <h3 className="font-bold mb-2 font-primary">Horarios agregados:</h3>
                            <ul className="list-disc pl-5 font-primary mb-3">
                                {registroDeSalon.horariosCentro.map((d, i) => (
                                    <div key={`${d.dia}-${i}`} className="flex justify-between">
                                        <li>
                                            {diasEnEspanol[d.dia]} de {d.horaMInicio}hs - {d.horaMFinalizacion}hs y {d.horaTInicio}hs - {d.horaTFinalizacion}hs
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
                        >
                            Enviar
                        </button>
                    </div>

                </form>
            </div>
        </>
    );
};

export default RegistroDeSalon;
