import { CustomTable } from "../components/CustomTable";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";

interface Servicio {
  servicio: string;
  dias: string;
  horarios: string;
  profesional: string;
}

const servicios: Servicio[] = [
  { servicio: "Corte de cabello", dias: "Lunes a Jueves", horarios: "8 a 12", profesional: "Carla" },
  { servicio: "Manicura", dias: "Martes y Viernes", horarios: "8 a 12", profesional: "Marta" },
  { servicio: "Tratamiento facial", dias: "Lunes a Viernes", horarios: "8 a 12", profesional: "Sandra" },
];

export default function ServiciosPage() {
  return (
    <div className="bg-[#FFFBFA] min-h-screen flex flex-col">
      {/* Barra superior */}
      <Navbar />

      {/* Layout principal: Sidebar + Contenido */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block w-64 shrink-0 border-r border-[#E9DDE1] bg-[#FFFBFA] h-[calc(100vh-64px)] sticky top-[64px]">
          <Sidebar />
        </aside>

        {/* Contenido */}
        <main className="flex-1 overflow-auto px-6 py-16">
<CustomTable<Servicio>
  title="Servicios"
  columns={[
    { header: "Servicio", accessor: "servicio" },
    { header: "Días", accessor: "dias" },
    { header: "Horarios", accessor: "horarios" },
    { header: "Profesional", accessor: "profesional" },
    {
      header: "Acciones",
      render: (row) => (
        <button
          onClick={() => alert(`Editar: ${row.servicio}`)}
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
    onClick: () => alert("Agregar nuevo servicio"),
  }}
/>
        </main>
      </div>

      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}
