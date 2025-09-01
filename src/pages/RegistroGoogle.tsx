import { useState } from "react";
import Navbar from "../components/Navbar"
import type { ClienteDTO } from "../types/cliente/ClienteDTO";
import type { PrestadorServicioDTO } from "../types/prestadorDeServicio/PestadorServicioDTO";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { Rol } from "../types/enums/Rol";
import { updateUserCliente, updateUserPrestador } from "../redux/store/authSlice";
import { useNavigate } from "react-router-dom";

const RegistroGoogle = () => {
    const navigate = useNavigate();
    const { user, loading, error } = useAppSelector((state) => state.user);
    const [registro, setRegistro] = useState<ClienteDTO | PrestadorServicioDTO>({
        nombre: user?.nombre ?? "",
        apellido: user?.apellido ?? "",
        telefono: user?.telefono ?? "",
        usuario: {
            mail: user?.usuario.mail ?? "",
            contraseña: user?.usuario.contraseña ?? "",
            rol: user?.usuario.rol ?? Rol.CLIENTE,
        },
    });
    const dispatch = useAppDispatch();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (user?.usuario.rol === Rol.CLIENTE) {
            dispatch(updateUserCliente(registro));
            navigate("/");
        } else {
            dispatch(updateUserPrestador(registro));
            navigate("/RegistroDeSalon");
        }
    }

    return (
        <>
            <Navbar />
            {error ? (<p className="text-red-500">{error}</p>) : (
                <div className="bg-primary w-screen pt-25 flex flex-col items-center">

                    <h1 className="font-secondary text-2xl font-bold mb-3">Finaliza tu registro</h1>
                    <form className="mt-5 w-[45rem]" onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block text-gray-700 font-primary mb-2" htmlFor="nombre">Nombre</label>
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
                            <label className="block text-gray-700 font-primary mb-2" htmlFor="apellido">Apellido</label>
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
                            <label className="block text-gray-700 font-primary mb-2" htmlFor="telefono">Teléfono</label>
                            <input
                                type="number"
                                id="telefono"
                                className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Ingresa tu número de teléfono"
                                value={registro.telefono || ""}
                                onChange={(e) => setRegistro(prev => ({ ...prev, telefono: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col items-center mb-5">
                            <button
                                type="submit"
                                className="w-[90%] bg-secondary text-white font-bold py-2 rounded-full hover:bg-[#a27e8f] transition font-secondary"
                            >
                                Finalizar
                            </button>
                        </div>
                    </form>

                </div>
            )}
        </>
    )
}

export default RegistroGoogle