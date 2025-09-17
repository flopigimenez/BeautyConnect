import { accordionActionsClasses } from "@mui/material";
import { CustomTable } from "../components/CustomTable";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";
import { useAppSelector } from "../redux/store/hooks";
import type { TurnoResponseDTO } from "../types/turno/TurnoResponseDTO";
import { useState } from "react";

export default function ResumenCitas() {
    return (
        <div className="bg-[#FFFBFA] min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <aside className="hidden md:block w-64 shrink-0 border-r border-[#E9DDE1] bg-[#FFFBFA] h-[calc(100vh-64px)] sticky top-[64px]">
                    <Sidebar />
                </aside>
                <main className="flex-1 overflow-auto px-6 py-20">
                    <div>
                        <h1 className="mb-5 text-2xl md:text-3xl font-bold font-secondary text-[#703F52]">Panel</h1>
                        <h3 className="font-secondary mb-5 text-xl">Resumen citas</h3>
                        <div className="flex justify-around">
                            <div className="border border-tertiary rounded-2xl p-5 w-[25%] h-[100%] text-center">
                                <p className="font-secondary mb-2 text-md">Citas de hoy</p>
                                <p className="font-secondary font-bold text-3xl">2</p>
                            </div>
                            <div className="border border-tertiary rounded-2xl p-5 w-[25%] h-[100%] text-center">
                                <p className="font-secondary mb-2 text-md">Ingresos de hoy</p>
                                <p className="font-secondary font-bold text-3xl">$2</p>
                            </div>
                            <div className="border border-tertiary rounded-2xl p-5 w-[25%] h-[100%] text-center">
                                <p className="font-secondary mb-2 text-md">Citas de esta semana</p>
                                <p className="font-secondary font-bold text-3xl">2</p>
                            </div>
                        </div>
                    </div>
                    {/*<CustomTable<TurnoResponseDTO>
                        title="Próximas citas"
                        columns={[
                            { header: "Nombre y Apellido", accessor: "nombre", render: row => `${row.nombre} ${row.apellido}` },
                            { header: "Telefono", accessor: "telefono" },
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
                        data={turnos}
                    /> */}
                </main>
            </div>
            <footer className="w-full">
                <Footer />
            </footer>
        </div>
    );
}