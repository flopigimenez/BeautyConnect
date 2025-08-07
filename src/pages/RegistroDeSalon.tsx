const RegistroDeSalon = () => {
    return (
        <>
            <div className="bg-primary w-screen pt-10 flex flex-col items-center">
                <h1 className="font-secondary text-2xl font-bold mb-3">Registra tu salón</h1>
                <form className="mt-5 w-[45rem]">
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="nombre">Nombre del salón</label>
                        <input
                            type="nombre"
                            id="nombre"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa tu nombre completo"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="file">Debes ingresar un documento que acredite la validez du salón:</label>
                        <input
                            type="file"
                            id="file"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Selecciona un archivo"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="direccion">Dirección</label>
                        <input
                            type="text"
                            id="direccion"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa la dirección de tu salon"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="servicios">Servicios</label>
                        <select name="" id="servicios">
                            {

                            }
                        </select>
                        {/* <input
                            type="text"
                            id="confirmPassword"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Selecciona al menos un servicio"
                        /> */}
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="cuit">CUIT</label>
                        <input
                            type="number"
                            id="cuit"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ingresa el cuit de tu negocio"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="DescripcionDeServicios">Descripcion de servicios</label>
                        <input
                            type="text"
                            id="DescripcionDeServicios"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-primary mb-2" htmlFor="HorarioComercial">Horario comercial</label>
                        <input
                            type="datetime-local"
                            id="HorarioComercial"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ej. Lun-Vie: 9 AM - 7 PM, Sáb: 10 AM - 6 PM"
                        />
                    </div>
                    <div className="flex flex-col items-center mb-10">
                        <button
                            type="submit"
                            className="w-[90%] bg-secondary text-white font-bold py-2 rounded-full hover:bg-[#a27e8f] transition font-secondary"
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