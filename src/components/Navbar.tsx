import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebase/config";
import LoginModal from "./modals/LoginModal"; 
import { Link } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setIsLoginOpen(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

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
                  <Link to="/Miperfil" className="text-sm text-gray-700 font-primary">
                    Mi perfil
                  </Link>
                  <Link to="/misTurnos" className="text-gray-600 hover:text-gray-900 font-primary">
                    Turnos
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Autenticación */}
          <div className="ml-10 flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700 font-primary">Hola, {user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-[#C19BA8] text-white px-3 py-1 rounded hover:bg-[#a27e8f] transition font-primary"
                >
                  Cerrar sesión
                </button>

              </>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="text-gray-600 hover:text-gray-900 font-primary"
                >
                  Ingresar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <hr className="border-secondary border-1 w-full" />
    </nav>
  );
};

export default Navbar;
