import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase/config";
import { useAppDispatch } from "../redux/store/hooks";
import { clearUser } from "../redux/store/authSlice";
//import { clearCentro } from "../redux/store/miCentroSlice";

const NavbarAdmin = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [seleccionado, setSeleccionado] = useState<string>(localStorage.getItem("navSeleccionado") || "");
    const dispatch = useAppDispatch();


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
        dispatch(clearUser());
        localStorage.removeItem("navSeleccionado");
        window.location.href = "/";
    };

    const handleSelect = (nombre: string) => {
        setSeleccionado(nombre);
        localStorage.setItem("navSeleccionado", nombre);
    };

    const getBtnClass = (nombre: string) =>
        seleccionado === nombre
            ? "bg-secondary rounded-full p-2 text-primary"
            : "p-2";

    return (
        <nav className="bg-primary shadow-md fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-around h-16">
                    <Link to="/admin/centrosAceptados" className="text-lg text-gray-600 hover:text-gray-900 font-primary">
                        <button className={getBtnClass("centroA")} onClick={() => handleSelect("centroA")}>
                            Centros aceptados
                        </button>
                    </Link>
                    <Link to="/admin/solicitudDeSalones" className="text-lg text-gray-600 hover:text-gray-900 font-primary">
                        <button className={getBtnClass("solicitud")} onClick={() => handleSelect("solicitud")}>
                            Solicitudes
                        </button>
                    </Link>
                    <Link to="/admin/centrosRechazados" className="text-lg text-gray-600 hover:text-gray-900 font-primary">
                        <button className={getBtnClass("centroR")} onClick={() => handleSelect("centroR")}>
                            Centros rechazados
                        </button>
                    </Link>
                    <div className="ml-10 flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-sm text-gray-700 font-primary">Hola, {user.email}</span>
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

export default NavbarAdmin;