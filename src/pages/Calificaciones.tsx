import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import logo from '../assets/logo.png';
const reseñas = [
  {
    id: 1,
    nombre: "Sofía Ramírez",
    comentario:
      "Mi experiencia en BeautyConnect fue excepcional. El personal fue amable y profesional, y el servicio superó mis expectativas. Definitivamente volveré.",
    calificacion: 5,
    fecha: "1 semana atrás",

  },
  {
    id: 2,
    nombre: "Lucía Fernandez",
    comentario:
      "El servicio fue bueno, pero hubo una pequeña demora en mi cita. A pesar de eso, el resultado final fue satisfactorio.",
    calificacion: 4,
    fecha: "2 semanas atrás",

  },
  {
    id: 3,
    nombre: "Martina Gomez",
    comentario:
      "BeautyConnect ofrece un ambiente relajante y servicios de alta calidad. Estoy muy contenta con mi visita y lo recomendaría a cualquiera.",
    calificacion: 5,
    fecha: "3 semanas atrás",

  },
];

const Calificaciones = () => {
  return (
    <>
      <Navbar />
      <div className=" px-4 py-18 h-screen bg-[#FAFAFA]">
        <h1 className="text-3xl font-secondary font-bold text-[#1f1f1f] mb-10">
          Calificaciones y Comentarios
        </h1>

        <div className="space-y-10">
          {reseñas.map((res) => (
            <div key={res.id} className="border-b border-[#C19BA8] pb-6">
              {/* Header */}
              <div className="flex items-center gap-4 mb-2">
                <img
                  src={logo}
                  alt="foto"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-[#1f1f1f]">{res.nombre}</p>
                  <p className="text-xs text-gray-500">{res.fecha}</p>
                </div>
              </div>

              {/* Estrellas */}
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

              {/* Comentario */}
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
