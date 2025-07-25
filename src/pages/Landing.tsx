import fondo from '../assets/fondo.png';

const Landing = () => {
  return (
    <>
      {/* HERO */}
      <div className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        <img
          src={fondo}
          alt="Fondo"
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />
        {/* Capa semitransparente */}
        <div className="absolute inset-0 bg-opacity-20 -z-10"></div>

        <h1 className="text-white text-4xl sm:text-5xl font-quicksand font-bold leading-snug px-4">
          Belleza a tu alcance, <br />
          en tu zona y a tu ritmo.
        </h1>
        <button className="mt-6 px-6 py-3 bg-[#C19BA8] text-white font-bold rounded-full hover:bg-[#a27e8f] transition">
          Buscá centros cercanos
        </button>
      </div>

      {/* CATEGORÍAS */}
      <section className="bg-[#FFFBFA] py-10">
        <h2 className="text-3xl font-quicksand text-[#703F52] font-bold text-center mb-6">
          Categorías
        </h2>
        {/* Acá podés insertar íconos o carrusel */}
        <div className="flex justify-center items-center gap-4 flex-wrap">
          {/* Ejemplo de ítems */}
          {['Makeup artist', 'Wellnesscenter', 'Barbershop', 'Masajistas', 'Fotomodel'].map((cat) => (
            <div key={cat} className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#C19BA8] rounded-full mb-2"></div>
              <span className="text-sm text-[#703F52] font-semibold">{cat}</span>
            </div>
          ))}
        </div>
      </section>
            {/* SERVICIOS DESTACADOS */}
      <section className="bg-[#FFFBFA] py-12">
        <h2 className="text-3xl font-quicksand text-[#703F52] font-bold text-center mb-8">
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

<section className="bg-[#FFFBFA] py-16">
  <h2 className="text-3xl font-quicksand text-[#703F52] font-bold text-center mb-12">
    ¿Cómo funciona?
  </h2>

  <div className="flex flex-col items-center relative max-w-md mx-auto">
    {/* Línea vertical */}
    <div className="absolute top-0 bottom-0 w-1 bg-[#C19BA8]"></div>

    {[{ num: '01', text: 'Registrate' },
      { num: '02', text: 'Buscá el servicio que querés' },
      { num: '03', text: 'Reservá el turno online' }].map((step, index) => (
        <div key={index} className="relative z-10 flex flex-col items-center mb-16 last:mb-0">
          {/* Punto */}
          <div className="w-4 h-4 bg-[#C19BA8] rounded-full mb-2"></div>

          {/* Contenedor del número y texto alineado */}
          <div className="flex flex-col items-end -ml-20">
            <span className="text-5xl text-[#703F52] font-bold font-quicksand">{step.num}</span>
            <p className="text-[#703F52] text-sm font-quicksand">{step.text}</p>
          </div>
        </div>
      ))}
  </div>
</section>

    </>
  );
};

export default Landing;
