import { Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import Turnos from "../pages/Turnos";
import Centros from "../pages/Centros";
import PendienteAprobacion from "../pages/PendienteAprobacion";
import MiPerfil from "../pages/MiPerfil";
// import Calificaciones from "../pages/Calificaciones";
import ReseniasCentro from "../pages/ReseniasCentro";
import Registro from "../pages/Registro";
import RegistroDeSalon from "../pages/RegistroDeSalon";
import RegistroGoogle from "../pages/RegistroGoogle";
import Clientes from "../pages/Clientes";
import ServiciosPage from "../pages/Servicio";
import Profesionales from "../pages/Profesionales";
import MisTurnos from "../pages/MisTurnos";
import SolicitudDeSalones from "../pages/SolicitudDeSalones";
import ConfigPrestador from "../pages/ConfigPrestador";
import Calendario from "../pages/Calendario";
import { ProtectedRoute } from "./ProtectedRoute";
import { Rol } from "../types/enums/Rol";
// Componente AppRouter que define las rutas de la aplicacion

export const AppRouter = () => {
  return (
    <>
      {/* Barra de navegacion */}

      {/* Definicion de las rutas */}
      <Routes>
        {/* Rutas publicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/turno/:id" element={<Turnos />} />
        <Route path="/Centros" element={<Centros />} />
        <Route path="/PendienteAprobacion" element={<PendienteAprobacion />} />
        {/* <Route path="/calificaciones" element={<Calificaciones />} /> */}
        <Route path="/centros/:id/resenias" element={<ReseniasCentro />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/RegistroDeSalon" element={<RegistroDeSalon />} />
        <Route path="/FinalizarRegistroGoogle" element={<RegistroGoogle />} />

        {/* Rutas protegidas para clientes */}
        <Route
          path="/Miperfil"
          element={
            <ProtectedRoute allowedRoles={[Rol.CLIENTE]}>
              <MiPerfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/misTurnos"
          element={
            <ProtectedRoute allowedRoles={[Rol.CLIENTE]}>
              <MisTurnos />
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas para prestadores */}
        <Route
          path="/prestador/clientes"
          element={
            <ProtectedRoute allowedRoles={[Rol.PRESTADOR_DE_SERVICIO]}>
              <Clientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prestador/servicio"
          element={
            <ProtectedRoute allowedRoles={[Rol.PRESTADOR_DE_SERVICIO]}>
              <ServiciosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prestador/profesionales"
          element={
            <ProtectedRoute allowedRoles={[Rol.PRESTADOR_DE_SERVICIO]}>
              <Profesionales />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prestador/configPrestador"
          element={
            <ProtectedRoute allowedRoles={[Rol.PRESTADOR_DE_SERVICIO]}>
              <ConfigPrestador />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prestador/calendario"
          element={
            <ProtectedRoute allowedRoles={[Rol.PRESTADOR_DE_SERVICIO]}>
              <Calendario />
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para administradores */}
        <Route
          path="/admin/solicitudDeSalones"
          element={
            <ProtectedRoute allowedRoles={[Rol.SUPERADMIN]}>
              <SolicitudDeSalones />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};
