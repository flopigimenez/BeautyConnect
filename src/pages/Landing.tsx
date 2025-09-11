import fondo from '../assets/fondo.png';
// import carrousel_1 from '../assets/carrousel_1.png';
// import carrousel_2 from '../assets/carrousel_2.png';
// import carrousel_3 from '../assets/carrousel_3.png';
// import carrousel_4 from '../assets/carrousel_4.png';
// import carrousel_5 from '../assets/carrousel_5.png';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { CentroDeEsteticaService } from '../services/CentroDeEsteticaService';
import { useEffect, useState } from 'react';
import type { CentroEsteticaResponseDTO } from '../types/centroDeEstetica/CentroDeEsteticaResponseDTO';

// const categorias = [
//   { nombre: 'Makeup artist', imagen: carrousel_1 },
//   { nombre: 'Wellnesscenter', imagen: carrousel_2 },
//   { nombre: 'Barbershop', imagen: carrousel_3 },
//   { nombre: 'Masajistas', imagen: carrousel_4 },
//   { nombre: 'Fotomodel', imagen: carrousel_5 },
// ];


const Landing = () => {

  const [centros, setCentros] = useState<CentroEsteticaResponseDTO[]>([]);
  const centroService = new CentroDeEsteticaService();

  useEffect(() => {
    centroService.getAll().then(setCentros).catch(console.error);
  }, []);

  
  return (
    <>

      <Navbar />
      {/* HERO */}
      <div className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden mt-15">
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
          <Link to="/centros">Buscá centros cercanos</Link>
        </button>
      </div>
{/* INTRODUCCIÓN */}
<section className="bg-[#FFFBFA] py-40 px-6">
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
    
    {/* Imagen */}
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
      {/* <section className="bg-[#FFFBFA] py-20">
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
    

      
      </section> */}
            {/* SERVICIOS DESTACADOS */}
      <section className="bg-[#FFFBFA] py-12">
  <h2 className="text-4xl font-secondary text-[#703F52] font-bold text-center mb-8">
    Centros destacados
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
    {centros.map((centro) => (
      <div
        key={centro.id}
        className="group relative overflow-hidden rounded-xl shadow-md"
      >
        {/* Imagen base */}
        <img
          src={centro.imagen}
          alt={centro.nombre}
          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Card blanca  */}
        <div
          className="
            pointer-events-none
            absolute inset-0
            flex items-end
            p-0
          "
        >
          <div
            className="
              w-full
              bg-white/95 backdrop-blur
              translate-y-4 opacity-0
              transition-all duration-300 ease-out
              group-hover:opacity-100 group-hover:translate-y-0
              group-focus-within:opacity-100 group-focus-within:translate-y-0
              pointer-events-auto
              p-4
            "
          >
            <h3 className="text-lg font-semibold text-[#703F52]">
              {centro.nombre}
            </h3>
            <p className="mt-1 text-sm text-[#703F52]/80 line-clamp-3">
              {centro.descripcion}
            </p>

            <div className="mt-3">
              <Link
                to={`/centros/${centro.id}`}
                className="inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#C19BA8] shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
              >
                Ver más
              </Link>
            </div>
          </div>
        </div>

        {/* Overlay  */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
      </div>
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

