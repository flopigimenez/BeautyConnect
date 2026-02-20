import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { clearUser } from "../redux/store/authSlice";
import { clearCentro } from "../redux/store/miCentroSlice";
import Swal from "sweetalert2";
import { Estado } from "../types/enums/Estado";
import { useState } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { LuPanelsLeftBottom } from "react-icons/lu";
import { PiUsers } from "react-icons/pi";
import { RiScissorsLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import logo from '../assets/logo.png';

const sidebarItems = [
  { to: "/prestador/panel", label: "Panel", icon: LuPanelsLeftBottom },
  { to: "/prestador/calendario", label: "Calendario", icon: CiCalendarDate },
  { to: "/prestador/clientes", label: "Clientes", icon: PiUsers },
  { to: "/prestador/servicio", label: "Servicios", icon: RiScissorsLine },
  { to: "/prestador/profesionales", label: "Profesionales", icon: CiUser },
  { to: "/prestador/configPrestador", label: "Configuración", icon: IoSettingsOutline },
];

const NavbarPrestador = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const centro = useAppSelector((state) => state.miCentro.centro);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    Swal.fire({
      title: '¿Deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#a27e8f',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
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
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900 font-secondary">
              BeautyConnect
            </Link>
          </div>
          {/* Menú móvil */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-tertiary hover:text-white hover:bg-secondary focus:outline-none"
              aria-label="Abrir menú"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {/* Menú desktop */}
          <div className="hidden md:flex items-center gap-10">
            {centro && centro.estado === Estado.ACEPTADO && (
              <Link to="/prestador/panel" className="text-sm text-gray-600 hover:text-gray-900 font-primary">
                Panel
              </Link>
            )}
            {centro && centro.estado === Estado.RECHAZADO && (
              <Link to="/prestador/configPrestador" className="text-sm text-gray-600 hover:text-gray-900 font-primary">
                Configuración
              </Link>
            )}
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
            ) : null}
          </div>
        </div>
      </div>
      {/* Panel lateral */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/25 bg-opacity-40 flex justify-end lg:hidden">
          <div className="w-64 bg-primary h-full shadow-lg p-6 flex flex-col">
            <div className="flex justify-between mb-5">
              <img src={logo} alt="BeautyConnect logo" className="w-10 h-10 object-contain" />
              <button
                className="self-end mb-4 text-tertiary hover:text-secondary"
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="w-full mb-6">
              {sidebarItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 px-3 py-2 rounded-full text-sm text-[#3c2e35] transition-colors mb-2 hover:bg-[#F7EFF1]"
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto">
              {user && (
                <>
                  <span className="block text-sm text-gray-700 font-primary mb-2">Hola, {user.usuario.mail}</span>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="w-full text-sm bg-[#C19BA8] text-white px-3 py-2 rounded hover:bg-[#a27e8f] transition font-primary cursor-pointer"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <hr className="border-secondary border-1 w-full" />
    </nav>
  );
};

export default NavbarPrestador;
