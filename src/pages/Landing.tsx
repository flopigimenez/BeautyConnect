import fondo from '../assets/fondo.png';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Estado } from '../types/enums/Estado';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { fetchCentrosPorEstadoyActive } from '../redux/store/centroSlice';


const Landing = () => {
  //const [centros, setCentros] = useState<CentroDeEsteticaResponseDTO[]>([]);
  //const centroService = new CentroDeEsteticaService();
  const cliente = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const centros = useAppSelector((state) => state.centros.centros);
  const [activeCentroId, setActiveCentroId] = useState<number | null>(null);

  const isMobileViewport = () =>
    typeof window !== 'undefined' && !window.matchMedia('(min-width: 768px)').matches;

  const handleCardToggle = (centroId: number) => {
    if (!isMobileViewport()) {
      return;
    }
    setActiveCentroId((prev) => (prev === centroId ? null : centroId));
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>, centroId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardToggle(centroId);
    }
  };


  useEffect(() => {
    dispatch(fetchCentrosPorEstadoyActive({ estado: Estado.ACEPTADO, active: true }));
    /*centroService
      .getAll()
      .then((data) => {
        const aceptados = Array.isArray(data)
          ? data.filter((centro) => centro.estado === Estado.ACEPTADO)
          : [];
        setCentros(aceptados);
      })
      .catch(console.error);*/
  }, [cliente?.id]);

  const centrosConPromedio = centros
    .map(c => {
      const resenias = c.resenias ?? [];
      const promedio =
        resenias.length > 0
          ? resenias.reduce((acc, r) => acc + r.puntuacion, 0) / resenias.length
          : 0;
      return { ...c, promedio };
    });

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
          {centrosConPromedio.slice(0, 3).map((centro) => {
            const isActive = activeCentroId === centro.id;
            return (
              <div
                key={centro.id}
                className="group relative overflow-hidden rounded-xl shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C19BA8]/60"
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                onClick={() => handleCardToggle(centro.id)}
                onKeyDown={(event) => handleCardKeyDown(event, centro.id)}
              >
                {/* Imagen base */}
                <img
                  src={centro.imagen}
                  alt={centro.nombre}
                  className={`h-56 w-full object-cover transition-transform duration-500 md:group-hover:scale-105 ${
                    isActive ? 'scale-105' : ''
                  }`}
                />

                {/* Card blanca */}
                <div
                  className={`absolute bottom-0 w-full bg-white/95 backdrop-blur transform transition-all duration-300 ease-out p-4 pointer-events-none md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-hover:pointer-events-auto ${
                    isActive ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-4 opacity-0'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-[#703F52]">{centro.nombre}</h3>
                  <p className="mt-1 text-sm text-[#703F52]/80 line-clamp-3">{centro.descripcion}</p>

                  <Link
                    to={`/centros`}
                    className="mt-3 inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#C19BA8] cursor-pointer shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#C19BA8]/40"
                  >
                    Ver mas
                  </Link>
                </div>

                {/* Overlay */}
                <div
                  className={`bg-black/0 transition-colors duration-300 md:group-hover:bg-black/10 ${
                    isActive ? 'bg-black/10' : ''
                  }`}
                />
              </div>
            );
          })}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Landing;

