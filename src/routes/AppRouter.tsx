import { Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import Turnos from "../pages/Turnos";
import Centros from "../pages/Centros";
import MapaCentros from "../pages/MapaCentros";
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
import Contactanos from "../pages/Contactanos";
import TerminosYCondiciones from "../pages/TerminosYCondiciones";
import SolicitudDeSalones from "../pages/SolicitudDeSalones";
import ConfigPrestador from "../pages/ConfigPrestador";
import Calendario from "../pages/Calendario";
import ResumenCitas from "../pages/ResumenCitas";
// Componente AppRouter que define las rutas de la aplicación
import { ProtectedRoute } from "./ProtectedRoute";
import { Rol } from "../types/enums/Rol";
import CentrosRechazados from "../pages/CentrosRechazados";
import CentrosAceptados from "../pages/CentrosAceptados";
import IniciarSesion from "../pages/IniciarSesion";
import Redirigir from "../pages/Redirigir";
import AdminClientes from "../pages/AdminClientes";
import AdminPrestadores from "../pages/AdminPrestadores";
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
        <Route path="/mapa-centros" element={<MapaCentros />} />
        {/* <Route path="/calificaciones" element={<Calificaciones />} /> */}
        <Route path="/centros/:id/resenias" element={<ReseniasCentro />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/RegistroDeSalon" element={<RegistroDeSalon />} />
        <Route path="/FinalizarRegistroGoogle" element={<RegistroGoogle />} />
        <Route path="/iniciarSesion" element={<IniciarSesion />} />
        <Route path="/contactanos" element={<Contactanos />} />
        <Route path="/terminos-y-condiciones" element={<TerminosYCondiciones />} />

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

         <Route path="/redirigir"
          element={
            <ProtectedRoute allowedRoles={[Rol.PRESTADOR_DE_SERVICIO]}>
              <Redirigir />
            </ProtectedRoute>
          }
        /> 

        <Route path="/PendienteAprobacion"
          element={
            <ProtectedRoute allowedRoles={[Rol.PRESTADOR_DE_SERVICIO]} allowedCentroEstados={["PENDIENTE"]}>
              <PendienteAprobacion />
            </ProtectedRoute>
          }
        />

        <Route path="/prestador/panel"
          element={
            <ProtectedRoute allowedRoles={[Rol.PRESTADOR_DE_SERVICIO]} allowedCentroEstados={["ACEPTADO"]}>
              <ResumenCitas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prestador/clientes"
          element={
            <ProtectedRoute allowedRoles={[Rol.PRESTADOR_DE_SERVICIO]} allowedCentroEstados={["ACEPTADO"]}>
              <Clientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prestador/servicio"
          element={
            <ProtectedRoute allowedRoles={[Rol.PRESTADOR_DE_SERVICIO]} allowedCentroEstados={["ACEPTADO"]}>
              <ServiciosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prestador/profesionales"
          element={
            <ProtectedRoute allowedRoles={[Rol.PRESTADOR_DE_SERVICIO]} allowedCentroEstados={["ACEPTADO"]}>
              <Profesionales />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prestador/configPrestador"
          element={
            <ProtectedRoute allowedRoles={[Rol.PRESTADOR_DE_SERVICIO]} allowedCentroEstados={["RECHAZADO", "ACEPTADO"]}>
              <ConfigPrestador />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prestador/calendario"
          element={
            <ProtectedRoute allowedRoles={[Rol.PRESTADOR_DE_SERVICIO]} allowedCentroEstados={["ACEPTADO"]}>
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
        <Route
          path="/admin/centrosAceptados"
          element={
            <ProtectedRoute allowedRoles={[Rol.SUPERADMIN]}>
              <CentrosAceptados />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/centrosRechazados"
          element={
            <ProtectedRoute allowedRoles={[Rol.SUPERADMIN]}>
              <CentrosRechazados />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clientes"
          element={
            <ProtectedRoute allowedRoles={[Rol.SUPERADMIN]}>
              <AdminClientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/prestadores"
          element={
            <ProtectedRoute allowedRoles={[Rol.SUPERADMIN]}>
              <AdminPrestadores />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};





