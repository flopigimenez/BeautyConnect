import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";
import AgregarServicio from "../components/modals/AgregarServicio";
import { ServicioService } from "../services/ServicioService";
import { ProfesionalService } from "../services/ProfesionalService";
import type { ServicioDTO } from "../types/servicio/ServicioDTO";
import type { ProfesionalDTO } from "../types/profesional/ProfesionalDTO";
import type { CentroDeEsteticaDTO } from "../types/centroDeEstetica/CentroDeEsteticaDTO";
import { TipoDeServicio as TipoDeServicioEnum } from "../types/enums/TipoDeServicio";

const servicioService = new ServicioService();
const profesionalService = new ProfesionalService();

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<ServicioDTO[]>([]);
  const [profesionales, setProfesionales] = useState<ProfesionalDTO[]>([]);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    // Adaptar ServicioResponseDTO a ServicioDTO
    servicioService.getAll().then((respuestas) => {
      const serviciosAdaptados: ServicioDTO[] = respuestas.map((servicio: any) => ({
        id: servicio.id,
        tipoDeServicio: servicio.tipoDeServicio,
        duracion: servicio.duracion,
        precio: servicio.precio,
        centroDeEsteticaDTO: {
          ...servicio.centroDeEstetica,
          servicios: servicio.centroDeEstetica?.servicios
            ? servicio.centroDeEstetica.servicios.map((s: any) => ({
                ...s,
                centroDeEsteticaDTO: servicio.centroDeEstetica,
              }))
            : [],
        } as CentroDeEsteticaDTO,
      }));
      setServicios(serviciosAdaptados);
    });

    // Adaptar ProfesionalResponseDTO a ProfesionalDTO
    profesionalService.getAll().then((respuestas) => {
      const profesionalesAdaptados: ProfesionalDTO[] = respuestas.map((profesional: any) => ({
        ...profesional,
        servicios: profesional.servicios
          ? profesional.servicios.map((servicio: any) => ({
              ...servicio,
              centroDeEsteticaDTO: servicio.centroDeEstetica,
            }))
          : [],
        centroDeEstetica: profesional.centroDeEstetica,
      }));
      setProfesionales(profesionalesAdaptados);
    });
  }, []);

  const handleSave = async (nuevo: ServicioDTO) => {
    try {
      const servicioGuardado = await servicioService.post(nuevo);
      setServicios((prev) => [...prev, servicioGuardado]);
    } catch (error) {
      // Puedes mostrar un mensaje de error aquí si lo deseas
      console.error("Error al guardar el servicio:", error);
    }
  };

  const tiposDeServicio = Object.values(TipoDeServicioEnum);

  return (
    <div className="bg-[#FFFBFA] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block w-64 shrink-0 border-r border-[#E9DDE1] bg-[#FFFBFA] h-[calc(100vh-64px)] sticky top-[64px]">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-auto px-6 py-16">
          <CustomTable<ServicioDTO>
            title="Servicios"
            columns={[
              { header: "Tipo", accessor: "tipoDeServicio" },
              { header: "Duración", accessor: "duracion", render: row => `${row.duracion} min` },
              { header: "Precio", accessor: "precio", render: row => `$${row.precio}` },
              {
                header: "Acciones",
                render: (row) => (
                  <button
                    onClick={() => alert(`Editar: ${row.tipoDeServicio}`)}
                    className="bg-[#C19BA8] px-3 py-1 rounded-full hover:bg-[#C4A1B5] text-sm"
                  >
                    Editar
                  </button>
                ),
              },
            ]}
            data={servicios}
            actionButton={{
              label: "Agregar Servicio",
              onClick: () => setOpenAdd(true),
            }}
          />
        </main>
      </div>
      <AgregarServicio
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={handleSave}
        profesionales={profesionales}
        tiposDeServicio={tiposDeServicio}
      />
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}