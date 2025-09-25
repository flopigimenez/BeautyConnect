import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { Switch } from "@mui/material";
import { ClienteService } from "../services/ClienteService";
import Swal from "sweetalert2";
import { fetchTurnosCentro } from "../redux/store/misTurnosSlice";
import type { ClienteResponseDTO } from "../types/cliente/ClienteResponseDTO";
import { fetchCliente } from "../redux/store/clienteSlice";

export default function Clientes() {
  const misturnos = useAppSelector((state) => state.misTurnos.misTurnos);
  const centro = useAppSelector((state) => state.miCentro.centro);
  const dispatch = useAppDispatch();
  const clienteService = new ClienteService();
  const [busqueda, setBusqueda] = useState("");

  const clientesFiltrados = misturnos
    .filter(turno =>
      turno.cliente.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      turno.cliente.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
      turno.cliente.usuario.mail?.toLowerCase().includes(busqueda.toLowerCase())
    );

  const clientesUnicos = Array.from(
    new Map(
      clientesFiltrados.map(turno => [turno.cliente.id, turno.cliente])
    ).values()
  );

  useEffect(() => {
    if (centro) {
      dispatch(fetchTurnosCentro(centro.id));
    }
  }, [dispatch, centro]);

  return (
    <div className="bg-[#FFFBFA] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block w-64 shrink-0 border-r border-[#E9DDE1] bg-[#FFFBFA] h-[calc(100vh-64px)] sticky top-[64px]">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-auto px-6 py-16">
          <CustomTable<ClienteResponseDTO>
            title="Clientes"
            columns={[
              { header: "Nombre y Apellido", accessor: "nombre", render: row => `${row.nombre} ${row.apellido}` },
              { header: "Telefono", accessor: "telefono", render: row => row.telefono || "-" },
              { header: "Mail", accessor: "usuario", render: row => `${row.usuario.mail}` },
              { header: "Rol", accessor: "usuario", render: row => `${row.usuario.rol.charAt(0) + row.usuario.rol.slice(1).toLocaleLowerCase()}` },
              {
                header: "Acciones",
                accessor: "active",
                render: (cliente: ClienteResponseDTO) => (
                  <Switch
                    checked={cliente.active}
                    onChange={async () => {
                      try {
                        await clienteService.cambiarEstadoActivo(cliente.id);
                        dispatch(fetchCliente());
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
            data={clientesUnicos}
            busqueda={{
              onChange: setBusqueda,
              placeholder: "Buscar cliente...",
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