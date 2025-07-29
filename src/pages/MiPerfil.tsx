import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { FaUserCircle } from "react-icons/fa";

const MiPerfil = () => {
  return (
    <>
      <Navbar />
      <div className="bg-[#FFFBFA] min-h-screen px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-15">

          {/* Encabezado */}
          <div className="flex flex-col items-center text-center mb-8">
            <FaUserCircle className="text-6xl text-[#C19BA8] mb-2" />
            <h1 className="text-3xl font-bold font-secondary text-[#703F52]">Mi Perfil</h1>
            <p className="text-sm text-gray-500">Gestioná tus datos personales y configuración de cuenta</p>
          </div>

          <div className="space-y-10">
            {/* Información personal */}
            <section>
              <h2 className="text-lg font-semibold font-secondary text-[#703F52] mb-4">
                Información personal
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#374151] font-primary">Nombre</label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C19BA8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] font-primary">Correo electrónico</label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C19BA8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] font-primary">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="Ej: 261-1234567"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C19BA8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] font-primary">Dirección</label>
                  <input
                    type="text"
                    placeholder="Calle 123, Ciudad"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C19BA8]"
                  />
                </div>
              </div>
            </section>

            {/* Configuración de cuenta */}
            <section>
              <h2 className="text-lg font-semibold font-secondary text-[#703F52] mb-4">
                Configuración de la cuenta
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#374151] font-primary">Contraseña actual</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C19BA8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] font-primary">Nueva contraseña</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C19BA8]"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Botón */}
          <div className="flex justify-end mt-10">
            <button className="bg-[#C19BA8] text-white font-medium px-6 py-2 rounded-full hover:bg-[#a27e8f] transition font-secondary text-sm">
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MiPerfil;
