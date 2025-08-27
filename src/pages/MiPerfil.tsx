import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { FaUserCircle } from "react-icons/fa";
import { ClienteService } from "../services/ClienteService";
import type { ClienteDTO } from "../types/cliente/ClienteDTO";
import type { ClienteResponseDTO } from "../types/cliente/ClienteResponseDTO";
import type { Rol } from "../types/enums/Rol";
const DEFAULT_ROL: Rol = "CLIENTE" as Rol;
import CambiarPasswordModal from "../components/modals/CambiarPasswordModal";



export default function MiPerfil() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cliente, setCliente] = useState<ClienteResponseDTO | null>(null);

  // form state
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mailVista, setMailVista] = useState(""); // solo visual
  const [uid, setUid] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError("No hay sesión activa.");
        setLoading(false);
        return;
      }
      setUid(user.uid);
      setMailVista(user.email ?? "");
      try {
        setError(null);
        setLoading(true);
        const svc = new ClienteService();
        const found = await svc.getByUid(user.uid);

        if (found) {
          setCliente(found);
          setNombre(found.nombre ?? "");
          setApellido(found.apellido ?? "");
          setTelefono(found.telefono ?? "");
          setMailVista(found.usuario?.mail ?? user.email ?? "");

        } else {
          // No existe cliente: prellenamos con mail/uid de Firebase
          setCliente(null);
          setNombre("");
          setApellido("");
          setTelefono("");
          setMailVista(user.email ?? "");
        }
      } catch (e: any) {
        setError(e.message || "Error al cargar el perfil.");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();

  }, []);

  const onSave = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setError("No hay sesión activa.");
      return;
    }

    const payload: ClienteDTO = {
      nombre,
      apellido,
      telefono,
      usuario: {
        mail: mailVista || user.email || "",
        uid: user.uid,
        rol: cliente?.usuario?.rol ?? DEFAULT_ROL,
        
        contraseña: cliente?.usuario?.contraseña ?? "",
      },
    };

    try {
      setSaving(true);
      setError(null);
      const svc = new ClienteService();

      let updated: ClienteResponseDTO;
      if (cliente?.id) {
        updated = await svc.update(cliente.id, payload);
      } else {
        updated = await svc.create(payload);
      }

      setCliente(updated);
      setNombre(updated.nombre ?? "");
      setApellido(updated.apellido ?? "");
      setTelefono(updated.telefono ?? "");
      setMailVista(updated.usuario?.mail ?? mailVista);
    } catch (e: any) {
      setError(e.message || "No se pudo guardar.");
    } finally {

      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#FFFBFA] min-h-screen px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-15">
          <div className="flex flex-col items-center text-center mb-8">
            <FaUserCircle className="text-6xl text-[#C19BA8] mb-2" />
            <h1 className="text-3xl font-bold font-secondary text-[#703F52]">Mi Perfil</h1>
            <p className="text-sm text-gray-500">Gestioná tus datos personales y configuración de cuenta</p>
          </div>

          {loading ? (
            <p className="text-center text-sm text-gray-500">Cargando perfil...</p>
          ) : error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">{error}</div>
          ) : (
            <>
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
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Tu nombre"
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C19BA8]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#374151] font-primary">Apellido</label>
                      <input
                        type="text"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        placeholder="Tu apellido"
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C19BA8]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#374151] font-primary">Correo electrónico</label>
                      <input
                        type="email"
                        value={mailVista}
                        disabled
                        className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 text-gray-500 shadow-sm px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#374151] font-primary">Teléfono</label>
                      <input
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Ej: 261-1234567"
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
                      <label className="block text-sm font-medium text-[#374151] font-primary">
                        Contraseña (Firebase/Usuario)
                      </label>
                      <input
                        type="password"
                        value="********"
                        disabled
                        className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 text-gray-500 shadow-sm px-3 py-2 text-sm"
                      />
                      <button
                        onClick={() => setShowModal(true)}
                        className="mt-2 text-sm text-[#C19BA8] hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        Cambiar contraseña
                      </button>
                    </div>
                  </div>
                </section>
                <CambiarPasswordModal isOpen={showModal} onClose={() => setShowModal(false)} />
              </div>

              {/* Botón */}
              <div className="flex justify-end mt-10">
                <button
                  onClick={onSave}
                  disabled={saving || !uid}
                  className="bg-[#C19BA8] text-white font-medium px-6 py-2 rounded-full hover:bg-[#a27e8f] transition font-secondary text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
