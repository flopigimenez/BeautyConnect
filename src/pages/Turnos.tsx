import { useState } from "react"
import Navbar from "../components/Navbar"
import { TipoDeServicio } from "../types/enums/TipoDeServicio"
import type { ServicioDTO } from "../types/servicio/ServicioDTO"
import type { ProfesionalDTO } from "../types/profesional/ProfesionalDTO"
import { useNavigate } from "react-router-dom"




const Turnos = () => {
    const servicios: ServicioDTO[] = [
        { id: 1, tipoDeServicio: TipoDeServicio.DEPILACION, duracion: 30, precio: 1500, descripcion: "Depilación con cera" },
        { id: 2, tipoDeServicio: TipoDeServicio.MANICURA, duracion: 45, precio: 2000, descripcion: "Manicura completa" },
        { id: 3, tipoDeServicio: TipoDeServicio.PEDICURA, duracion: 60, precio: 2500, descripcion: "Pedicura spa" },
        { id: 4, tipoDeServicio: TipoDeServicio.MASAJES, duracion: 90, precio: 4000, descripcion: "Masaje relajante" },
    ]



    const profesionales: ProfesionalDTO[] = [
        { id: 1, nombre: "Ana Pérez", disponibilidades: [], servicios: servicios, centroDeEstetica: { id: 1, nombre: "Centro Belleza", descripcion: "", domicilios: [], imagen: "", docValido: "", cuit: 2131243214, servicios: [], turnos: [], reseñas: [] } },
        { id: 2, nombre: "Luis Gómez", disponibilidades: [], servicios: servicios, centroDeEstetica: { id: 1, nombre: "Centro Belleza", descripcion: "", domicilios: [], imagen: "", docValido: "", cuit: 2131243214, servicios: [], turnos: [], reseñas: [] } },
    ]

    const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioDTO | null>(null);
    const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<ProfesionalDTO | null>(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
    const [horaSeleccionada, setHoraSeleccionada] = useState<Date | null>(null);
    const [pasos, setPasos] = useState<number>(1);
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="pt-10 bg-primary w-screen mt-15">
                <h1 className="font-secondary text-2xl font-bold text-center">Reserva tu turno en 2 simples pasos</h1>

                <div className="px-[45vh] mt-10">
                    <p className="font-primary text-left">{pasos == 1 ? "Paso 1 de 2" : "Paso 2 de 2"}</p>
                    <div className="w-[50rem] h-1.5 rounded-full overflow-hidden flex mt-5">
                        <div className="w-1/2 bg-secondary"></div>
                        <div className={`w-1/2 ${pasos == 1 ? "bg-gray-300" : "bg-secondary"} `}></div>
                    </div>

                    <h2 className="mt-13 font-secondary text-l font-bold">{pasos == 1 ? "Selecciona el servicio" : "Selecciona la fecha"}</h2>
                    <select className="w-[50rem] p-2 mt-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                        onChange={(e) => {
                            const encontrarServicio = servicios.find(s => s.id === parseInt(e.target.value)) || null;
                            setServicioSeleccionado(encontrarServicio);

                            const encontrarFecha = profesionales.find(p => p.id === profesionalSeleccionado?.id)?.disponibilidades.find(d => d.id === parseInt(e.target.value)) || null;
                            setFechaSeleccionada(encontrarFecha ? new Date(encontrarFecha.fecha) : null);
                        }}
                        value={pasos == 1 ? (servicioSeleccionado ? servicioSeleccionado.id : "") : (fechaSeleccionada ? fechaSeleccionada.toISOString().split('T')[0] : "")}
                    >
                        <option value='' disabled>{pasos == 1 ? "Seleccionar servicio" : "Seleccionar fecha"}</option>
                        {pasos == 1 ?
                            servicios.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.tipoDeServicio}
                                </option>
                            )) :
                            profesionales.find(p => p.id === profesionalSeleccionado?.id)?.disponibilidades.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.fecha.toLocaleDateString()} - {d.horaInicio} a {d.horaFin}
                                </option>
                            ))}
                    </select>

                    <h2 className="mt-13 font-secondary text-l font-bold">{pasos == 1 ? "Selecciona el profesional" : "Selecciona la hora"}</h2>
                    <select className="w-[50rem] p-2 mt-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                        onChange={(e) => {
                            const encontrarProfesional = profesionales.find(t => t.id === parseInt(e.target.value)) || null;
                            setProfesionalSeleccionado(encontrarProfesional);

                            const encontrarHora = encontrarProfesional?.disponibilidades.find(d => d.horaInicio === fechaSeleccionada?.toISOString().split('T')[1].slice(0, 5)) || null;
                            setHoraSeleccionada(encontrarHora ? new Date(encontrarHora.horaInicio) : null);
                        }}
                        value={pasos == 1 ? (profesionalSeleccionado ? profesionalSeleccionado.id : "") : (horaSeleccionada ? horaSeleccionada.toISOString().split('T')[1].slice(0, 5) : "")}
                    >
                        <option value='' disabled>{pasos == 1 ? "Seleccionar servicio" : "Seleccionar hora"}</option>
                        {pasos == 1 ?
                            profesionales.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre}
                                </option>
                            )) :
                            profesionales.find(p => p.id === profesionalSeleccionado?.id)?.disponibilidades.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.horaInicio} - {d.horaFin}
                                </option>
                            ))}
                    </select>
                    <div className="flex justify-center items-center mt-15 gap-15">
                        <button className="rounded-full bg-secondary px-33 py-2 font-primary"
                            onClick={() => {
                                if (pasos === 1) {
                                    setPasos(1);
                                    setServicioSeleccionado(null);
                                    setProfesionalSeleccionado(null);
                                    setFechaSeleccionada(null);
                                    setHoraSeleccionada(null);
                                    alert("Turno cancelado");
                                    navigate("/"); 
                                } else {
                                    setPasos(1);
                                }
                            }}
                        >
                            {pasos == 1 ? "Cancelar" : "Volver atras"}
                        </button>
                        <button className="rounded-full bg-secondary px-33 py-2 font-primary"
                            onClick={() => {
                                if (pasos === 1) {
                                    if (servicioSeleccionado && profesionalSeleccionado) {
                                        setPasos(2);
                                    } else {
                                        alert("Por favor, selecciona un servicio y un prestador.");
                                    }
                                } else {
                                    alert(`Turno confirmado con ${profesionalSeleccionado?.nombre} para el servicio ${servicioSeleccionado?.tipoDeServicio}`);
                                }
                            }}>
                            {pasos === 1 ? "Siguiente" : "Confirmar turno"}
                        </button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Turnos
