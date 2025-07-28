import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MiPerfil = () => {
  return (
    <>
      <Navbar />
      <div className="bg-[#FFFBFA] min-h-screen px-6 py-18">
        <div className="max-w-3xl mx-auto bg-white rounded-md p-6 bg-[#FAFAFA]">
          <h1 className="text-3xl font-bold font-secondary text-[#111827] mb-6">Perfil</h1>

          {/* Información personal */}
          <div className="space-y-6 ">
            <div>
              <h2 className="text-lg font-semibold font-secondary text-[#111827] mb-2">
                Información personal
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] font-primary">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C19BA8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] font-primary">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C19BA8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] font-primary">
                    Número de teléfono
                  </label>
                  <input
                    type="tel"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C19BA8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] font-primary">
                    Dirección
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C19BA8]"
                  />
                </div>
              </div>
            </div>

            {/* Configuración de cuenta */}
            <div>
              <h2 className="text-lg font-semibold font-secondary text-[#111827] mb-2">
                Configuración de la cuenta
              </h2>

              <div>
                <label className="block text-sm font-medium text-[#374151] font-primary">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C19BA8]"
                />
              </div>
            </div>
          </div>

          {/* Botón */}
          <div className="flex justify-end mt-8">
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
