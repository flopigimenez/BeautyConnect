import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/store/hooks";
import type { Rol } from "../types/enums/Rol";

interface ProtectedRouteProps {
  children: ReactElement;
  allowedRoles?: Rol[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { user, firebaseUser, loading } = useAppSelector((state) => state.user);

  const role: Rol | null = user?.usuario?.rol ?? (firebaseUser?.role as Rol | null ?? null);
  const isLoggedIn = Boolean(user ?? firebaseUser?.uid);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFBFA] text-[#703F52] font-secondary">
        Cargando...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles?.length && (!role || !allowedRoles.includes(role))) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
