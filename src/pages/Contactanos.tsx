import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
const Contactanos = () => {
  return (
    <div>
      <Navbar />
    <main className="bg-primary min-h-screen py-16 text-tertiary">
      <div className="mx-auto max-w-4xl px-6">
        <header className="mb-10 text-center">
          {/* <p className="text-sm uppercase tracking-[0.3em] text-tertiary/70">Estamos para ayudarte</p> */}
          <h1 className="mt-4 text-4xl font-secondary font-semibold">Contactanos</h1>
          <p className="mt-3 text-base text-tertiary">
            Completa el formulario o elegi el canal que prefieras. Nuestro equipo respondra dentro de las 24 horas habiles.
          </p>
        </header>

        <section className="grid gap-12 lg:grid-cols-[1.2fr,1fr]">
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-tertiary">Envianos un mensaje</h2>
            <p className="mt-2 text-sm text-tertiary">
              Compartinos tus dudas, sugerencias o comentarios y te responderemos a la brevedad.
            </p>
            <form className="mt-6 space-y-5">
              <label className="block text-sm font-medium text-tertiary">
                Nombre y apellido
                <input
                  type="text"
                  placeholder="Ej: Ana Perez"
                  className="mt-2 w-full rounded-md border border-secondary/40 bg-transparent px-4 py-2 text-sm focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary"
                />
              </label>
              <label className="block text-sm font-medium text-tertiary">
                Correo electronico
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="mt-2 w-full rounded-md border border-secondary/40 bg-transparent px-4 py-2 text-sm focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary"
                />
              </label>
              <label className="block text-sm font-medium text-tertiary">
                Mensaje
                <textarea
                  rows={4}
                  placeholder="Contanos en que podemos ayudarte"
                  className="mt-2 w-full rounded-md border border-secondary/40 bg-transparent px-4 py-2 text-sm focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-tertiary px-5 py-2 text-sm font-semibold text-white transition hover:bg-tertiary/90 cursor-pointer"
              >
                Enviar mensaje
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="rounded-lg bg-tertiary p-8 text-primary">
              <h2 className="text-lg font-semibold">Datos de contacto</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <span className="block font-medium text-primary/80">Correo</span>
                  <a href="mailto:hola@beautyconnect.com" className="text-primary hover:underline">
                    hola@beautyconnect.com
                  </a>
                </li>
                <li>
                  <span className="block font-medium text-primary/80">Telefono</span>
                  <a href="tel:+5491100000000" className="text-primary hover:underline">
                    +54 9 11 0000-0000
                  </a>
                </li>
                
              </ul>
            </div>

            <div className="rounded-lg border border-secondary/40 bg-white p-8 text-sm text-tertiary/80">
              <h2 className="text-lg font-semibold text-tertiary">Horarios de atencion</h2>
              <p className="mt-2">Lunes a viernes de 9:00 a 18:00 hs (ART)</p>
              <p className="mt-1">Sabados de 10:00 a 14:00 hs (ART)</p>
            </div>
          </div>
        </section>
      </div>
    </main>
    <Footer />
 </div>
  );
};

export default Contactanos;
