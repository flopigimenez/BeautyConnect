import { Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import PendienteAprobacion from "../pages/PendienteAprobacion";
import MiPerfil from "../pages/MiPerfil";
import Calificaciones from "../pages/Calificaciones";
// Componente AppRouter que define las rutas de la aplicación
export const AppRouter = () => {
  return (
    <>
      {/* Barra de navegación */}
     
      {/* Definición de las rutas */}
      <Routes>
        {/* Ruta para la pantalla de personas */}
        <Route path="/" element={<Landing />} />
        <Route path="/pendiente-de-aprobacion" element={<PendienteAprobacion />} />
        <Route path="/miperfil" element={<MiPerfil />} />
        <Route path="/calificaciones" element={<Calificaciones />} />
      </Routes>
    </>
  );
};
