import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { clearUser } from "../redux/store/authSlice";
import { clearCentro } from "../redux/store/miCentroSlice";
import Swal from "sweetalert2";

const NavbarPrestador = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

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
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900 font-secondary">
              BeautyConnect
            </Link>
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
            ) : null}
          </div>
        </div>
      </div>

      <hr className="border-secondary border-1 w-full" />
    </nav>
  );
};

export default NavbarPrestador;
