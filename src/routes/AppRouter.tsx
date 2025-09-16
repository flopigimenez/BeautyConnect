import { Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import Turnos from "../pages/Turnos";
import Centros from "../pages/Centros";
import PendienteAprobacion from "../pages/PendienteAprobacion";
import MiPerfil from "../pages/MiPerfil";
import Calificaciones from "../pages/Calificaciones";
import Registro from "../pages/Registro";
import RegistroDeSalon from "../pages/RegistroDeSalon";
import RegistroGoogle from "../pages/RegistroGoogle";
import Clientes from "../pages/Clientes";
import  ServiciosPage from "../pages/Servicio";
import Profesionales from "../pages/Profesionales";
import MisTurnos from "../pages/MisTurnos";
import ConfigPrestador from "../pages/ConfigPrestador";
import Calendario from "../pages/Calendario";
// Componente AppRouter que define las rutas de la aplicación
export const AppRouter = () => {
  return (
    <>
      {/* Barra de navegación */}
     
      {/* Definición de las rutas */}
      <Routes>
        {/* Ruta para la pantalla de personas */}
        <Route path="/" element={<Landing />} />
        <Route  path="/turno/:id" element={<Turnos/>}/>
        <Route path="/Centros" element={<Centros/>}/>
        <Route path="/PendienteAprobacion" element={<PendienteAprobacion />} />
        <Route path="/Miperfil" element={<MiPerfil/>} />
        <Route path="/calificaciones" element={<Calificaciones />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/RegistroDeSalon" element={<RegistroDeSalon />} />
        <Route path="/FinalizarRegistroGoogle" element={<RegistroGoogle/>}/>
        <Route path="/clientes" element={<Clientes/>}/>
        <Route path="/servicio" element={<ServiciosPage />} />
        <Route path="/profesionales" element={<Profesionales />} />
        <Route path="/misTurnos" element={<MisTurnos/>}/>
        <Route path="/configPrestador" element={<ConfigPrestador/>}/>
        <Route path="/calendario" element={<Calendario/>}/>
      </Routes>
    </>
  );
};
