import { Link } from "react-router-dom";
import NavbarPrestador from "./NavbarPrestador";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { Rol } from "../types/enums/Rol";
import { clearCentro } from "../redux/store/miCentroSlice";
import { clearUser } from "../redux/store/authSlice";
import NavbarAdmin from "./NavbarAdmin";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { fetchTurnosCliente } from "../redux/store/misTurnosSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { Estado } from "../types/enums/Estado";

const isRolValue = (value: string | null | undefined): value is Rol => {
  return value === Rol.CLIENTE || value === Rol.PRESTADOR_DE_SERVICIO || value === Rol.SUPERADMIN;
};

const NavbarCliente = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const turnos = useAppSelector((state) => state.misTurnos.misTurnos);

  const turnoCount = turnos.filter(
    (t) => t.estado === "PENDIENTE"
  ).length;

  useEffect(() => {
    if (user?.id && turnos.length > 0) {
      dispatch(fetchTurnosCliente(user.id));
    }
  }, [user, dispatch]);

  const handleLogout = async () => {
    Swal.fire({
      title: '¿Deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#a27e8f',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then( async (result) => {
      if (result.isConfirmed) {
        try {
          // Cerrar sesión
          await signOut(auth);
          dispatch(clearUser());
          dispatch(clearCentro());
          Swal.fire({
            title: 'Sesión cerrada',
            text: 'Has cerrado sesión exitosamente.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al cerrar sesión.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      }
    });
  }

  return (
    <nav className="bg-primary shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900 font-secondary">
              BeautyConnect
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900 font-primary">
                Inicio
              </Link>
              <Link to="/centros" className="text-gray-600 hover:text-gray-900 font-primary">
                Centros
              </Link>
              {user && (
                <>
                  <Link to="/Miperfil" className="text-gray-600 hover:text-gray-900 font-primary">
                    Mi perfil
                  </Link>
                  <Link to="/misTurnos" className="text-gray-600 hover:text-gray-900 font-primary relative inline-block">
                    Turnos
                    {turnos && turnoCount > 0 && (
                      <span className="absolute top-0 right-0 -mt-1 -mr-3 bg-secondary text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {turnoCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="ml-10 flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700 font-primary">Hola, {user.usuario.mail}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-[#C19BA8] text-white px-3 py-1 rounded hover:bg-[#a27e8f] transition font-primary"
                >
                  Cerrar sesion
                </button>
              </>
            ) : (
              <Link to="/iniciarSesion" className="text-gray-600 hover:text-gray-900 font-primary">
                Ingresar
              </Link>
            )}
          </div>
        </div>
      </div>
      <hr className="border-secondary border-1 w-full" />
    </nav>
  );
};

const Navbar = () => {
  const { user, firebaseUser } = useAppSelector((state) => state.user);

  const roleFromUser = user?.usuario?.rol ?? null;
  const firebaseRole = firebaseUser?.role ?? null;
  const role: Rol | null = roleFromUser ?? (isRolValue(firebaseRole) ? firebaseRole : null);

  if (role === Rol.SUPERADMIN) {
    return <NavbarAdmin />;
  }
  
  if (role === Rol.PRESTADOR_DE_SERVICIO) {
    return <NavbarPrestador />
  }

  return <NavbarCliente />;
};

export default Navbar;
export { NavbarCliente };
