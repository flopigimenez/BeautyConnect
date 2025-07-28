import fondo from '../assets/fondo.png';
import carrousel_1 from '../assets/carrousel_1.png';
import carrousel_2 from '../assets/carrousel_2.png';
import carrousel_3 from '../assets/carrousel_3.png';
import carrousel_4 from '../assets/carrousel_4.png';
import carrousel_5 from '../assets/carrousel_5.png';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import logo from '../assets/logo.png';
const categorias = [
  { nombre: 'Makeup artist', imagen: carrousel_1 },
  { nombre: 'Wellnesscenter', imagen: carrousel_2 },
  { nombre: 'Barbershop', imagen: carrousel_3 },
  { nombre: 'Masajistas', imagen: carrousel_4 },
  { nombre: 'Fotomodel', imagen: carrousel_5 },
];


const Landing = () => {
  return (
    <>
      <Navbar />
      {/* HERO */}
      <div className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        <img
          src={fondo}
          alt="Fondo"
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />
        
        {/* <div className="absolute inset-0 bg-opacity-20 -z-10"></div> */}

        <h1 className="text-white text-4xl sm:text-5xl font-secondary font-bold leading-snug px-4">
          Belleza a tu alcance, <br />
          en tu zona y a tu ritmo.
        </h1>
        <button className="mt-6 px-6 py-3 bg-[#C19BA8] text-white font-bold rounded-full hover:bg-[#a27e8f] transition font-secondary">
          Buscá centros cercanos
        </button>
      </div>
{/* INTRODUCCIÓN */}
<section className="bg-[#FFFBFA] py-40 px-6">
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
    
    {/* Imagen o ícono decorativo */}
    <div className="flex justify-center">
      <div className="bg-[#C19BA8] rounded-full w-48 h-48 flex items-center justify-center shadow-md">
        <img src={logo} alt="Logo" className="w-32 h-32 object-cover" />
      </div>
    </div>

    {/* Texto */}
    <div>
      <h2 className="text-4xl text-[#703F52] font-bold font-secondary mb-4 text-center md:text-left">
        ¿Qué es BeautyConnect?
      </h2>
      <p className="text-[#703F52] text-lg font-secondary leading-relaxed text-center md:text-left">
        <span className="font-bold">BeautyConnect</span> es una plataforma pensada para acercarte a los mejores servicios de estética y bienestar en tu zona. 
        Conectamos profesionales y centros de belleza con personas que buscan agendar turnos de forma rápida, personalizada y sin complicaciones.
        <br /><br />
        Descubrí opciones según tus preferencias, reservá en segundos y viví una experiencia de belleza a tu ritmo.
      </p>
    </div>
  </div>
</section>



      {/* CATEGORÍAS */}
      <section className="bg-[#FFFBFA] py-20">
        <h2 className="text-4xl font-secondary text-[#703F52] font-bold text-center mb-6">
          Categorías
        </h2>
       
        <div className="flex justify-center items-center gap-4 flex-wrap max-w-5xl mx-auto px-4">
  {categorias.map((cat) => (
    <div key={cat.nombre} className="flex flex-col items-center">
      <img
        src={cat.imagen}
        alt={cat.nombre}
        className="w-16 h-16 object-cover rounded-full mb-2"
      />
      <span className="text-sm text-[#703F52] font-semibold text-center">{cat.nombre}</span>
    </div>
  ))}
</div>
    

      {/* CARROUSEL */}
      </section>
            {/* SERVICIOS DESTACADOS */}
      <section className="bg-[#FFFBFA] py-12">
        <h2 className="text-4xl font-secondary text-[#703F52] font-bold text-center mb-8">
          Servicios destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-[#C19BA8] h-32 rounded-xl shadow-md transition hover:scale-105"
            ></div>
          ))}
        </div>
      </section>

{/*como funciona mejorado*/}
<section className="bg-[#FFFBFA] py-16">
  <h2 className="text-4xl font-secondary text-[#703F52] font-bold text-center mb-12">
    ¿Cómo funciona?
  </h2>
  <div className="flex flex-col items-center relative max-w-md mx-auto">
    {/* Línea vertical */}
    <div className="absolute top-0 bottom-0 w-1 bg-[#C19BA8]"></div>
    <div className="relative z-10 flex flex-col items-center mb-16 last:mb-0">
      {/* Punto */}
      <div className="w-4 h-4 bg-[#C19BA8] rounded-full mb-2"></div>

      {/* Contenedor del número y texto alineado */}
      <div className="flex flex-col items-end -ml-20">
        <span className="text-5xl text-[#703F52] font-bold font-secondary">01</span>
        <p className="text-[#703F52] text-sm font-secondary">Registrate</p>
      </div>
            <div className="w-4 h-4 bg-[#C19BA8] rounded-full mb-2"></div>

       <div className="flex flex-col items-start ml-50">
        <span className="text-5xl text-[#703F52] font-bold font-secondary">02</span>
        <p className="text-[#703F52] text-sm font-secondary">Buscá el servicio que querés</p>
      </div>


      <div className="flex flex-col items-end -ml-50">
        <span className="text-5xl text-[#703F52] font-bold font-secondary">03</span>
        <p className="text-[#703F52] text-sm font-secondary">Reservá el turno online</p>
      </div>
            <div className="w-4 h-4 bg-[#C19BA8] rounded-full "></div>

  </div>
  </div>
</section>
   <Footer />
    </>
  );
};
export default Landing;
