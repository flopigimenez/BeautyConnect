import fondo from '../assets/fondo.png';
import carrousel_1 from '../assets/carrousel_1.png';
import carrousel_2 from '../assets/carrousel_2.png';
import carrousel_3 from '../assets/carrousel_3.png';
import carrousel_4 from '../assets/carrousel_4.png';
import carrousel_5 from '../assets/carrousel_5.png';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
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
        {/* Capa semitransparente */}
        {/* <div className="absolute inset-0 bg-opacity-20 -z-10"></div> */}

        <h1 className="text-white text-4xl sm:text-5xl font-secondary font-bold leading-snug px-4">
          Belleza a tu alcance, <br />
          en tu zona y a tu ritmo.
        </h1>
        <button className="mt-6 px-6 py-3 bg-[#C19BA8] text-white font-bold rounded-full hover:bg-[#a27e8f] transition font-secondary">
          Buscá centros cercanos
        </button>
      </div>

      {/* CATEGORÍAS */}
      <section className="bg-[#FFFBFA] py-10">
        <h2 className="text-3xl font-secondary text-[#703F52] font-bold text-center mb-6">
          Categorías
        </h2>
        {/* Acá podés insertar íconos o carrusel */}
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
        <h2 className="text-3xl font-secondary text-[#703F52] font-bold text-center mb-8">
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
  <h2 className="text-3xl font-secondary text-[#703F52] font-bold text-center mb-12">
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
