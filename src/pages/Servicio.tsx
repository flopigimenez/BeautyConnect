import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import Footer from "../components/Footer";
import NavbarPrestador from "../components/NavbarPrestador";
import Sidebar from "../components/SideBar";
import AgregarServicio from "../components/modals/AgregarServicio";
import { ServicioService } from "../services/ServicioService";
import { ProfesionalService } from "../services/ProfesionalService";
import { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";
import type { ServicioDTO } from "../types/servicio/ServicioDTO";
import type { ProfesionalDTO } from "../types/profesional/ProfesionalDTO";
import type { CentroDeEsteticaDTO } from "../types/centroDeEstetica/CentroDeEsteticaDTO";
import { TipoDeServicio as TipoDeServicioEnum } from "../types/enums/TipoDeServicio";
import type { ServicioResponseDTO } from "../types/servicio/ServicioResponseDTO";
import type { CentroEsteticaResponseDTO } from "../types/centroDeEstetica/CentroEsteticaResponseDTO";
import { useAppSelector } from "../redux/store/hooks";
import type { RootState } from "../redux/store";

const servicioService = new ServicioService();
const profesionalService = new ProfesionalService();
const centroService = new CentroDeEsteticaService();

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<ServicioDTO[]>([]);
  const [profesionales, setProfesionales] = useState<ProfesionalDTO[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [centroId, setCentroId] = useState<number | null>(null);

  const user = useAppSelector((state: RootState) => state.user.user);

  useEffect(() => {
    // Adaptar ServicioResponseDTO a ServicioDTO, respetando las claves del backend
    servicioService.getAll().then((respuestas) => {
      const serviciosAdaptados: ServicioDTO[] = (respuestas as ServicioResponseDTO[]).map(
        (servicio) => ({
          id: servicio.id,
          tipoDeServicio: servicio.tipoDeServicio,
          duracion: servicio.duracion,
          precio: servicio.precio,
          centroDeEsteticaDTO: mapCentro(servicio.CentroDeEstetica),
        })
      );
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

  // Detectar centro del prestador logueado por UID
  useEffect(() => {
    const uid = (user as any)?.usuario?.uid as string | undefined;
    if (!uid) return;
    centroService
      .getByPrestadorUid(uid)
      .then((centro) => {
        if (centro) setCentroId(centro.id);
      })
      .catch(() => setCentroId(null));
  }, [user]);

  function mapCentro(centro: CentroEsteticaResponseDTO | null): CentroDeEsteticaDTO {
    if (!centro) {
      // En caso de que el backend retorne null, devolvemos un objeto minimo coherente
      return {
        id: 0,
        nombre: "",
        descripcion: "",
        imagen: "",
        docValido: "",
        cuit: 0,
        domicilio: { calle: "", numero: 0, codigoPostal: 0, localidad: "" },
      } as CentroDeEsteticaDTO;
    }
    return {
      id: centro.id,
      nombre: centro.nombre,
      descripcion: centro.descripcion,
      imagen: centro.imagen,
      docValido: centro.docValido,
      cuit: centro.cuit,
      domicilio: centro.domicilio,
    } as CentroDeEsteticaDTO;
  }

  const handleSaveWithCentro = async (nuevo: ServicioDTO) => {
    try {
      let cid = centroId;
      // Si aún no tenemos centroId, inténtalo resolver on-demand
      if (!cid) {
        const uid = (user as any)?.usuario?.uid as string | undefined;
        if (uid) {
          const centro = await centroService.getByPrestadorUid(uid);
          if (centro) {
            cid = centro.id;
            setCentroId(centro.id);
          }
        }
      }

      if (!cid) throw new Error("No se pudo determinar el centro del prestador");

      // Crear servicio usando el endpoint /api/servicio/save con clave CentroDeEstetica.id
      await servicioService.create(
        {
          tipoDeServicio: nuevo.tipoDeServicio,
          duracion: nuevo.duracion,
          precio: nuevo.precio,
        },
        cid
      );

      const respuestas = await servicioService.getAll();
      const serviciosAdaptados: ServicioDTO[] = (respuestas as ServicioResponseDTO[]).map(
        (servicio) => ({
          id: servicio.id,
          tipoDeServicio: servicio.tipoDeServicio,
          duracion: servicio.duracion,
          precio: servicio.precio,
          centroDeEsteticaDTO: mapCentro(servicio.CentroDeEstetica),
        })
      );
      setServicios(serviciosAdaptados);
    } catch (error) {
      console.error("Error al guardar el servicio:", error);
    }
  };

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
      <NavbarPrestador />
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
        onSave={handleSaveWithCentro}
        profesionales={profesionales}
        tiposDeServicio={tiposDeServicio}
      />
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}
