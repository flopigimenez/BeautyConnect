import { useEffect } from "react";
import { CustomTable } from "../components/CustomTable";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { fetchCliente } from "../redux/store/clienteSlice";
import { Switch } from "@mui/material";
import type { ClienteResponseDTO } from "../types/cliente/ClienteResponseDTO";
import { UsuarioService } from "../services/UsuarioService";

export default function Clientes() {
  const clientes = useAppSelector((state) => state.clientes);
  const dispatch = useAppDispatch();
  const usuarioService = new UsuarioService();

  useEffect(() => {
    dispatch(fetchCliente());
  }, [dispatch])


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
              { header: "Telefono", accessor: "telefono" },
              { header: "Mail", accessor: "usuario", render: row => `${row.usuario.mail}` },
              { header: "Rol", accessor: "usuario", render: row => `${row.usuario.rol}` },
              {
                header: "Acciones",
                render: (cliente: ClienteResponseDTO) => (
                  <Switch
                    checked={cliente.usuario.activo}
                    onChange={async () => {
                      cliente
                      try {
                        await usuarioService.patch(cliente.usuario.id, cliente.usuario);
                      } catch (error) {
                        // Swal.fire(
                        //   error instanceof Error ? error.message : String(error),
                        //   "No se pudo actualizar el estado",
                        //   "error"
                        // );
                      }
                    }}
                    color="secondary"
                  />
                ),
              },
            ]}
            data={clientes.clientes}
          />
        </main>
      </div>
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}