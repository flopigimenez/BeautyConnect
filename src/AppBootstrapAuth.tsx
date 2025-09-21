import { useEffect } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useAppDispatch } from "./redux/store/hooks";
import { obtenerAuthUser, setFirebaseUser } from "./redux/store/authSlice";
// import { hydrateAuthUserFromApi } from "./redux/store/authSlice";


export default function AppBootstrapAuth() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), async (fb) => {
      if (fb) {
        const token = await fb.getIdTokenResult();
        const roleClaim = typeof token.claims.role === "string" ? token.claims.role : null;

        dispatch(
          setFirebaseUser({
            uid: fb.uid,
            email: fb.email ?? null,
            role: roleClaim,
          })
        );

        dispatch(obtenerAuthUser());
      } else {
        dispatch(setFirebaseUser(null));
        // si querés limpiar completamente:
        // dispatch(clearUser());
      }
    });
    return () => unsub();
  }, [dispatch]);

  return null;
}