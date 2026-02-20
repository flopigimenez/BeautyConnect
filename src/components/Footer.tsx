import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FaInstagram, FaXTwitter, FaFacebookF } from 'react-icons/fa6';


const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#e9d9de] text-[#3c2e35] pt-5 border-t border-[#e9dde1] shadow-inner">  {/*gradient-to-t from-secondary to-*/}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:justify-between md:items-start gap-10">
        {/* Logo y nombre */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center mb-2">
            <img src={logo} alt="BeautyConnect logo" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-2xl font-secondary font-bold tracking-wide">BeautyConnect</span>
          <span className="text-xs text-[#7F3C56] font-secondary">Conectando belleza y bienestar</span>
        </div>

        {/* Enlaces útiles */}
        <div className="flex flex-col items-center gap-2 md:items-start md:mt-5">
          <span className="font-semibold text-base mb-1">Enlaces útiles</span>
          <Link to="/terminos-y-condiciones" className="hover:underline font-secondary transition text-sm text-[#7F3C56] hover:text-tertiary">Términos y condiciones</Link>
          <Link to="/contactanos" className="hover:underline font-secondary transition text-sm text-[#7F3C56] hover:text-tertiary">Contáctanos</Link>
        </div>

        {/* Redes sociales */}
        <div className="flex flex-col items-center gap-2 md:items-end md:mt-5">
          <span className="font-semibold text-base mb-1">Seguinos</span>
          <div className="flex gap-3 mt-1">
            <a href="https://www.instagram.com/" target="_blank" aria-label="Instagram" className="group">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-[#C4A1B5] bg-white text-tertiary shadow transition-all group-hover:bg-tertiary group-hover:text-white group-hover:scale-110">
                <FaInstagram size={20} />
              </span>
            </a>
            <a href="https://x.com/?lang=es" target="_blank" aria-label="X (Twitter)" className="group">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-[#C4A1B5] bg-white text-tertiary shadow transition-all group-hover:bg-tertiary group-hover:text-white group-hover:scale-110">
                <FaXTwitter size={20} />
              </span>
            </a>
            <a href="https://www.facebook.com/?locale=es_LA" target="_blank" aria-label="Facebook" className="group">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-[#C4A1B5] bg-white text-tertiary shadow transition-all group-hover:bg-tertiary group-hover:text-white group-hover:scale-110">
                <FaFacebookF size={20} />
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="mt-5 border-t border-secondary p-2 text-center text-xs text-[#7F3C56] font-secondary"> {/*[#e9dde1] */}
        &copy; {currentYear} BeautyConnect. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
