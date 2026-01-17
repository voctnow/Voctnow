import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0A1F44] text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 
              className="font-bold text-2xl mb-4"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              VOCT
            </h3>
            <p 
              className="text-blue-200 text-sm leading-relaxed"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              Pioneering the future of home healthcare with clinical excellence and seamless digital integration.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 
              className="font-semibold mb-5 text-sm uppercase tracking-wider text-blue-300"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Company
            </h4>
            <ul className="space-y-3 text-sm" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              <li>
                <Link to="/about" className="text-blue-200 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Clinical Team
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 
              className="font-semibold mb-5 text-sm uppercase tracking-wider text-blue-300"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Services
            </h4>
            <ul className="space-y-3 text-sm" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              <li className="text-blue-200">Physiotherapy</li>
              <li className="text-blue-200">Neuro Rehab</li>
              <li className="text-blue-200">Elderly Care</li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h4 
              className="font-semibold mb-5 text-sm uppercase tracking-wider text-blue-300"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Stay Connected
            </h4>
            <div className="flex gap-3 mb-4">
              <a 
                href="https://www.instagram.com/voctnow?igsh=MWRkYWVoZHgzNTk1aQ%3D%3D&utm_source=qr" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="footer-instagram-link"
              >
                <i className="ri-instagram-fill text-lg"></i>
              </a>
            </div>
            <div className="mt-4">
              <a 
                href="mailto:support@voct.in" 
                className="text-blue-200 hover:text-white transition-colors text-sm flex items-center gap-2"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
                data-testid="footer-email-link"
              >
                <i className="ri-mail-line"></i>
                support@voct.in
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-blue-200" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            © 2026 VOCT. Designed for Excellence
          </p>
          <div className="flex gap-6 text-sm" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">
              Privacy Architecture
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">
              Clinical Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
