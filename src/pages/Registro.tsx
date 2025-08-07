import { useState } from "react";
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom";

const Registro = () => {
    const navigate = useNavigate();
    const [prestador, setPrestador] = useState<boolean>();
    
    return (
        <>
            <Navbar />
            <div className="bg-primary w-screen mt-25 flex flex-col items-center">
                <h1 className="font-secondary text-2xl font-bold mb-3">¡Bienvenido a BeautyConnect!</h1>
                <p className="font-primary">Regístrate para comenzar a gestionar tus turnos de belleza de manera eficiente.</p>
                <form className="mt-5 w-[45rem]">
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="nombre">Nombre</label>
                        <input
                            type="nombre"
                            id="nombre"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa tu nombre completo"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="email">Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa tu correo electrónico"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa tu contraseña"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="confirmPassword">Confirmar contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Confirma tu contraseña"
                        />
                    </div>
                    <div className="flex flex-col items-center mb-10">
                        <div className="mb-8 grid grid-cols-2 gap-30">
                            <button type="button"
                                className={`border border-secondary rounded-lg w-[25vh] h-[5vh] hover:scale-102 hover:bg-secondary ${prestador == false ? "bg-secondary" : "bg-white"}`}
                                onClick={() => setPrestador(false)}
                            >
                                Soy cliente
                            </button>
                            <button type="button"
                                className={`border border-secondary rounded-lg w-[25vh] h-[5vh] hover:scale-102 hover:bg-secondary ${prestador == true ? "bg-secondary" : "bg-white"}`}
                                onClick={() => setPrestador(true)}
                            >
                                Prestador de servicio
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-[90%] bg-secondary text-white font-bold py-2 rounded-full hover:bg-[#a27e8f] transition font-secondary"
                            onClick={() => {
                                if(prestador){
                                  navigate("/solicitudDeSalones");  
                                }else{

                                }
                            }}
                        >
                            Registrarse
                        </button>
                    </div>

                </form>
            </div>
        </>
    )
}

export default Registro