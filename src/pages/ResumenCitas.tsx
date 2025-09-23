import { CustomTable } from "../components/CustomTable";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import type { TurnoResponseDTO } from "../types/turno/TurnoResponseDTO";
import { useEffect, useState } from "react";
import { fetchTurnosCentro } from "../redux/store/misTurnosSlice";
import { EstadoTurno } from "../types/enums/EstadoTurno";
import { TurnoService } from "../services/TurnoService";

export default function ResumenCitas() {
  const dispatch = useAppDispatch();
  const misTurnos = useAppSelector((state) => state.misTurnos.misTurnos);
  const centro = useAppSelector((state) => state.miCentro.centro);
  const turnoService = new TurnoService();
  const [turnosHoy, setTurnosHoy] = useState<number>();
  const [turnosSemana, setTurnosSemana] = useState<number>();


  useEffect(() => {
    if (centro) {
      dispatch(fetchTurnosCentro(centro.id));
    }
  }, [dispatch, centro]);

  useEffect(() => {
    const cargarResumen = async () => {
      if (centro) {
        try {
          const hoy = new Date();
          const cantidadHoy = await turnoService.contarPorFecha(hoy, centro.id);
          const cantidadSemana = await turnoService.contarPorSemana(hoy, centro.id);

          setTurnosHoy(cantidadHoy);
          setTurnosSemana(cantidadSemana);
        } catch (error) {
          console.error("Error cargando resumen:", error);
        }
      }
    };

    cargarResumen();
  }, [centro]);

  const cambiarEstado = async (id: number, estado: EstadoTurno) => {
    try {
      await turnoService.cambiarEstado(id, estado);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-[#FFFBFA] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block w-64 shrink-0 border-r border-[#E9DDE1] bg-[#FFFBFA] h-[calc(100vh-64px)] sticky top-[64px]">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-auto px-6 py-20">
          <div>
            <h1 className="mb-3 text-2xl md:text-3xl font-bold font-secondary text-[#703F52]">Panel</h1>
            <h3 className="font-secondary mb-5 text-xl">Resumen citas</h3>
            <div className="flex justify-around pb-3">
              <div className="border border-tertiary rounded-2xl p-1 w-[30%] h-[70%] text-center">
                <p className="font-secondary text-lg">Citas de hoy</p>
                <p className="font-secondary font-bold text-3xl">{turnosHoy}</p>
              </div>
              <div className="border border-tertiary rounded-2xl p-1 w-[30%] h-[70%] text-center">
                <p className="font-secondary text-lg">Citas de esta semana</p>
                <p className="font-secondary font-bold text-3xl">{turnosSemana}</p>
              </div>
            </div>
          </div>
          <CustomTable<TurnoResponseDTO>
            title="Próximas citas"
            columns={[
              { header: "Cliente", accessor: "cliente", render: row => `${row.cliente.nombre} ${row.cliente.apellido}` },
              {
                header: "Servicio", accessor: "profesionalServicio", render: row =>
                  row.profesionalServicio.servicio.tipoDeServicio.toLowerCase()
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
              },
              {
                header: "Fecha", accessor: "fecha",
                render: row => {
                  const fecha = new Date(row.fecha);
                  return fecha.toLocaleDateString("es-AR", { timeZone: "UTC" });
                }
              },
              { header: "Hora", accessor: "hora", render: row => `${row.hora}` },
              {
                header: "Estado", accessor: "estado", render: row => (
                  <span className={row.estado === EstadoTurno.PENDIENTE ? "bg-secondary/70 text-primary py-1 px-2 rounded-full" : row.estado === EstadoTurno.CANCELADO ? "bg-red-600/45  text-primary py-1 px-2 rounded-full" : "bg-green-600/45 text-primary py-1 px-2 rounded-full"}>
                    {row.estado.toLowerCase()
                      .split('_')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </span>
                )
              },
              {
                header: "Acciones", accessor: "estado", render: (row) => (
                  <div className="flex gap-2">
                    <button className="bg-green-600/50 text-primary py-1 px-2 rounded-full hover:bg-green-600/70 hover:scale-102"
                      onClick={() => cambiarEstado(row.id, EstadoTurno.FINALIZADO)}
                    >
                      Finalizar
                    </button>
                    <button className="bg-red-600/50  text-primary py-1 px-2 rounded-full hover:bg-red-600/70 hover:scale-102"
                      onClick={() => cambiarEstado(row.id, EstadoTurno.CANCELADO)}
                    >
                      Cancelar
                    </button>
                  </div>
                )
              },
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