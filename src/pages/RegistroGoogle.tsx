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
    const { user, error } = useAppSelector((state) => state.user);
    const [registro, setRegistro] = useState<ClienteDTO | PrestadorServicioDTO>({
        nombre: user?.nombre ?? "",
        apellido: user?.apellido ?? "",
        telefono: user?.telefono ?? "",
        domicilio: {
            calle: user?.domicilio?.calle ?? "",
            numero: user?.domicilio?.numero ?? parseInt(""),
            localidad: user?.domicilio?.localidad ?? "",
            codigoPostal: user?.domicilio?.codigoPostal ?? parseInt(""),
        },
        usuario: {
            mail: user?.usuario.mail ?? "",
            rol: user?.usuario.rol ?? Rol.CLIENTE,
            uid: user?.usuario.uid ?? "",
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
                        <div className="mb-5">
                            <label className="block text-gray-700 font-primary mb-2" htmlFor="direccion">Direccion</label>
                            <div className="flex gap-2 mb-5">
                                <div className="w-[50%]">
                                    <label className="block text-gray-600 font-primary text-sm mb-1" htmlFor="calle">Calle</label>
                                    <input
                                        type="text"
                                        id="direccion"
                                        className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                        placeholder="Calle"
                                        value={user?.domicilio?.calle}
                                        onChange={(e) => setRegistro((prev) => ({ ...prev, domicilio: { ...prev, calle: e.target.value }, }))}
                                        required
                                    />
                                </div>
                                <div className="w-[50%]">
                                    <label className="block text-gray-600 font-primary text-sm mb-1" htmlFor="numero">Numero</label>
                                    <input
                                        type="number"
                                        id="numero"
                                        className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                        placeholder="Número"
                                        value={user?.domicilio?.numero || ""}
                                        onChange={(e) => setRegistro((prev) => ({ ...prev, domicilio: { ...prev, numero: parseInt(e.target.value) }, }))}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-[50%]">
                                    <label className="block text-gray-600 font-primary text-sm mb-1" htmlFor="localidad">Localidad</label>
                                    <input
                                        type="text"
                                        id="localidad"
                                        className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                        placeholder="Localidad"
                                        value={user?.domicilio?.localidad}
                                        onChange={(e) => setRegistro((prev) => ({ ...prev, domicilio: { ...prev, localidad: e.target.value }, }))}
                                        required
                                    />
                                </div>
                                <div className="w-[50%]">
                                    <label className="block text-gray-600 font-primary text-sm mb-1" htmlFor="codigoPostal">Código postal</label>
                                    <input
                                        type="number"
                                        id="codigoPostal"
                                        className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                        placeholder="Código postal"
                                        value={user?.domicilio?.codigoPostal || ""}
                                        onChange={(e) => setRegistro((prev) => ({ ...prev, domicilio: { ...prev, codigoPostal: parseInt(e.target.value) }, }))}
                                        required
                                    />
                                </div>
                            </div>
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