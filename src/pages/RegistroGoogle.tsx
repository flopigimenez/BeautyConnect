import { useEffect, useState } from "react"
import type { PrestadorServicioDTO } from "../types/prestadorDeServicio/PestadorServicioDTO"
import { useAppDispatch, useAppSelector } from "../redux/store/hooks"
import { Rol } from "../types/enums/Rol"
import { updateUserCliente, updateUserPrestador } from "../redux/store/authSlice"
import { useNavigate } from "react-router-dom"
import Footer from "../components/Footer"

const RegistroGoogle = () => {
    const navigate = useNavigate()
    const { user, error } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch()

    const isCliente = user?.usuario.rol === Rol.CLIENTE

    const getInitialRegistro = (): PrestadorServicioDTO => ({
        nombre: user?.nombre ?? "",
        apellido: user?.apellido ?? "",
        telefono: user?.telefono ?? "",
        usuario: {
            mail: user?.usuario.mail ?? "",
            rol: user?.usuario.rol ?? Rol.CLIENTE,
            uid: user?.usuario.uid ?? "",
        },
    })

    /*const getInitialAddress = (): AddressValue => {
        const cliente = user as ClienteDTO;
        //const domicilio = user?.domicilio
        const domicilio = cliente?.domicilio
        if (domicilio) {
            return {
                calle: domicilio.calle ?? "",
                numero: domicilio.numero ?? undefined,
                localidad: domicilio.localidad ?? "",
                codigoPostal: domicilio.codigoPostal ?? undefined,
                provincia: domicilio.provincia ?? "",
            }
        }

        return {
            calle: "",
            numero: undefined,
            localidad: "",
            codigoPostal: undefined,
            provincia: "",
        }
    }*/

    const [registro, setRegistro] = useState<PrestadorServicioDTO>(getInitialRegistro)
    // const [domicilioForm, setDomicilioForm] = useState<AddressValue>(getInitialAddress)

    useEffect(() => {
        setRegistro(getInitialRegistro());
        // setDomicilioForm(getInitialAddress());
        /*if (registro) {
            const redirectPath = isCliente ? "/" : "/RegistroDeSalon";
            navigate(redirectPath);
        }*/
    }, [user, isCliente, navigate])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (isCliente) {
            dispatch(updateUserCliente(registro))
            navigate("/")
        } else {
            dispatch(updateUserPrestador(registro))
            navigate("/RegistroDeSalon")
        }
    }

    return (
        <>
            {error ? (<p className="text-red-500">{error}</p>) : (
                <div className="bg-primary w-screen pt-20 flex flex-col items-center min-h-[85vh]">
                    <h1 className="font-secondary text-2xl font-bold text-tertiary">Finaliza tu registro</h1>
                    <form className="mt-5 w-[20rem] md:w-[45rem]" onSubmit={handleSubmit}>
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
                            <label className="block text-gray-700 font-primary mb-2" htmlFor="telefono">Telefono</label>
                            <input
                                type="number"
                                id="telefono"
                                className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Ingresa tu numero de telefono"
                                value={registro.telefono || ""}
                                onChange={(e) => setRegistro(prev => ({ ...prev, telefono: e.target.value }))}
                            />
                        </div>
                        {/* {isCliente && (
                            <div className="mb-5">
                                <AddressFieldset
                                    value={domicilioForm}
                                    onChange={setDomicilioForm}
                                    className="bg-white rounded-2xl p-4 border border-gray-200"
                                />
                            </div>
                        )} */}
                        <div className="flex flex-col items-center m-10">
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
            <Footer />
        </>
    )
}

export default RegistroGoogle
