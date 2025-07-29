
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config"

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
      if (!isOpen) return null;

  
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login exitoso");
      } catch (error) {
        alert(
            error instanceof Error ? error.message : String(error),
               
        );
      }
    };
    const handleClose = () => {
  setEmail("");
  setPassword("");
  onClose();
};

  return (
    <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg relative">
        <button className="absolute top-2 right-3 text-gray-500 hover:text-gray-800" onClick={handleClose}>
          ✕
        </button>
        <h2 className="text-xl font-primary mb-4 text-[#703F52]">Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded"
            autoFocus
            value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded"
             value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#C19BA8] w-full text-white py-2 rounded hover:bg-[#a27e8f] transition"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
    
  );
};

export default LoginModal;
