import React from 'react';
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-800 relative">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Biddora
              </span>
            </div>
            <p className="text-gray-600 max-w-md text-base leading-relaxed">
              Your premier destination for exclusive auctions and unique finds. 
              Discover, bid, and win with confidence.
            </p>
            <div className="flex space-x-3 mt-6">
              <SocialIcon href="#" icon={<FaTwitter className="w-4 h-4" />} label="Twitter" />
              <SocialIcon href="#" icon={<FaFacebookF className="w-4 h-4" />} label="Facebook" />
              <SocialIcon href="#" icon={<FaInstagram className="w-4 h-4" />} label="Instagram" />
              <SocialIcon href="#" icon={<FaLinkedinIn className="w-4 h-4" />} label="LinkedIn" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="#" text="About Biddora" />
              <FooterLink href="#" text="How It Works" />
              <FooterLink href="#" text="Auction Guide" />
              <FooterLink href="#" text="Success Stories" />
              <FooterLink href="#" text="Blog" />
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Support</h3>
            <ul className="space-y-2">
              <FooterLink href="#" text="Help Center" />
              <FooterLink href="#" text="Contact Us" />
              <FooterLink href="#" text="Privacy Policy" />
              <FooterLink href="#" text="Terms of Service" />
              <FooterLink href="#" text="FAQ" />
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <span className="text-gray-600 text-sm mb-4 md:mb-0">
              © {currentYear} <span className="font-semibold text-gray-900">Biddora</span>. All rights reserved.
            </span>
            
            {/* Additional Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-purple-600 transition-colors duration-200">
                Cookie Policy
              </a>
              <a href="#" className="hover:text-purple-600 transition-colors duration-200">
                Security
              </a>
              <a href="#" className="hover:text-purple-600 transition-colors duration-200">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute right-8 -top-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Scroll to top"
      >
        <FaArrowUp className="w-4 h-4" />
      </button>
    </footer>
  );
};

// Reusable Social Icon Component with React Icons
const SocialIcon = ({ href, icon, label }) => (
  <a
    href={href}
    className="w-10 h-10 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 transition-all duration-300 group shadow-sm"
    aria-label={label}
  >
    <span className="text-gray-500 group-hover:text-white transition-colors duration-300">
      {icon}
    </span>
  </a>
);

// Reusable Footer Link Component
const FooterLink = ({ href, text }) => (
  <li>
    <a
      href={href}
      className="text-gray-600 hover:text-purple-600 transition-colors duration-200 text-sm"
    >
      {text}
    </a>
  </li>
);

export default Footer;