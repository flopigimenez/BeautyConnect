import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks"
import { fetchReseñas } from "../redux/store/reseñaSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";

const Calificaciones = () => {
  const dispatch = useAppDispatch();
  const { reseñas, loading, error } = useAppSelector((state) => state.reseñas);

  useEffect(() => {
    dispatch(fetchReseñas());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <div className="px-4 py-18 bg-[#FAFAFA] min-h-screen">
        <h1 className="text-3xl font-secondary font-bold text-[#1f1f1f] mb-10">
          Calificaciones y Comentarios
        </h1>

        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-10">
          {reseñas.map((res) => (
            <div key={res.id} className="border-b border-[#C19BA8] pb-6">
              <div className="flex items-center gap-4 mb-2">
                <img
                  src={logo}
                  alt="foto"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-[#1f1f1f]">
                    {res.cliente.nombre}
                  </p>
                  <p className="text-xs text-gray-500">{res.fechaCreacion}</p>
                </div>
              </div>

              <div className="flex mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${
                      i < res.calificacion ? "text-[#C19BA8]" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="text-sm text-[#333]">{res.comentario}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Calificaciones;
