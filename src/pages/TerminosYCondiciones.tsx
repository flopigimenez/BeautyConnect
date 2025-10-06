import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
const TerminosYCondiciones = () => {
  return (
    <div>
      <Navbar />
    <main className="bg-primary min-h-screen py-16 text-tertiary">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-tertiary/70">Lee con atencion</p>
          <h1 className="mt-4 text-4xl font-secondary font-semibold">Terminos y Condiciones</h1>
          <p className="mt-3 text-base text-tertiary/80">
            Estos terminos establecen las reglas que aplican al uso de BeautyConnect. Al utilizar nuestra plataforma aceptas cada uno de los puntos detallados a continuacion.
          </p>
        </header>

        <section className="space-y-10 text-sm leading-7 text-tertiary/90">
          <article>
            <h2 className="text-xl font-semibold text-tertiary">1. Definiciones</h2>
            <p className="mt-3">
              BeautyConnect es una plataforma digital que conecta usuarios con salones y profesionales de la belleza. "Usuarios" incluye a clientes, prestadores de servicios y administradores.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-tertiary">2. Uso de la plataforma</h2>
            <p className="mt-3">
              Te comprometes a utilizar BeautyConnect de manera licita y respetuosa, evitando cualquier conducta que pueda perjudicar a otros usuarios o comprometer la seguridad del servicio.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>No utilizar la plataforma con fines fraudulentos o enganosos.</li>
              <li>Mantener actualizada tu informacion de contacto.</li>
              <li>Respetar los turnos reservados y las politicas de cancelacion de cada centro.</li>
            </ul>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-tertiary">3. Responsabilidades</h2>
            <p className="mt-3">
              BeautyConnect actua como intermediario entre usuarios y prestadores. Cada prestador es responsable de los servicios que ofrece, y los usuarios son responsables de cumplir con las reservas agendadas.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-tertiary">4. Privacidad y datos personales</h2>
            <p className="mt-3">
              Tratamos tus datos personales de acuerdo con nuestra Politica de Privacidad. Al registrarte en la plataforma, consentis la recoleccion y el uso de tus datos para brindarte una experiencia personalizada.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-tertiary">5. Modificaciones</h2>
            <p className="mt-3">
              Podemos actualizar estos terminos en cualquier momento. Publicaremos la version vigente con fecha de actualizacion y, si los cambios son significativos, te lo notificaremos por correo electronico o dentro de la plataforma.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-tertiary">6. Contacto</h2>
            <p className="mt-3">
              Si tenes consultas sobre estos terminos, escribinos a <a href="mailto:legal@beautyconnect.com" className="font-medium text-tertiary underline">legal@beautyconnect.com</a>.
            </p>
          </article>
        </section>
      </div>
    </main>
    <Footer />
    </div>
  );
};

export default TerminosYCondiciones;
