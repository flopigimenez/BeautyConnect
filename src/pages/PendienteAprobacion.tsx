import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Logo from "../assets/logo.png";

const PendienteAprobacion = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFBFA] text-gray-900 font-secondary">
        <img src={Logo} alt="Logo" />
        <h1 className="text-3xl font-bold text-[#703F52]">Pendiente de Aprobación</h1>
        <p className="text-lg">En breve recibirás un mail con la respuesta a tu solicitud.</p>
      </div>
      <Footer />
    </>
  );
};

export default PendienteAprobacion;
