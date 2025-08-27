import { useState } from "react";
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import swal from "sweetalert2";
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CambiarPasswordModal({ isOpen, onClose }: Props) {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error("No hay sesión activa.");

      // Reautenticación
      const credential = EmailAuthProvider.credential(user.email, actual);
      await reauthenticateWithCredential(user, credential);

      // Update
      await updatePassword(user, nueva);

      swal.fire({
        title: "Éxito",
        text: "Contraseña actualizada correctamente.",
        icon: "success",
      });

      onClose();
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        typeof (err as { code: string }).code === "string"
      ) {
        const code = (err as { code: string }).code;
        if (code === "auth/wrong-password") setError("La contraseña actual es incorrecta.");
        else if (code === "auth/weak-password") setError("La nueva contraseña es muy débil.");
        else setError((err as { message?: string }).message || "Error al cambiar la contraseña.");
      } else {
        setError("Error al cambiar la contraseña.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#703F52]">Cambiar contraseña</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña actual</label>
            <input
              type="password"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#C19BA8]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
            <input
              type="password"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#C19BA8]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-full bg-[#C19BA8] text-white text-sm hover:bg-[#a27e8f] disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Cambiar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
