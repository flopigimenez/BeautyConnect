import { accordionActionsClasses } from "@mui/material";
import { CustomTable } from "../components/CustomTable";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import type { TurnoResponseDTO } from "../types/turno/TurnoResponseDTO";
import { useEffect, useState } from "react";
import { fetchTurnosCentro } from "../redux/store/misTurnosSlice";

export default function ResumenCitas() {
  const dispatch = useAppDispatch();
  const misTurnos = useAppSelector((state) => state.misTurnos.misTurnos);
  const centro = useAppSelector((state) => state.miCentro.centro)

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
                <p className="font-secondary mb-2 text-md">Citas de esta semana</p>
                <p className="font-secondary font-bold text-3xl">2</p>
              </div>
            </div>
          </div>
          <CustomTable<TurnoResponseDTO>
            title="Próximas citas"
            columns={[
              { header: "Cliente", accessor: "cliente", render: row => `${row.cliente.nombre} ${row.cliente.apellido}` },
              { header: "Servicio", accessor: "profesionalServicio", render: row => `${row.profesionalServicio.servicio.tipoDeServicio}`  },
              /*{
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
              },*/
            ]}
            data={misTurnos}
          />
        </main> 
      </div>
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}