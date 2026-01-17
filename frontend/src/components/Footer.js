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

          {/* Contact Us */}
          <div>
            <h4 
              className="font-semibold mb-5 text-sm uppercase tracking-wider text-blue-300"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              <li className="text-blue-200 flex items-center gap-2">
                <i className="ri-time-line"></i>
                8 AM - 8 PM (All Days)
              </li>
              <li>
                <a 
                  href="mailto:support@voct.in" 
                  className="text-blue-200 hover:text-white transition-colors flex items-center gap-2"
                  data-testid="footer-email-link"
                >
                  <i className="ri-mail-line"></i>
                  support@voct.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Stay Connected Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span 
                className="text-sm uppercase tracking-wider text-blue-300 font-semibold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Stay Connected
              </span>
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
            <p className="text-sm text-blue-200" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              © 2026 VOCT. Designed for Excellence
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
