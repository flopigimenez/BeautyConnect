import { useEffect } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useAppDispatch } from "./redux/store/hooks";
import { setUser } from "./redux/store/authSlice";
import { hydrateAuthUserFromApi } from "./redux/store/authSlice";

export default function AppBootstrapAuth() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), async (fb) => {
      if (fb) {
        // bootstrap mínimo para no quedar en null
        // @ts-expect-error objeto mínimo con uid/email
        dispatch(setUser({ uid: fb.uid, email: fb.email ?? undefined }));
        // hidratar desde tu API → trae DTO con id
        dispatch(hydrateAuthUserFromApi());
      } else {
        // si querés limpiar completamente:
        // dispatch(clearUser());
      }
    });
    return () => unsub();
  }, [dispatch]);

  return null;
}