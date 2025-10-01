import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import Footer from "../components/Footer";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { Switch } from "@mui/material";
import Swal from "sweetalert2";
import NavbarAdmin from "../components/NavbarAdmin";
import { PrestadorServicioService } from "../services/PrestadorServicioService";
import { fetchPrestadores } from "../redux/store/prestadores";
import type { PrestadorServicioResponseDTO } from "../types/prestadorDeServicio/PrestadorServicioResponseDTO";

export default function AdminPrestadores() {
const prestadores = useAppSelector((state) => state.prestadores.prestadores);
  const dispatch = useAppDispatch();
  const prestadorService = new PrestadorServicioService();
  const [busqueda, setBusqueda] = useState("");

  const prestadoresFiltrados = prestadores
    .filter(prestador =>
      prestador.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      prestador.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
      prestador.usuario.mail?.toLowerCase().includes(busqueda.toLowerCase())
    );

  useEffect(() => {
      dispatch(fetchPrestadores());
  }, [dispatch]);
  
  return (
    <div className="bg-[#FFFBFA] min-h-screen flex flex-col">
      <NavbarAdmin />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto px-6 py-16">
          <CustomTable<PrestadorServicioResponseDTO>
            title="Prestadores de Servicio"
            columns={[
              { header: "Nombre y Apellido", accessor: "nombre", render: row => `${row.nombre} ${row.apellido}` },
              { header: "Telefono", accessor: "telefono", render: row => row.telefono || "-" },
            { header: "Mail", accessor: "usuario", render: row => `${row.usuario.mail}` },
              { header: "Rol", accessor: "usuario", render: row => `${row.usuario.rol.charAt(0) + row.usuario.rol.slice(1).toLocaleLowerCase()}` },
              {
                header: "Acciones",
                accessor: "active",
                render: (prestador: PrestadorServicioResponseDTO) => (
                  <Switch
                    checked={prestador.active}
                    onChange={async () => {
                      try {
                        await prestadorService.cambiarEstadoActivo(prestador.id);
                        dispatch(fetchPrestadores());
                      } catch (error) {
                        Swal.fire(
                          error instanceof Error ? error.message : String(error),
                          "No se pudo actualizar el estado",
                          "error"
                        );
                      }
                    }}
                    color="secondary"
                  />
                ),
              },
            ]}
            data={prestadoresFiltrados}
            busqueda={{
              onChange: setBusqueda,
              placeholder: "Buscar prestador...",
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