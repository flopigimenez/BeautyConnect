
const Navbar = () => {
    return (
        <nav className="bg-primary shadow-md fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="/" className="text-xl font-bold text-gray-900 font-secondary">BeautyConnect</a>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <a href="/" className="text-gray-600 hover:text-gray-900 font-primary">Inicio</a>
                            <a href="/centros" className="text-gray-600 hover:text-gray-900 font-primary">Centros</a>
                            <a href="/turnos" className="text-gray-600 hover:text-gray-900 font-primary">Turnos</a>
                        </div>
                    </div>
                    <div className="ml-10 flex items-baseline space-x-4">

                        <a href="/login" className="text-gray-600 hover:text-gray-900 font-primary">Iniciar sesión</a>
                    </div>
                </div>
            </div>
            <hr className="border-secondary border-1 w-[100%]" />
        </nav>
    );
}

export default Navbar;