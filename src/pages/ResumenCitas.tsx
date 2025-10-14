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
import { normalizarClaveServicio } from "../utils/servicios";

export default function ResumenCitas() {
  const dispatch = useAppDispatch();
  const misTurnos = useAppSelector((state) => state.misTurnos.misTurnos);
  const centro = useAppSelector((state) => state.miCentro.centro);
  const turnoService = new TurnoService();
  const [turnosHoy, setTurnosHoy] = useState<number>();
  const [turnosSemana, setTurnosSemana] = useState<number>();
  const [filtroAplicado, setFiltroAplicado] = useState({ estado: null as EstadoTurno | null });

  let turnosFiltrados: TurnoResponseDTO[] = [...misTurnos];

  const turnosPendientes: TurnoResponseDTO[] = misTurnos.filter(
    turno => turno.estado === EstadoTurno.PENDIENTE
  );

  if (filtroAplicado.estado) {
    turnosFiltrados = misTurnos.filter(
      turno => turno.estado === filtroAplicado.estado
    );
  }

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
      dispatch(fetchTurnosCentro(centro!.id));
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
        <main className="flex-1 overflow-auto pt-20 pb-10">
          <div className="pb-10 px-6">
            <div>
              <h1 className="mb-3 text-2xl md:text-3xl font-bold font-secondary text-[#703F52]">Panel</h1>
              <h3 className="font-secondary mb-5 text-xl">Resumen citas</h3>
            </div>
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
          {turnosPendientes.length > 0 && (
            <CustomTable<TurnoResponseDTO>
              title="Próximas citas"
              columns={[
                { header: "Cliente", accessor: "cliente", render: row => `${row.cliente.nombre} ${row.cliente.apellido}` },
                { header: "Servicio", accessor: "profesionalServicio", render: row => `${normalizarClaveServicio(row.profesionalServicio.servicio.tipoDeServicio)} - ${row.profesionalServicio.servicio.titulo}` },
                { header: "Profesional", accessor: "profesionalServicio", render: row => `${row.profesionalServicio.profesional.nombre} ${row.profesionalServicio.profesional.apellido}` },
                {
                  header: "Fecha", accessor: "fecha",
                  render: row => {
                    const fecha = new Date(row.fecha);
                    return fecha.toLocaleDateString("es-AR", { timeZone: "UTC" });
                  }
                },
                { header: "Hora", accessor: "hora", render: row => `${row.hora.slice(0, 5)}` },
                {
                  header: "Estado", accessor: "estado", render: row => (
                    <span className="bg-secondary/70 text-primary py-1 px-2 rounded-full">
                      {row.estado.toLowerCase()
                        .split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </span>
                  )
                },
                {
                  header: "Acciones",
                  accessor: "estado",
                  render: (row) => {
                    const isPending = row.estado === EstadoTurno.PENDIENTE;

                    return (
                      <div className="flex gap-2">
                        <button
                          disabled={!isPending}
                          className={`py-1 px-2 rounded-full text-primary transition ${isPending
                            ? "bg-green-600/50 hover:bg-green-600/70 hover:scale-102 cursor-pointer"
                            : "bg-gray-300 cursor-not-allowed"
                            }`}
                          onClick={() => isPending && cambiarEstado(row.id, EstadoTurno.FINALIZADO)}
                        >
                          Finalizar
                        </button>
                        <button
                          disabled={!isPending}
                          className={`py-1 px-2 rounded-full text-primary transition ${isPending
                            ? "bg-red-600/50 hover:bg-red-600/70 hover:scale-102 cursor-pointer"
                            : "bg-gray-300 cursor-not-allowed"
                            }`}
                          onClick={() => isPending && cambiarEstado(row.id, EstadoTurno.CANCELADO)}
                        >
                          Cancelar
                        </button>
                      </div>
                    );
                  }
                }
              ]}
              data={turnosPendientes.slice().reverse()}
            />
          )}

         <div className="flex justify-end w-full text-end px-6">
            <label className="block text-md font-primary mb-2 font-bold pr-2">Filtrar por estado</label>
            <select
              value={filtroAplicado.estado ?? ""}
              onChange={(e) => setFiltroAplicado(prev => ({ ...prev, estado: e.target.value as EstadoTurno || null }))}
              className="w-auto min-w-[200px] border border-secondary text-md font-primary px-4 py-1 rounded-full hover:bg-secondary-dark transition"
            >
              <option value="">Todos</option>
              {Object.values(EstadoTurno).map((estado) => (
                <option key={estado} value={estado}>
                  {estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <CustomTable<TurnoResponseDTO>
            title="Todas las citas"
            columns={[
              { header: "Cliente", accessor: "cliente", render: row => `${row.cliente.nombre} ${row.cliente.apellido}` },
              { header: "Servicio", accessor: "profesionalServicio", render: row => `${normalizarClaveServicio(row.profesionalServicio.servicio.tipoDeServicio)} - ${row.profesionalServicio.servicio.titulo}` },
              { header: "Profesional", accessor: "profesionalServicio", render: row => `${row.profesionalServicio.profesional.nombre} ${row.profesionalServicio.profesional.apellido}` },
              {
                header: "Fecha", accessor: "fecha",
                render: row => {
                  const fecha = new Date(row.fecha);
                  return fecha.toLocaleDateString("es-AR", { timeZone: "UTC" });
                }
              },
              { header: "Hora", accessor: "hora", render: row => `${row.hora.slice(0, 5)}` },
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
                header: "Acciones",
                accessor: "estado",
                render: (row) => {
                  const isPending = row.estado === EstadoTurno.PENDIENTE;

                  return (
                    <div className="flex gap-2">
                      <button
                        disabled={!isPending}
                        className={`py-1 px-2 rounded-full text-primary transition ${isPending
                          ? "bg-green-600/50 hover:bg-green-600/70 hover:scale-102 cursor-pointer"
                          : "bg-gray-300 cursor-not-allowed"
                          }`}
                        onClick={() => isPending && cambiarEstado(row.id, EstadoTurno.FINALIZADO)}
                      >
                        Finalizar
                      </button>
                      <button
                        disabled={!isPending}
                        className={`py-1 px-2 rounded-full text-primary transition ${isPending
                          ? "bg-red-600/50 hover:bg-red-600/70 hover:scale-102 cursor-pointer"
                          : "bg-gray-300 cursor-not-allowed"
                          }`}
                        onClick={() => isPending && cambiarEstado(row.id, EstadoTurno.CANCELADO)}
                      >
                        Cancelar
                      </button>
                    </div>
                  );
                }
              }
            ]}
            data={turnosFiltrados.slice().reverse()}
          />
        </main>
      </div>
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}