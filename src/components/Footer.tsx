import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FaInstagram, FaXTwitter, FaFacebookF } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white py-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6 px-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
            <img src={logo} alt="BeautyConnect logo" className="w-10 h-10 object-contain" />
          </div>
          <div className="text-left text-sm leading-6">
            <Link to="/terminos-y-condiciones" className="block hover:underline font-secondary">
              Terminos y condiciones
            </Link>
            <Link to="/contactanos" className="block hover:underline font-secondary">
              Contactanos
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-2xl font-secondary font-semibold">BeautyConnect</p>
          <p className="text-xs sm:text-sm opacity-80">&copy; {currentYear} Our Store. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded border border-white/30 text-white transition hover:border-white hover:text-white">
            <FaInstagram size={18} />
          </a>
          <a href="#" aria-label="X (Twitter)" className="grid h-9 w-9 place-items-center rounded border border-white/30 text-white transition hover:border-white hover:text-white">
            <FaXTwitter size={18} />
          </a>
          <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded border border-white/30 text-white transition hover:border-white hover:text-white">
            <FaFacebookF size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
