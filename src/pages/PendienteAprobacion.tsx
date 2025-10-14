import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Logo from "../assets/logo.png";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchCentro } from "../redux/store/miCentroSlice";

const PendienteAprobacion = () => {
  const user = useAppSelector((state) => state.user.user);
  const centro = useAppSelector((state) => state.miCentro.centro);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user && centro) {
      dispatch(fetchCentro(centro.id));
        setTimeout(() => {
          if (centro?.estado !== "PENDIENTE"){
            navigate("/redirigir");
          }
        }, 2000);
    }
  }, [user, centro?.estado, navigate, dispatch]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#FFFBFA] text-gray-900 font-secondary">
        <img src={Logo} alt="Logo" />
        <h1 className="text-3xl font-bold text-[#703F52]">Pendiente de Aprobación</h1>
        <p className="text-lg">En breve recibirás un mail con la respuesta a tu solicitud.</p>
      </div>
      <Footer />
    </>
  );
};

export default PendienteAprobacion;
