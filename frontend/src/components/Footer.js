import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0A1F44] text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 
              className="font-bold text-2xl mb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              VOCT
            </h3>
            <p 
              className="text-blue-200 text-sm leading-relaxed"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              Healthcare Comes Home
            </p>
          </div>

          {/* About Us */}
          <div>
            <h4 
              className="font-semibold mb-5 text-sm uppercase tracking-wider text-blue-300"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              About Us
            </h4>
            <ul className="space-y-3 text-sm" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              <li>
                <Link to="/about" className="text-blue-200 hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-200 hover:text-white transition-colors">
                  Mission & Vision
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 
              className="font-semibold mb-5 text-sm uppercase tracking-wider text-blue-300"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Legal
            </h4>
            <ul className="space-y-3 text-sm" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              <li>
                <Link to="/privacy-policy" className="text-blue-200 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-blue-200 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
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
            <div className="flex gap-3">
              <a 
                href="https://www.instagram.com/voctnow?igsh=MWRkYWVoZHgzNTk1aQ%3D%3D&utm_source=qr" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="footer-instagram-link"
              >
                <i className="ri-instagram-fill text-lg"></i>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="footer-linkedin-link"
              >
                <i className="ri-linkedin-fill text-lg"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 text-sm" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              <span className="text-blue-200 flex items-center gap-2">
                <i className="ri-time-line"></i>
                8 AM - 8 PM (All Days)
              </span>
              <a 
                href="mailto:support@voct.in" 
                className="text-blue-200 hover:text-white transition-colors flex items-center gap-2"
                data-testid="footer-email-link"
              >
                <i className="ri-mail-line"></i>
                support@voct.in
              </a>
            </div>
            <p className="text-sm text-blue-200" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              © 2026 VOCT. Designed for Recovery
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
