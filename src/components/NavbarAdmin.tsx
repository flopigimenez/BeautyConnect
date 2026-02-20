import { signOut } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase/config";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { clearUser } from "../redux/store/authSlice";
import Swal from "sweetalert2";
import { MdOutlineCheckCircle, MdOutlineCancel, MdOutlinePeopleAlt } from "react-icons/md";
import { LuPanelsLeftBottom } from "react-icons/lu";
import { FaRegClipboard } from "react-icons/fa6";
import logo from '../assets/logo.png';

const sidebarItems = [
    { to: "/admin/centrosAceptados", label: "Centros aceptados", icon: MdOutlineCheckCircle },
    { to: "/admin/solicitudDeSalones", label: "Solicitudes", icon: FaRegClipboard },
    { to: "/admin/centrosRechazados", label: "Centros rechazados", icon: MdOutlineCancel },
    { to: "/admin/clientes", label: "Clientes", icon: MdOutlinePeopleAlt },
    { to: "/admin/prestadores", label: "Prestadores", icon: LuPanelsLeftBottom },
];

const NavbarAdmin = () => {
    const user = useAppSelector((state) => state.user.user);
    const [seleccionado, setSeleccionado] = useState<string>(localStorage.getItem("navSeleccionado") || "solicitud");
    const [menuOpen, setMenuOpen] = useState(false);
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
                    localStorage.removeItem("navSeleccionado");
                    window.location.href = "/";
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
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-lg font-primary text-tertiary font-bold">BeautyConnect</span>
                    </div>
                    <div className="flex">
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
                </div>
            </div>
            {/* Panel lateral para todas las pantallas */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 bg-black/25 bg-opacity-40 flex justify-end">
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
                            {sidebarItems.map(({ to, label, icon: Icon }, idx) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className="flex items-center gap-3 px-3 py-2 rounded-full text-sm text-[#3c2e35] transition-colors mb-2 hover:bg-[#F7EFF1]"
                                    onClick={() => {
                                        handleSelect(
                                            idx === 0 ? "centroA" :
                                                idx === 1 ? "solicitud" :
                                                    idx === 2 ? "centroR" :
                                                        idx === 3 ? "clientes" : "prestadores"
                                        ); setMenuOpen(false);
                                    }}
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

export default NavbarAdmin;