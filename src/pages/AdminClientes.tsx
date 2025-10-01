import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import Footer from "../components/Footer";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { Switch } from "@mui/material";
import { ClienteService } from "../services/ClienteService";
import Swal from "sweetalert2";
import type { ClienteResponseDTO } from "../types/cliente/ClienteResponseDTO";
import { fetchCliente } from "../redux/store/clienteSlice";
import NavbarAdmin from "../components/NavbarAdmin";

export default function AdminClientes() {
const clientes = useAppSelector((state) => state.clientes.clientes);
  const dispatch = useAppDispatch();
  const clienteService = new ClienteService();
  const [busqueda, setBusqueda] = useState("");

  const clientesFiltrados = clientes
    .filter(cliente =>
      cliente.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.usuario.mail?.toLowerCase().includes(busqueda.toLowerCase())
    );

  useEffect(() => {
      dispatch(fetchCliente());
  }, [dispatch]);

  return (
    <div className="bg-[#FFFBFA] min-h-screen flex flex-col">
      <NavbarAdmin />
      <div className="flex flex-1 overflow-hidden">
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
            data={clientesFiltrados}
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