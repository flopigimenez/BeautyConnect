import { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import Footer from "../components/Footer";
import { CustomTable } from "../components/CustomTable";
import AgregarProfesional from "../components/modals/AgregarProfesional";
import NavbarPrestador from "../components/NavbarPrestador";

import type { ProfesionalDTO } from "../types/profesional/ProfesionalDTO";

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

export default function Profesionales() {
  const [profesionales, setProfesionales] = useState<ProfesionalDTO[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfesionales = async () => {
      try {
        setError(null);
        const response = await fetch("http://localhost:8080/api/profesional");
        if (!response.ok) throw new Error("No se pudo obtener profesionales");
        const data = (await response.json()) as ProfesionalDTO[];
        setProfesionales(Array.isArray(data) ? data : []);
      } catch (e: any) {
        console.error("Error fetching profesionales:", e);
        setError(e?.message ?? "Error cargando profesionales");
      }
    };

    fetchProfesionales();
  }, []);

  const handleSave = (nuevo: ProfesionalDTO) => {
    setProfesionales((prev) => [...prev, nuevo]);
    setOpenAdd(false);
  };

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

            <CustomTable<ProfesionalDTO>
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
            const v = typeof s === "string" ? s : (s?.tipoDeServicio ?? s?.TipoDeServicio ?? s?.nombre);
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
                    if (!Array.isArray(arr) || arr.length === 0) return "Sin disponibilidad";
                    const slots = arr.map((d: any) => {
                      const diaKey = (typeof d?.dia === "string" ? d.dia : d?.dia?.toString()) ?? "";
                      const dia = diasSemana[diaKey] ?? prettyEnum(diaKey);
                      return `${dia}: ${cutHHmm(d?.horaInicio)} - ${cutHHmm(d?.horaFinalizacion)}`;
                    });
                    return slots.join(" | ");
                  },
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

      <AgregarProfesional
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={handleSave}
      />

      <Footer />
    </>
  );
}
