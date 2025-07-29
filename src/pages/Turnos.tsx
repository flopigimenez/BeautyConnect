import { useState } from "react"
import Navbar from "../components/Navbar"
import { TipoDeServicio } from "../types/enums/TipoDeServicio"
import type { ServicioDTO } from "../types/servicio/ServicioDTO"
import type { PrestadorServicioDTO } from "../types/prestadorDeServicio/PestadorServicioDTO"




const Turnos = () => {
    const servicios: ServicioDTO[] = [
        { id: 1, tipoDeServicio: TipoDeServicio.DEPILACION, duracion: 30, precio: 1500, descripcion: "Depilación con cera" },
        { id: 2, tipoDeServicio: TipoDeServicio.MANICURA, duracion: 45, precio: 2000, descripcion: "Manicura completa" },
        { id: 3, tipoDeServicio: TipoDeServicio.PEDICURA, duracion: 60, precio: 2500, descripcion: "Pedicura spa" },
        { id: 4, tipoDeServicio: TipoDeServicio.MASAJES, duracion: 90, precio: 4000, descripcion: "Masaje relajante" },
    ]

    const prestadores: PrestadorServicioDTO[] = [
        { id: 1, nombre: "Juan Perez", telefono: 123456789,  },
        { id: 2, nombre: "Maria Lopez", telefono: 987654321 },
        { id: 3, nombre: "Carlos Gomez", telefono: 456789123 },
        { id: 4, nombre: "Ana Torres", telefono: 321654987 },
    ]

    const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioDTO | null>(null);
    const [prestadorSeleccionado, setPrestadorSeleccionado] = useState<PrestadorServicioDTO | null>(null);
    const [pasos, setPasos] = useState<number>(1);

    return (
        <>
            <Navbar />
            <div className="pt-10 bg-primary w-screen">
                <h1 className="font-secondary text-2xl font-bold text-center">Reserva tu turno en 2 simples pasos</h1>

                <div className="px-[45vh] mt-10">
                    <p className="font-primary text-left">{pasos == 1 ? "Paso 1 de 2" : "Paso 2 de 2"}</p>
                    <div className="w-[50rem] h-1.5 rounded-full overflow-hidden flex mt-5">
                        <div className="w-1/2 bg-secondary"></div>
                        <div className={`w-1/2 ${pasos == 1 ? "bg-gray-300" : "bg-secondary"} `}></div>
                    </div>

                    <h2 className="mt-13 font-secondary text-l font-bold">Selecciona el servicio</h2>
                    <select className="w-[50rem] p-2 mt-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                        onChange={(e) => {
                            const encontrarServicio = servicios.find(t => t.id === parseInt(e.target.value)) || null;
                            setServicioSeleccionado(encontrarServicio);
                            if (servicioSeleccionado) {
                                console.log(`Servicio seleccionado: ${servicioSeleccionado.tipoDeServicio}`);

                            }
                        }}
                        value={servicioSeleccionado ? servicioSeleccionado.id : ""}
                    >
                        <option value='' disabled>Seleccionar servicio</option>
                        {servicios.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.tipoDeServicio}
                            </option>
                        ))}
                    </select>

                    <h2 className="mt-13 font-secondary text-l font-bold">Selecciona el profesional</h2>
                    <select className="w-[50rem] p-2 mt-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                        onChange={(e) => {
                            const encontrarPrestador = prestadores.find(t => t.id === parseInt(e.target.value)) || null;
                            setPrestadorSeleccionado(encontrarPrestador);
                            if (prestadorSeleccionado) {
                                console.log(`Prestador seleccionado: ${prestadorSeleccionado.nombre}`);

                            }
                        }}
                        value={prestadorSeleccionado ? prestadorSeleccionado.id : ""}
                    >
                        <option value='' disabled>Seleccionar servicio</option>
                        {prestadores.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre}
                            </option>
                        ))}
                    </select>
                    <div className="flex justify-center items-center mt-15">
                        <button className="rounded-full bg-secondary px-40 py-2 font-primary" 
                            onClick={() => {
                                if (pasos === 1) {
                                    if (servicioSeleccionado && prestadorSeleccionado) {
                                        setPasos(2);
                                    } else {
                                        alert("Por favor, selecciona un servicio y un prestador.");
                                    }
                                } else {
                                    alert(`Turno confirmado con ${prestadorSeleccionado?.nombre} para el servicio ${servicioSeleccionado?.tipoDeServicio}`);
                                }
                            }}>
                            Siguiente
                        </button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Turnos
