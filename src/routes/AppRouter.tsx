import { Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
// Componente AppRouter que define las rutas de la aplicación
export const AppRouter = () => {
  return (
    <>
      {/* Barra de navegación */}
     
      {/* Definición de las rutas */}
      <Routes>
        {/* Ruta para la pantalla de personas */}
        <Route path="/" element={<Landing />} />
      </Routes>
    </>
  );
};
