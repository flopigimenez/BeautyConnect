// src/pages/Servicio.tsx
import Footer from "../components/Footer";
import NavbarPrestador from "../components/NavbarPrestador";
import Sidebar from "../components/SideBar";
import { CustomTable } from "../components/CustomTable";
import type { ServicioResponseDTO } from "../types/servicio/ServicioResponseDTO";
import { useEffect, useMemo, useState } from "react";
import { ServicioService } from "../services/ServicioService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AgregarServicio from "../components/modals/AgregarServicio";
import Swal from "sweetalert2";

const servicioService = new ServicioService();

const Servicio = () => {
  const [data, setData] = useState<ServicioResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<ServicioResponseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        setError("No hay usuario autenticado.");
        return;
      }
      await fetchServicios(user.uid);
    });
    return () => unsub();
  }, []);

  const fetchServicios = async (uid: string) => {
    try {
      setLoading(true);
      const servicios = await servicioService.findByUid(uid);
      const normalizados = servicios.map((servicio) => ({
        ...servicio,
        active: servicio.active ?? true,
      }));
      setData(normalizados);
      setError(null);
    } catch (e: unknown) {
      setError((e as Error).message ?? "Error al cargar servicios.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (row: ServicioResponseDTO) => {
    setSelected(row);
    setOpenEdit(true);
  };

  const handleToggle = async (row: ServicioResponseDTO) => {
    const isInactive = row.active === false;
    const action = isInactive ? "Reactivar" : "Inactivar";
    const actionLower = action.toLowerCase();
    const confirmation = await Swal.fire({
      icon: "warning",
      title: `${action} servicio`,
      text: `\u00bfQuer\u00e9s ${actionLower} este servicio?`,
      showCancelButton: true,
      confirmButtonText: `S\u00ed, ${actionLower}`,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#703F52",
      cancelButtonColor: "#C19BA8",
    });
    if (!confirmation.isConfirmed) {
      return;
    }
    try {
      setBusyId(row.id);
      setError(null);
      await servicioService.deleteServicio(row.id);
      setData((prev) =>
        prev.map((servicio) =>
          servicio.id === row.id
            ? { ...servicio, active: servicio.active === false ? true : false }
            : servicio
        )
      );
    } catch (e: unknown) {
      const message = (e as Error).message || `Error al ${actionLower} el servicio.`;
      setError(message);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonColor: "#703F52",
      });
    } finally {
      setBusyId(null);
    }
  };

  const displayedData = useMemo(() => {
    const isInactive = (servicio: ServicioResponseDTO) => servicio.active === false;
    return showInactive
      ? data.filter(isInactive)
      : data.filter((servicio) => !isInactive(servicio));
  }, [data, showInactive]);

  return (
    <>
      <NavbarPrestador />
      <div className="bg-[#FFFBFA] min-h-screen flex py-16">
        <aside className="hidden md:block w-64 shrink-0 border-r border-[#E9DDE1] bg-[#FFFBFA] h-[calc(100vh-64px)] sticky top-[64px]">
          <Sidebar />
        </aside>

        <main className="container mx-auto px-4 py-8 min-h-screen">
          {loading && <p>Cargando servicios...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <>
              <div className="flex justify-end mb-4">
                <button
                  className="rounded-full border border-[#C19BA8] px-5 py-2 text-[#703F52] hover:bg-[#f4e6eb] cursor-pointer"
                  onClick={() => setShowInactive((prev) => !prev)}
                >
                  {showInactive ? "Ver activos" : "Ver inactivos"}
                </button>
              </div>
              <CustomTable<ServicioResponseDTO>
                title="Servicios"
                columns={[
                  { header: "Titulo", accessor: "titulo" },
                  {
                    header: "Tipo", accessor: "tipoDeServicio", render: (row) => (
                      <div>
                        {row.tipoDeServicio.toLowerCase()
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </div>
                    ),
                  },
                  {
                    header: "Precio",
                    accessor: "precio",
                    render: (row) => (
                      <span>
                        $
                        {typeof row.precio === "number"
                          ? row.precio.toFixed(2)
                          : row.precio}
                      </span>
                    ),
                  },
                  {
                    header: "Descripción",
                    accessor: "descripcion",
                    render: (row) => {
                      if (!row.descripcion) return "Sin descripción";

                      const texto = row.descripcion;
                      const isExpanded = expandedRow === row.id;
                      const corto = texto.length > 45 ? texto.slice(0, 45) + "..." : texto;

                      return (
                        <div>
                          <span>{isExpanded ? texto : corto}</span>
                          {texto.length > 45 && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedRow(isExpanded ? null : row.id)
                              }
                              className="ml-2 text-[#C19BA8] font-semibold hover:underline"
                            >
                              {isExpanded ? "Ocultar" : "Ver más"}
                            </button>
                          )}
                        </div>
                      );
                    },
                  },
                  {
                    header: "Estado",
                    render: (row) => (row.active === false ? "Inactivo" : "Activo"),
                  },
                  {
                    header: "Acciones",
                    // accessor: "acciones" as any, // si tu tabla exige accessor
                    render: (row) => (
                      <div className="flex space-x-3">
                        <button
                          className="text-blue-600 hover:underline disabled:opacity-50 cursor-pointer"
                          onClick={() => handleOpenEdit(row)}
                          disabled={busyId === row.id}
                        >
                          Editar
                        </button>
                        <button
                          className="text-red-600 hover:underline disabled:opacity-50 cursor-pointer"
                          onClick={() => handleToggle(row)}
                          disabled={busyId === row.id}
                        >
                          {busyId === row.id ? "Procesando..." : row.active === false ? "Reactivar" : "Inactivar"}
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={displayedData}
                actionButton={{
                  label: "Agregar Servicio",
                  onClick: () => {
                    setSelected(null);
                    setOpenEdit(true);
                  },
                }}
              />
            </>
          )}

          {/* Modal fuera del CustomTable */}
          {openEdit && (
            <AgregarServicio
              servicio={selected}
              onCreated={(nuevo) => {
                const normalizado = { ...nuevo, active: nuevo.active ?? true };
                setData((prev) => [normalizado, ...prev]);
              }}
              onUpdated={async (actualizado) => {
                const normalizado = { ...actualizado, active: actualizado.active ?? true };
                setData((prev) => prev.map((s) => (s.id === normalizado.id ? normalizado : s)));
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) await fetchServicios(user.uid);
              }}
              onClose={() => setOpenEdit(false)}
            />
          )}
        </main>
      </div>

      <Footer />
    </>
  );
};

export default Servicio;
