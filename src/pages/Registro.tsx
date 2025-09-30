import { useState } from "react";
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from '../firebase/config';
import type { ClienteDTO } from "../types/cliente/ClienteDTO";
import type { UsuarioDTO } from "../types/usuario/UsuarioDTO";
import type { PrestadorServicioDTO } from "../types/prestadorDeServicio/PestadorServicioDTO";
import { Rol } from "../types/enums/Rol";
import { FcGoogle } from "react-icons/fc";
import { useAppDispatch } from "../redux/store/hooks";
import { setUser } from "../redux/store/authSlice";
import type { PrestadorServicioResponseDTO } from "../types/prestadorDeServicio/PrestadorServicioResponseDTO";
import type { ClienteResponseDTO } from "../types/cliente/ClienteResponseDTO";
//import type { DomicilioDTO } from "../types/domicilio/DomicilioDTO";
import AddressFieldset from "../components/AddressFieldset";
import type { AddressValue } from "../components/AddressFieldset";
import Swal from "sweetalert2";

const Registro = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [prestador, setPrestador] = useState<boolean>();
    const [usuario, setUsuario] = useState<UsuarioDTO>({ mail: "", rol: prestador === true ? Rol.PRESTADOR_DE_SERVICIO : Rol.CLIENTE, uid: "" });
    const [contrasenia, setContrasenia] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [domicilioForm, setDomicilioForm] = useState<AddressValue>({ calle: "", numero: undefined, codigoPostal: undefined, provincia: "", localidad: "" });
    const [registro, setRegistro] = useState<ClienteDTO | PrestadorServicioDTO>({ nombre: "", apellido: "", telefono: "", usuario: usuario });
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validación de campos completos
        if (
            !registro.nombre ||
            !registro.telefono ||
            !usuario.mail ||
            !contrasenia ||
            !confirmPassword ||
            (!prestador && (!domicilioForm.calle || domicilioForm.numero == null || !domicilioForm.localidad || !domicilioForm.provincia))
        ) {
            Swal.fire({
                text: 'Por favor, completa todos los campos requeridos',
                position: "center",
                icon: "warning",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if (prestador === undefined) {
            Swal.fire({
                text: "Por favor, selecciona si es prestador o cliente",
                position: "center",
                icon: "warning",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        // Validación de contraseñas iguales
        if (contrasenia !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            const result = await createUserWithEmailAndPassword(auth, usuario.mail, contrasenia);
            const user = result.user;
            const idToken = await user.getIdToken();

            const resp = await fetch("http://localhost:8080/api/usuario/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idToken,
                    mail: usuario.mail,
                    rol: prestador ? Rol.PRESTADOR_DE_SERVICIO : Rol.CLIENTE,
                    uid: user.uid,
                    clienteDTO: prestador ? null : {
                        nombre: registro.nombre,
                        apellido: registro.apellido,
                        telefono: registro.telefono,
                        domicilio: {
                            calle: domicilioForm.calle,
                            numero: domicilioForm.numero ?? 0,
                            localidad: domicilioForm.localidad,
                            codigoPostal: domicilioForm.codigoPostal ?? 0,
                            provincia: domicilioForm.provincia,
                        },
                    },
                    prestadorDTO: prestador ? {
                        nombre: registro.nombre,
                        apellido: registro.apellido,
                        telefono: registro.telefono
                    } : null
                })
            });

            if (!resp.ok) throw new Error(await resp.text());
            Swal.fire({
                title: '¡Registro exitoso!',
                text: '¡Bienvenido a BeautyConnect!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
                width: '350px',
            });

            const data: ClienteResponseDTO | PrestadorServicioResponseDTO = await resp.json();
            dispatch(setUser(data));

            if (prestador) {
                navigate("/RegistroDeSalon");
            } else {
                navigate("/");
            }
        } catch (err) {
            Swal.fire({
                text: (err as Error).message || "Error en el registro",
                position: "center",
                icon: "error",
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#a27e8f',
                width: '450px',
            });
            setError((err as Error).message || "Error en el registro");
        }
    };

    const handleGoogleSignIn = async () => {
        if (prestador === undefined) {
            Swal.fire({
                text: "Por favor, selecciona si es prestador o cliente",
                position: "center",
                icon: "warning",
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#a27e8f',
                width: '450px',
            });
            return;
        }

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken();

            const resp = await fetch("http://localhost:8080/api/usuario/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idToken,
                    mail: user.email,
                    rol: prestador ? Rol.PRESTADOR_DE_SERVICIO : Rol.CLIENTE,
                    uid: user.uid,
                    clienteDTO: prestador ? null : {
                        nombre: registro.nombre,
                        apellido: registro.apellido,
                        telefono: registro.telefono,
                        domicilio: {
                            calle: domicilioForm.calle,
                            numero: domicilioForm.numero ?? 0,
                            localidad: domicilioForm.localidad,
                            codigoPostal: domicilioForm.codigoPostal ?? 0,
                            provincia: domicilioForm.provincia,
                        },
                    },
                    prestadorDTO: prestador ? {
                        nombre: registro.nombre,
                        apellido: registro.apellido,
                        telefono: registro.telefono
                    } : null
                })
            });

            if (!resp.ok) throw new Error(await resp.text());
            Swal.fire({
                title: '¡Registro con Google exitoso!',
                text: '¡Bienvenido a BeautyConnect!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            });

            const data: ClienteResponseDTO | PrestadorServicioResponseDTO = await resp.json();
            dispatch(setUser(data));

            // completar datos registro
            navigate("/FinalizarRegistroGoogle")
        } catch (err: unknown) {
            Swal.fire({
                text: (err as Error).message || "Error al registarse con Google",
                position: "center",
                icon: "error",
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#a27e8f',
                width: '450px',
            });
        }
    };

    return (
        <>
            <Navbar />
            {error ? (<p className="text-red-500">{error}</p>) : (
                <div className="bg-primary w-screen pt-25 flex flex-col items-center">
                    <h1 className="font-secondary text-2xl font-bold mb-3 text-tertiary">¡Bienvenido a BeautyConnect!</h1>
                    <p className="font-primary">Regístrate para comenzar a gestionar tus turnos de belleza de manera eficiente.</p>
                    <form className="mt-5 w-[45rem]" onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="nombre">Nombre</label>
                            <input
                                type="text"
                                id="nombre"
                                className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Ingresa tu nombre"
                                value={registro.nombre}
                                onChange={(e) => setRegistro(prev => ({ ...prev, nombre: e.target.value }))}
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="apellido">Apellido</label>
                            <input
                                type="text"
                                id="apellido"
                                className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Ingresa tu apellido"
                                value={registro.apellido}
                                onChange={(e) => setRegistro(prev => ({ ...prev, apellido: e.target.value }))}
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="mail">Correo electrónico</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Ingresa tu correo electrónico"
                                value={usuario.mail}
                                onChange={(e) => setUsuario(prev => ({ ...prev, mail: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="telefono">Teléfono</label>
                            <input
                                type="number"
                                id="telefono"
                                className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Ingresa tu número de teléfono"
                                value={registro.telefono || ""}
                                onChange={(e) => setRegistro(prev => ({ ...prev, telefono: e.target.value }))}
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Ingresa tu contraseña"
                                value={contrasenia}
                                onChange={(e) => setContrasenia(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="confirmPassword">Confirmar contraseña</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Confirma tu contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                                                {prestador == false && (
                            <div className="mb-5">
                                <label className="block text-gray-700 font-primary font-bold mb-2" htmlFor="direccion">Direccion</label>
                                <AddressFieldset
                                    value={domicilioForm}
                                    onChange={setDomicilioForm}
                                    className="bg-white rounded-2xl p-4 border border-gray-200"
                                />
                            </div>
                        )}
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
                            <div className="w-[90%] flex items-center my-2">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="mx-4 text-gray-500">o</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                className="w-[90%] bg-white text-gray-800 border rounded-full py-2 flex items-center justify-center font-secondary gap-2 cursor-pointer hover:bg-gray-200"
                            >
                                <FcGoogle />
                                Registrarse con Google
                            </button>
                        </div>
                    </form>

                    <p className="mb-10">¿Ya tienes una cuenta? <a href="/iniciarSesion" className="font-bold">Iniciar sesión</a></p>

                </div>
            )}
        </>
    )
}

export default Registro