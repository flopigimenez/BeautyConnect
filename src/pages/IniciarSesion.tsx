import { useState } from "react";
import { useAppDispatch } from "../redux/store/hooks";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/config";
import { obtenerAuthUser, setUser } from "../redux/store/authSlice";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Rol } from "../types/enums/Rol";

interface AuthRequest {
    idToken: string;
    mail?: string;
}

type FirebaseAuthError = {
    code?: string;
    message?: string;
};

const isFirebaseAuthError = (value: unknown): value is FirebaseAuthError => {
    if (typeof value !== "object" || value === null) return false;
    const record = value as Record<string, unknown>;
    return (typeof record.code === "string" || typeof record.message === "string");
};

const IniciarSesion = () => {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [googleLoading, setGoogleLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !email ||
            !password
        ) {
            Swal.fire({
                text: 'Por favor, completa todos los campos',
                position: "center",
                icon: "warning",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            const tokenResult = await auth.currentUser?.getIdTokenResult(true);
            const roleClaim = typeof tokenResult?.claims?.role === "string" ? tokenResult.claims.role : null;

            dispatch(obtenerAuthUser());

            const redirectPath = roleClaim === Rol.SUPERADMIN ? "/admin/solicitudDeSalones" : roleClaim === Rol.PRESTADOR_DE_SERVICIO ? "/redirigir" : "/";

            Swal.fire({
                title: 'Inicio de sesion exitoso',
                text: 'Bienvenido de nuevo a BeautyConnect',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
            });

            navigate(redirectPath);

        } catch (error) {
            console.error("Error en login:", error);
            Swal.fire({
                text: 'Error al iniciar sesion',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#a27e8f',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLoginGoogle = async () => {
        setGoogleLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');

            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken(true);

            const authRequest: AuthRequest = {
                idToken: idToken,
                mail: user.email || undefined,
            };

            const resp = await fetch("http://localhost:8080/api/usuario/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(authRequest),
            });

            if (!resp.ok) {
                const errorText = await resp.text();
                throw new Error(errorText || 'Error en la autenticacion con Google');
            }

            const userData = await resp.json();

            dispatch(setUser(userData));

            Swal.fire({
                title: "Inicio de sesion con Google exitoso",
                text: "Bienvenido a BeautyConnect",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
            });

            const googleRole = userData?.usuario?.rol;
            const redirectPath = googleRole === Rol.SUPERADMIN ? "/admin/solicitudDeSalones" : googleRole === Rol.PRESTADOR_DE_SERVICIO ? "/redirigir" : "/";
            navigate(redirectPath);

        } catch (unknownError) {
            console.error("Error en login con Google:", unknownError);

            let errorMessage = "Error al iniciar sesion con Google";

            const error = isFirebaseAuthError(unknownError) ? unknownError : null;
            if (error?.code === 'auth/popup-closed-by-user') {
                errorMessage = "El popup de Google fue cerrado";
            } else if (error?.code === 'auth/popup-blocked') {
                errorMessage = "El popup de Google fue bloqueado. Por favor, permite los popups para este sitio";
            } else if (error?.message) {
                errorMessage = error.message;
            }

            Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#a27e8f",
                width: "350px",
            });
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="bg-primary w-screen flex flex-col items-center justify-center min-h-screen">
                <h1 className="font-secondary text-2xl font-bold mb-3 text-tertiary">Iniciar sesión</h1>
                <form className="mt-5 w-[45rem]" onSubmit={handleLogin}>
                    <div className="mb-5">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading || googleLoading}
                        />
                    </div>
                    <div className="mb-5">
                        <input
                            type="password"
                            placeholder="Contraseña"
                            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading || googleLoading}
                        />
                    </div>
                    <div className="flex flex-col items-center mb-5">
                        <button
                            type="submit"
                            disabled={loading || googleLoading}
                            className="w-[90%] bg-secondary text-white font-bold py-2 rounded-full hover:bg-[#a27e8f] transition font-secondary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                        </button>

                        <div className="w-[90%] flex items-center my-2">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-4 text-gray-500">o</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        <button
                            type="button"
                            disabled={loading || googleLoading}
                            className="w-[90%] bg-white text-gray-800 border rounded-full py-2 flex items-center justify-center font-secondary cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleLoginGoogle}
                        >
                            {googleLoading ? (
                                "Conectando con Google..."
                            ) : (
                                <>
                                    <FcGoogle size={20} />
                                    Iniciar con Google
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <p className="mb-10">¿Aún no estás registrado? <Link to="/registro" className="font-bold">Registrate</Link></p>
            </div>
        </>
    );
};

export default IniciarSesion;
