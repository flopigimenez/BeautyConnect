import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CustomTable } from "../components/CustomTable";
import type { ProfesionalDTO } from "../types/profesional/ProfesionalDTO";
export default function Profesionales() {
  return (
    <>
      <Navbar />
      <div className="bg-[#FFFBFA] min-h-screen px-6 py-12">
        <Sidebar />
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-15">
          <h1 className="text-3xl font-bold font-secondary text-[#703F52] mb-6">Profesionales</h1>
          <CustomTable<ProfesionalDTO>
            columns={[
              { header: "Nombre", accessor: "nombre" },
              { header: "Apellido", accessor: "apellido" },
              { header: "Servicios", accessor: "servicios" },
              { header: "Disponibilidad", accessor: "disponibilidades" },
            ]}
            data={[]}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
