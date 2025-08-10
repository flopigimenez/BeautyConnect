import { useState } from "react";
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '../firebase/config';
import { ClienteService } from "../services/ClienteService";
import type { ClienteDTO } from "../types/cliente/ClienteDTO";
import type { UsuarioDTO } from "../types/usuario/UsuarioDTO";
import type { PrestadorServicioDTO } from "../types/prestadorDeServicio/PestadorServicioDTO";
import { PrestadorServicioService } from "../services/PrestadorServicioService";
import { Rol } from "../types/enums/Rol";

const auth = getAuth(app);

const Registro = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [prestador, setPrestador] = useState<boolean>();
    const [usuario, setUsuario] = useState<UsuarioDTO>({ mail: "", contraseña: "", rol: prestador === true ?  Rol.PRESTADOR_DE_SERVICIO : Rol.CLIENTE })
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const prestadorService = new PrestadorServicioService();
    const [registro, setRegistro] = useState<ClienteDTO | PrestadorServicioDTO>({ nombre: "", telefono: Number(""), usuario: usuario });
    const clienteService = new ClienteService();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validación de campos completos
        if (
            !registro.nombre ||
            !registro.telefono ||
            !usuario.mail ||
            !usuario.contraseña ||
            !confirmPassword
        ) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        // Validación de contraseñas iguales
        if (usuario.contraseña !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            if (prestador) {
                const nuevoPrestador: PrestadorServicioDTO = registro;
                await prestadorService.post(nuevoPrestador);
                navigate("/RegistroDeSalon");
            } else {
                const nuevoCliente: ClienteDTO = registro;
                await clienteService.post(nuevoCliente);
            }
            await createUserWithEmailAndPassword(auth, usuario.mail, usuario.contraseña);
            alert("Usuario registrado correctamente");
            navigate("/");
        } catch (error: any) {
            setError(error.message);
        }
    };


    return (
        <>
            <Navbar />
            <div className="bg-primary w-screen mt-25 flex flex-col items-center">
                <h1 className="font-secondary text-2xl font-bold mb-3">¡Bienvenido a BeautyConnect!</h1>
                <p className="font-primary">Regístrate para comenzar a gestionar tus turnos de belleza de manera eficiente.</p>
                {error ? (<p className="text-red-500">{error}</p>) : (
                <form className="mt-5 w-[45rem]" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa tu nombre completo"
                            value={registro.nombre}
                            onChange={(e) => setRegistro(prev => ({...prev, nombre: e.target.value}))}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="mail">Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa tu correo electrónico"
                            value={usuario.mail}
                            onChange={(e) => setUsuario(prev => ({...prev, mail: e.target.value}))}
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="telefono">Teléfono</label>
                        <input
                            type="number"
                            id="telefono"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa tu número de teléfono"
                            value={Number(registro.telefono)}
                            onChange={(e) => setRegistro(prev => ({...prev, telefono: Number(e.target.value)}))}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa tu contraseña"
                            value={usuario.contraseña}
                            onChange={(e) => setUsuario(prev => ({...prev, contraseña: e.target.value}))}
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="confirmPassword">Confirmar contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Confirma tu contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center mb-5">
                        <div className="mb-8 grid grid-cols-2 gap-30">
                            <button type="button"
                                className={`border border-tertiary rounded-lg w-[30vh] h-[5vh] hover:scale-102 hover:bg-tertiary hover:text-white ${prestador == false ? "bg-tertiary text-white" : "bg-white"}`}
                                onClick={() => setPrestador(false)}
                            >
                                Soy cliente
                            </button>
                            <button type="button"
                                className={`border border-tertiary rounded-lg w-[30vh] h-[5vh] hover:scale-102 hover:bg-tertiary hover:text-white ${prestador == true ? "bg-tertiary text-white" : "bg-white"}`}
                                onClick={() => setPrestador(true)}
                            >
                                Prestador de servicio
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-[90%] bg-secondary text-white font-bold py-2 rounded-full hover:bg-[#a27e8f] transition font-secondary"
                        >
                            Registrarse
                        </button>
                    </div>
                </form>
                )}
                <p className="mb-10">¿Ya tienes una cuenta? <a href="/iniciarSesion" className="font-bold">Iniciar sesión</a></p>

            </div>
        </>
    )
}

export default Registro