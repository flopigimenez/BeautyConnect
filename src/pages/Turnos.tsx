import Navbar from "../components/Navbar"

const Turnos = () => {
    return (
        <>
            <Navbar />
            <div className="flex-col pt-10 bg-primary w-screen">
                <h1 className="font-secondary text-2xl font-bold text-center">Reserva tu turno en 2 simples pasos</h1>
                <div className="pl-[50vh] mt-10">
                    <p className="font-primary">Paso 1 de 2</p>
                    <div className="w-[50rem] h-1.5 rounded-full overflow-hidden flex mt-5">
                        <div className="w-1/2 bg-secondary"></div>
                        <div className="w-1/2 bg-gray-300"></div>
                    </div>

                    <h2 className="mt-10 font-secondary text-l font-bold">Selecciona el servicio</h2>
                    <select name="" id="">
                        <option value=""></option>
                    </select>
                </div>
            </div>
        </>
    )
}

export default Turnos
