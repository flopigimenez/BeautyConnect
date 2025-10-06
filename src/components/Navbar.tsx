import { Link } from "react-router-dom";
import NavbarPrestador from "./NavbarPrestador";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { Rol } from "../types/enums/Rol";
import { clearCentro } from "../redux/store/miCentroSlice";
import { clearUser } from "../redux/store/authSlice";
import NavbarAdmin from "./NavbarAdmin";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { fetchTurnosCliente } from "../redux/store/misTurnosSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

const isRolValue = (value: string | null | undefined): value is Rol => {
  return value === Rol.CLIENTE || value === Rol.PRESTADOR_DE_SERVICIO || value === Rol.SUPERADMIN;
};

const NavbarCliente = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const turnos = useAppSelector((state) => state.misTurnos.misTurnos);

  const turnoCount = turnos.filter((t) => t.estado === "PENDIENTE").length;

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTurnosCliente(user.id));
    }
  }, [user, dispatch]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    Swal.fire({
      title: '¿Deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#a27e8f',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await signOut(auth);
          dispatch(clearUser());
          dispatch(clearCentro());
          Swal.fire({
            title: 'Sesión cerrada',
            text: 'Has cerrado sesión exitosamente.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al cerrar sesión.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      }
    });
  };

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    void handleLogout();
  };

  return (
    <nav className="bg-primary shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center flex-1">
            <Link to="/" className="text-xl font-bold text-gray-900 font-secondary" onClick={handleLinkClick}>
              BeautyConnect
            </Link>

            <div className="hidden md:flex md:items-center md:ml-10 md:space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900 font-primary">
                Inicio
              </Link>
              <Link to="/mapa-centros" className="text-gray-600 hover:text-gray-900 font-primary">
                Centros
              </Link>
              {user && (
                <>
                  <Link to="/Miperfil" className="text-gray-600 hover:text-gray-900 font-primary">
                    Mi perfil
                  </Link>
                  <Link
                    to="/misTurnos"
                    className="text-gray-600 hover:text-gray-900 font-primary relative inline-block"
                  >
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

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700 font-primary">Hola, {user.usuario.mail}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-[#C19BA8] text-white px-3 py-1 rounded hover:bg-[#a27e8f] transition font-primary cursor-pointer"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/iniciarSesion" className="text-gray-600 hover:text-gray-900 font-primary">
                Ingresar
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={handleToggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary cursor-pointer"
              aria-controls="primary-navigation"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Abrir menú principal</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        id="primary-navigation"
        className={`md:hidden ${isMenuOpen ? "block" : "hidden"} border-t border-secondary bg-primary`}
      >
        <div className="px-4 pt-4 pb-2 space-y-2">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="block px-3 py-2 rounded text-gray-600 hover:text-gray-900 font-primary hover:bg-secondary"
          >
            Inicio
          </Link>
          <Link
            to="/mapa-centros"
            onClick={handleLinkClick}
            className="block px-3 py-2 rounded text-gray-600 hover:text-gray-900 font-primary hover:bg-secondary"
          >
            Centros
          </Link>
          {user && (
            <>
              <Link
                to="/Miperfil"
                onClick={handleLinkClick}
                className="block px-3 py-2 rounded text-gray-600 hover:text-gray-900 font-primary hover:bg-secondary"
              >
                Mi perfil
              </Link>
              <Link
                to="/misTurnos"
                onClick={handleLinkClick}
                className="flex items-center justify-between px-3 py-2 rounded text-gray-600 hover:text-gray-900 font-primary hover:bg-secondary"
              >
                <span>Turnos</span>
                {turnos && turnoCount > 0 && (
                  <span className="ml-3 bg-secondary text-primary text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {turnoCount}
                  </span>
                )}
              </Link>
            </>
          )}
        </div>
        <div className="border-t border-secondary px-4 py-4 space-y-3">
          {user ? (
            <>
              <span className="block text-sm text-gray-700 font-primary">Hola, {user.usuario.mail}</span>
              <button
                onClick={handleLogoutClick}
                className="w-full text-sm bg-[#C19BA8] text-white px-3 py-2 rounded hover:bg-[#a27e8f] transition font-primary cursor-pointer"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              to="/iniciarSesion"
              onClick={handleLinkClick}
              className="block text-gray-600 hover:text-gray-900 font-primary px-3 py-2 rounded hover:bg-secondary"
            >
              Ingresar
            </Link>
          )}
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
    return <NavbarPrestador />;
  }

  return <NavbarCliente />;
};

export default Navbar;
export { NavbarCliente };
