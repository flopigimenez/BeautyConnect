// src/pages/Profesionales.tsx
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
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
  const [busyId, setBusyId] = useState<number | null>(null);
  const [showInactive, setShowInactive] = useState(false);
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
        const normalizados = profes.map((p) => ({ ...p, active: p.active ?? true }));
        setData(normalizados);
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

  const handleToggle = async (row: ProfesionalResponseDTO) => {
    const isInactive = row.active === false;
    const action = isInactive ? "Reactivar" : "Inactivar";

    const result = await Swal.fire({
      title: `${action} este profesional?`,
      text: isInactive
        ? "El profesional volvera a estar disponible para asignar turnos."
        : "El profesional dejara de estar disponible para nuevos turnos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#a27e8f",
      cancelButtonColor: "#d33",
      confirmButtonText: action,
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      setBusyId(row.id);
      setError(null);
      await profesionalService.deleteProfesional(row.id);
      setData((prev) =>
        prev.map((profesional) =>
          profesional.id === row.id
            ? { ...profesional, active: profesional.active === false ? true : false }
            : profesional
        )
      );
      await Swal.fire({
        icon: "success",
        title: isInactive ? "Profesional reactivado" : "Profesional inactivado",
        confirmButtonColor: "#a27e8f",
      });
    } catch (e: unknown) {
      const message = (e as Error).message || `Error al ${action.toLowerCase()} el profesional.`;
      setError(message);
      Swal.fire({ icon: "error", title: "Error", text: message, confirmButtonColor: "#a27e8f" });
    } finally {
      setBusyId(null);
    }
  };

  const displayedData = useMemo(() => {
    const esInactivo = (profesional: ProfesionalResponseDTO) => profesional.active === false;
    return showInactive
      ? data.filter(esInactivo)
      : data.filter((profesional) => !esInactivo(profesional));
  }, [data, showInactive]);

  return (
    <>
      <NavbarPrestador />
      <div className="bg-[#FFFBFA] min-h-screen flex py-16">
        <aside className="hidden md:block w-64 shrink-0 border-r border-[#E9DDE1] bg-[#FFFBFA] h-[calc(100vh-64px)] sticky top-[64px]">
          <Sidebar />
        </aside>

        <main className="container mx-auto px-4 py-8 min-h-screen">
          {loading && <p>Cargando profesionales...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <>
              <div className="flex justify-end mb-4">
                <button
                  className="rounded-full border border-[#C19BA8] px-5 py-2 text-[#703F52] hover:bg-[#f4e6eb] cursor-pointer"
                  onClick={() => setShowInactive((prev) => !prev)}
                >
                  {showInactive ? "Ver activos" : "Ver inactivos"}
                </button>
              </div>
              <CustomTable<ProfesionalResponseDTO>
                title="Profesionales"
                columns={[
                  { header: "Nombre", accessor: "nombre" },
                  { header: "Apellido", accessor: "apellido" },
                  { header: "Contacto", accessor: "contacto" },
                  { header: "Estado", render: (row) => (row.active === false ? "Inactivo" : "Activo") },
                  {
                    header: "Acciones",
                    accessor: "acciones" as unknown as keyof ProfesionalResponseDTO,
                    render: (row) => (
                      <div className="flex flex-wrap gap-3">
                        <button
                          className="text-blue-600 hover:underline disabled:opacity-50 cursor-pointer"
                          onClick={() => handleOpenEdit(row)}
                          disabled={busyId === row.id}
                        >
                          Editar
                        </button>
                        <button
                          className="text-blue-600 hover:underline disabled:opacity-50 cursor-pointer"
                          onClick={() => {
                            setSelectedForSchedule(row);
                            setOpenSchedule(true);
                          }}
                          disabled={busyId === row.id}
                        >
                          Jornada laboral
                        </button>
                        <button
                          className="text-blue-600 hover:underline disabled:opacity-50 cursor-pointer"
                          onClick={() => {
                            setSelectedForPS(row);
                            setOpenPS(true);
                          }}
                          disabled={busyId === row.id}
                        >
                          Servicios
                        </button>
                        <button
                          className="text-red-600 hover:underline disabled:opacity-50 cursor-pointer"
                          onClick={() => handleToggle(row)}
                          disabled={busyId === row.id}
                        >
                          {busyId === row.id ? "Procesando..." : row.active === false ? "Reactivar" : "Inactivar"}
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={displayedData}
                actionButton={{
                  label: "Agregar Profesional",
                  onClick: () => setOpenAdd(true),
                }}
              />
            </>
          )}

          {openAdd && centroId != null && (
            <AgregarProfesional
              centroId={centroId}
              onCreated={(nuevo) => {
                const normalizado = { ...nuevo, active: nuevo.active ?? true };
                setData((prev) => [normalizado, ...prev]);
              }}
              onClose={() => setOpenAdd(false)}
            />
          )}

          {openEdit && selected && (
            <AgregarProfesional
              profesional={selected}
              onUpdated={(actualizado) => {
                const normalizado = { ...actualizado, active: actualizado.active ?? true };
                setData((prev) => prev.map((p) => (p.id === normalizado.id ? normalizado : p)));
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
