import { Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import Turnos from "../pages/Turnos";
import Centros from "../pages/Centros";
// Componente AppRouter que define las rutas de la aplicación
export const AppRouter = () => {
  return (
    <>
      {/* Barra de navegación */}
     
      {/* Definición de las rutas */}
      <Routes>
        {/* Ruta para la pantalla de personas */}
        <Route path="/" element={<Landing />} />
        <Route path="/Turnos" element={<Turnos/>}/>
        <Route path="/Centros" element={<Centros/>}/>
      </Routes>
    </>
  );
};
