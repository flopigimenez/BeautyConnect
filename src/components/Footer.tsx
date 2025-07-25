import logo from '../assets/logo.png';
import { FaInstagram, FaXTwitter, FaFacebookF } from 'react-icons/fa6'; // Instalá react-icons si no lo tenés

const Footer = () => {
  return (
    <footer className="bg-[#C19BA8] text-white py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between px-6">
        {/* Logo */}
        <div className="mb-4 sm:mb-0">
          <img src={logo} alt="Logo" className="w-12 h-12 object-cover" />
        </div>

        {/* Nombre y derechos */}
        <div className="text-center">
          <p className="text-lg font-bold font-secondary">BeautyConnect</p>
          <p className="text-xs">
            © {new Date().getFullYear()} Our Store. All rights reserved.
          </p>
        </div>

        {/* Redes sociales */}
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <a href="#" aria-label="Instagram" className="text-white hover:opacity-80">
            <FaInstagram size={18} />
          </a>
          <a href="#" aria-label="X (Twitter)" className="text-white hover:opacity-80">
            <FaXTwitter size={18} />
          </a>
          <a href="#" aria-label="Facebook" className="text-white hover:opacity-80">
            <FaFacebookF size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
