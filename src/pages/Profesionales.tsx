// src/pages/Profesionales.tsx
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavbarPrestador from "../components/NavbarPrestador";
import Sidebar from "../components/SideBar";
import Footer from "../components/Footer";
import { CustomTable } from "../components/CustomTable";
import { ProfesionalService } from "../services/ProfesionalService";
import type { ProfesionalResponseDTO } from "../types/profesional/ProfesionalResponseDTO";
import { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";
import AgregarProfesional from "../components/modals/AgregarProfesional";
import GestionJornadaLaboral from "../components/modals/GestionJornadaLaboral";
import GestionProfesionalServicio from "../components/modals/GestionProfesionalServicio";

const profesionalService = new ProfesionalService();
const centroService = new CentroDeEsteticaService();

export default function Profesionales() {
  const [data, setData] = useState<ProfesionalResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [centroId, setCentroId] = useState<number | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<ProfesionalResponseDTO | null>(null);
    const [busyId] = useState<number | null>(null);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [selectedForSchedule, setSelectedForSchedule] = useState<ProfesionalResponseDTO | null>(null);
  const [openPS, setOpenPS] = useState(false);
  const [selectedForPS, setSelectedForPS] = useState<ProfesionalResponseDTO | null>(null);


  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), async (user) => {
      if (!user) { setLoading(false); setError("No hay usuario autenticado."); return; }
      try {
        setLoading(true);
        const uid = user.uid;
        const [profes, cId] = await Promise.all([
          profesionalService.findByUid(uid),
          centroService.getMiCentroId(uid),
        ]);
        setData(profes);
        setCentroId(cId);
      } catch (error: unknown) {
        setError((error as Error).message ?? "Error al cargar profesionales");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

   const handleOpenEdit = (row: ProfesionalResponseDTO) => {
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
          {loading && <p>Cargando profesionales…</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <CustomTable<ProfesionalResponseDTO>
              title="Profesionales"
              columns={[
                { header: "Nombre", accessor: "nombre" },
                { header: "Apellido", accessor: "apellido" },
                { header: "Acciones", accessor: "acciones" as unknown as keyof ProfesionalResponseDTO,
                    render: (row) => (
                  <div className="flex space-x-3">
                      <button
                        className="text-blue-600 hover:underline disabled:opacity-50"
                        onClick={() => handleOpenEdit(row)}
                        disabled={busyId === row.id}
                      >
                        Editar
                      </button>
                      <button
                        className="text-blue-600 hover:underline disabled:opacity-50"
                        onClick={() => { setSelectedForSchedule(row); setOpenSchedule(true); }}
                        disabled={busyId === row.id}
                      >
                        Jornada laboral
                      </button>
                      <button
                        className="text-blue-600 hover:underline disabled:opacity-50"
                        onClick={() => { setSelectedForPS(row); setOpenPS(true); }}
                        disabled={busyId === row.id}
                      >
                        Servicios
                      </button>
                    </div>
                  ),
                }
              ]}
              data={data}
              actionButton={{
                label: "Agregar Profesional",
                onClick: () => setOpenAdd(true),
              }}
            />
          )}

          {openAdd && centroId != null && (
            <AgregarProfesional
              centroId={centroId}
              onCreated={(nuevo) => setData((prev) => [nuevo, ...prev])}
              onClose={() => setOpenAdd(false)}
            />
          )}

          {openEdit && selected && (
            <AgregarProfesional
              profesional={selected}
              onUpdated={(actualizado) => {
                setData((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)));
              }}
              onClose={() => setOpenEdit(false)}
            />
          )}

          {openSchedule && selectedForSchedule && (
            <GestionJornadaLaboral
              profesional={selectedForSchedule}
              onClose={() => setOpenSchedule(false)}
            />
          )}

          {openPS && selectedForPS && (
            <GestionProfesionalServicio
              profesional={selectedForPS}
              centroId={centroId ?? undefined}
              onClose={() => setOpenPS(false)}
            />
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
