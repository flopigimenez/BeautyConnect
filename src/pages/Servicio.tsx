// src/pages/Servicio.tsx
import Footer from "../components/Footer";
import NavbarPrestador from "../components/NavbarPrestador";
import Sidebar from "../components/SideBar";
import { CustomTable } from "../components/CustomTable";
import type { ServicioResponseDTO } from "../types/servicio/ServicioResponseDTO";
import { useEffect, useState } from "react";
import { ServicioService } from "../services/ServicioService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AgregarServicio from "../components/modals/AgregarServicio";

const servicioService = new ServicioService();

const Servicio = () => {
  const [data, setData] = useState<ServicioResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId] = useState<number | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<ServicioResponseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        setError("No hay usuario autenticado.");
        return;
      }
      try {
        setLoading(true);
        const uid = user.uid;
        const servicios = await servicioService.findByUid(uid);
        setData(servicios);
      } catch (e: unknown) {
        setError((e as Error).message ?? "Error al cargar servicios.");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const handleOpenEdit = (row: ServicioResponseDTO) => {
    setSelected(row);
    setOpenEdit(true);
  };

  return (
    <>
      <NavbarPrestador />
      <div className="bg-[#FFFBFA] min-h-screen flex py-16">
        <aside className="hidden md:block w-64 shrink-0 border-r border-[#E9DDE1] bg-[#FFFBFA] h-[calc(100vh-64px)] sticky top-[64px]">
          <Sidebar />
        </aside>

        <main className="container mx-auto px-4 py-8 min-h-screen">
          {loading && <p>Cargando servicios…</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <CustomTable<ServicioResponseDTO>
              title="Servicios"
              columns={[
                { header: "Tipo", accessor: "tipoDeServicio" },
                {
                  header: "Precio",
                  accessor: "precio",
                  render: (row) => (
                    <span>
                      $
                      {typeof row.precio === "number"
                        ? row.precio.toFixed(2)
                        : row.precio}
                    </span>
                  ),
                },
                {
                  header: "Acciones",
                  accessor: "acciones" as any, // si tu tabla exige accessor
                  render: (row) => (
                    <div className="flex space-x-3">
                      <button
                        className="text-blue-600 hover:underline disabled:opacity-50"
                        onClick={() => handleOpenEdit(row)}
                        disabled={busyId === row.id}
                      >
                        Editar
                      </button>
                    </div>
                  ),
                },
              ]}
              data={data}
              actionButton={{
                label: "Agregar Servicio",
                onClick: () => {
                  setSelected(null);
                  setOpenEdit(true);
                },
              }}
            />
          )}

          {/* Modal fuera del CustomTable */}
          {openEdit && (
            <AgregarServicio
              servicio={selected}
              onCreated={(nuevo) => {
                setData((prev) => [nuevo, ...prev]);
              }}
              onUpdated={(actualizado) => {
                setData((prev) => prev.map((s) => (s.id === actualizado.id ? actualizado : s)));
              }}
              onClose={() => setOpenEdit(false)}
            />
          )}
        </main>
      </div>

      <Footer />
    </>
  );
};

export default Servicio;
