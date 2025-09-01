import { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import Footer from "../components/Footer";
import { CustomTable } from "../components/CustomTable";
import AgregarProfesional from "../components/modals/AgregarProfesional";
import NavbarPrestador from "../components/NavbarPrestador";
import type { ProfesionalDTO } from "../types/profesional/ProfesionalDTO";
import { ProfesionalService } from "../services/ProfesionalService";
import type { ProfesionalResponseDTO } from "../types/profesional/ProfesionalResponseDTO";
import type { DisponibilidadDTO } from "../types/disponibilidad/DisponibilidadDTO";
import  { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";
const diasSemana: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const prettyEnum = (val?: string) =>
  (val ?? "")
    .toString()
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const cutHHmm = (t?: string) => (!t ? "" : t.length >= 5 ? t.slice(0, 5) : t);

const svc = new ProfesionalService();
const centroSvc = new CentroDeEsteticaService();

export default function Profesionales() {
  const [profesionales, setProfesionales] = useState<ProfesionalResponseDTO[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<ProfesionalResponseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null); // para deshabilitar botones mientras se opera

  useEffect(() => {
    const fetchProfesionales = async () => {
      try {
        setError(null);
        const data = await svc.getAll(); // GET /api/profesional
        setProfesionales(Array.isArray(data) ? data : []);
      } catch (e: any) {
        console.error("Error fetching profesionales:", e);
        setError(e?.message ?? "Error cargando profesionales");
      }
    };

    fetchProfesionales();
  }, []);


const handleCreate = async (nuevo: ProfesionalDTO) => {
  try {
    setError(null);
    const centroActualizado = await centroSvc.agregarProfesional(1, nuevo); 
    
    const profesionalesActualizados = centroActualizado.profesionales; 
    setProfesionales(profesionalesActualizados);

    
    setOpenAdd(false);
  } catch (e: any) {
    console.error(e);
    setError(e?.message ?? "No se pudo crear el profesional");
  }
};

  // Abrir edición
  const handleOpenEdit = (row: ProfesionalResponseDTO) => {
    setSelected(row);
    setOpenEdit(true);
  };

  // Confirmar edición
const handleUpdate = async (values: ProfesionalDTO) => {
  if (!selected) return;
  try {
    setError(null);
    setBusyId(selected.id);
    const updated = await svc.update(selected.id, values); // POST /update?profesionalId=
    setProfesionales(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    setOpenEdit(false);
    setSelected(null);
  } catch (e: any) {
    setError(e?.message ?? "No se pudo actualizar el profesional");
  } finally {
    setBusyId(null);
  }
}
  // Eliminar
  // const handleDelete = async (row: ProfesionalResponseDTO) => {
  //   const ok = window.confirm(`¿Eliminar a ${row.nombre} ${row.apellido}?`);
  //   if (!ok) return;

  //   try {
  //     setError(null);
  //     setBusyId(row.id);
  //     await svc.deleteById(row.id); // DELETE
  //     setProfesionales((prev) => prev.filter((p) => p.id !== row.id));
  //   } catch (e: any) {
  //     console.error(e);
  //     setError(e?.message ?? "No se pudo eliminar el profesional");
  //   } finally {
  //     setBusyId(null);
  //   }
  // };

  // Valores para precargar el modal en edición
  const selectedAsDTO: ProfesionalDTO | undefined = selected
    ? {
        nombre: selected.nombre,
        apellido: selected.apellido,
        servicios: selected.servicios ?? [],
        disponibilidades: selected.disponibilidades ?? [],
      }
    : undefined;

  return (
    <>
      <NavbarPrestador />
      <div className="bg-[#FFFBFA] min-h-screen flex">
        <aside className="hidden md:block w-64 shrink-0 border-r border-[#E9DDE1] bg-[#FFFBFA] h-[calc(100vh-64px)] sticky top-[64px]">
          <Sidebar />
        </aside>

        <main className="flex-1 px-6 py-16">
          <div className="max-w-6xl mx-auto">
            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <CustomTable<ProfesionalResponseDTO>
              title="Profesionales"
              columns={[
                { header: "Nombre", accessor: "nombre" },
                { header: "Apellido", accessor: "apellido" },
                {
                  header: "Servicios",
                  render: (row) =>
                    row.servicios && row.servicios.length > 0
                      ? row.servicios
                          .map((s: any) => {
                            const v =
                              typeof s === "string"
                                ? s
                                : (s?.tipoDeServicio ??
                                   s?.TipoDeServicio ??
                                   s?.nombre);
                            return (v ?? "")
                              .toString()
                              .toLowerCase()
                              .split("_")
                              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                              .join(" ");
                          })
                          .join(", ")
                      : "Sin servicios",
                },
                {
                  header: "Disponibilidad",
                  render: (row) => {
                    const arr = row.disponibilidades ?? [];
                    if (!Array.isArray(arr) || arr.length === 0)
                      return "Sin disponibilidad";
                    const slots = arr.map((d: DisponibilidadDTO) => {
  const diaKey = d.dia ?? "";
  const dia = diasSemana[diaKey] ?? prettyEnum(diaKey);
  return `${dia}: ${cutHHmm(d.horaInicio)} - ${cutHHmm(d.horaFinalizacion)}`;
});
                    return slots.join(" | ");
                  },
                },
                {
                  header: "Acciones",
                  render: (row) => (
                    <div className="flex space-x-3">
                      <button
                        className="text-blue-600 hover:underline disabled:opacity-50"
                        onClick={() => handleOpenEdit(row)}
                        disabled={busyId === row.id}
                      >
                        Editar
                      </button>
                      {/* { <button
                        className="text-red-600 hover:underline disabled:opacity-50"
                        onClick={() => handleDelete(row)}
                        disabled={busyId === row.id}
                      >
                        Eliminar
                      </button> } */}
                    </div>
                  ),
                },
              ]}
              data={profesionales}
              actionButton={{
                label: "Agregar Profesional",
                onClick: () => setOpenAdd(true),
              }}
            />
          </div>
        </main>
      </div>

      {/* Modal Agregar */}
      <AgregarProfesional
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        mode="add"
        onSubmit={handleCreate}
      />

      {/* Modal Editar (reutilizado) */}
      <AgregarProfesional
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelected(null);
        }}
        mode="edit"
        initialValues={selectedAsDTO}
        onSubmit={handleUpdate}
      />

      <Footer />
    </>
  );
}
