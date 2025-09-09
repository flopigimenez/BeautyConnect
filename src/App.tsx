import { useEffect } from "react";
import { useAppDispatch } from "./redux/store/hooks";
import { AppRouter } from "./routes/AppRouter";
import { UsuarioService } from "./services/UsuarioService";
import { clearUser, setUser } from "./redux/store/authSlice";

function App() {
      const dispatch = useAppDispatch();

    useEffect(() => {
        const checkAuthStatus = async () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    // Opcional: Verificar con el backend que el token aún es válido
                    const usuarioService = new UsuarioService();
                    const isValid = await usuarioService.verificarPorUid(user.usuario.uid);
                    
                    if (isValid) {
                        dispatch(setUser(user));
                    } else {
                        // Token expirado, limpiar
                        dispatch(clearUser());
                    }
                } catch (error) {
                    console.error("Error verifying auth status:", error);
                    dispatch(clearUser());
                }
            }
        };

        checkAuthStatus();
    }, [dispatch]);
  return <AppRouter />;
}

export default App;
