import Sidebar from "../components/SideBar";
import Footer from "../components/Footer";
import { CustomTable } from "../components/CustomTable";
import type { ProfesionalDTO } from "../types/profesional/ProfesionalDTO";
import { useEffect, useState } from "react";
import AgregarProfesional from "../components/modals/AgregarProfesional";
import NavbarPrestador from "../components/NavbarPrestador";
const diasSemana: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export default function Profesionales() {
  const [profesionales, setProfesionales] = useState<ProfesionalDTO[]>([]);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    const fetchProfesionales = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/profesional");
        const data = await response.json();
        setProfesionales(data);
      } catch (error) {
        console.error("Error fetching profesionales:", error);
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
        <Sidebar />
        <main className="flex-1 px-6 py-21">
          <div>

            <CustomTable<ProfesionalDTO>
               title="Profesionales"
              columns={[
                { header: "Nombre", accessor: "nombre" },
                { header: "Apellido", accessor: "apellido" },
                {
                  header: "Servicios",
                  render: (row) =>
                    row.servicios && row.servicios.length > 0
                      ? row.servicios.map((s) => s.tipoDeServicio).join(", ")
                      : "Sin servicios",
                },
                {
                  header: "Disponibilidad",
                  render: (row) =>
                    row.disponibilidades && row.disponibilidades.length > 0
                      ? row.disponibilidades
                          .map((d) => {
                            const diaKey =
                              typeof d.dia === "string"
                                ? d.dia
                                : d.dia?.toString();
                            return `${diasSemana[diaKey as string] ?? diaKey}: ${d.horaInicio} - ${d.horaFinalizacion}`;
                          })
                          .join(" | ")
                      : "Sin disponibilidad",
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
