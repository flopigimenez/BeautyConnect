import { useState } from "react";
import { CustomTable } from "../components/CustomTable";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";
import AgregarServicio from "../components/modals/agregarServicio";
import type { ServicioDTO } from "../types/servicio/ServicioDTO";
import type { ProfesionalDTO } from "../types/profesional/ProfesionalDTO";

// Ejemplo de tipos de servicio
import { TipoDeServicio as TipoDeServicioEnum } from "../types/enums/TipoDeServicio";

// Ejemplo de profesionales
const profesionalesEjemplo: ProfesionalDTO[] = [
  {
    id: 1,
    nombre: "Carla",
    disponibilidades: [],
    servicios: [],
    centroDeEstetica: { id: 1, nombre: "Belleza Total", domicilio: { id: 1, calle: "Calle Falsa 123", localidad: "Ciudad Falsa", numero: 123, codigoPostal: 12345 }, descripcion: "Centro de estética de ejemplo", imagen: "https://via.placeholder.com/150", docValido: "Documento válido", cuit: 12345678, servicios: [], turnos: [], reseñas: [] },
  },
  {
    id: 2,
    nombre: "Marta",
    disponibilidades: [],
    servicios: [],
    centroDeEstetica: { id: 1, nombre: "Belleza Total",  domicilio: { id: 2, calle: "Calle Falsa 123", localidad: "Ciudad Falsa", numero: 123, codigoPostal: 12345 }, descripcion: "Centro de estética de ejemplo", imagen: "https://via.placeholder.com/150", docValido: "Documento válido", cuit: 12345678, servicios: [], turnos: [], reseñas: [] },
  },
];

// Ejemplo de servicios iniciales
const iniciales: ServicioDTO[] = [
  {
    id: 1,
    tipoDeServicio: TipoDeServicioEnum.PELUQUERIA,
    descripcion: "Corte de cabello",
    duracion: 30,
    precio: 1000,
    centroDeEsteticaDTO: profesionalesEjemplo[0].centroDeEstetica,
  },
  {
    id: 2,
    tipoDeServicio: TipoDeServicioEnum.MANICURA,
    descripcion: "Manicura",
    duracion: 45,
    precio: 1200,
    centroDeEsteticaDTO: profesionalesEjemplo[1].centroDeEstetica,
  },
];

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<ServicioDTO[]>(iniciales);
  const [openAdd, setOpenAdd] = useState(false);

  const handleSave = (nuevo: ServicioDTO) => {
    setServicios((prev) => [...prev, nuevo]);
  };

  // Array de tipos de servicio para el select
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
              { header: "Descripción", accessor: "descripcion" },
              { header: "Duración", accessor: "duracion", render: row => `${row.duracion} min` },
              { header: "Precio", accessor: "precio", render: row => `$${row.precio}` },
              {
                header: "Acciones",
                render: (row) => (
                  <button
                    onClick={() => alert(`Editar: ${row.descripcion}`)}
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
        profesionales={profesionalesEjemplo}
        tiposDeServicio={tiposDeServicio}
      />
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}