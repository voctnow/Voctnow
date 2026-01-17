import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const Header = () => {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    if (path.includes('#')) {
      const [route, section] = path.split('#');
      navigate(route || '/');
      setTimeout(() => {
        const element = document.getElementById(section);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300`}
        style={{
          background: scrolled 
            ? 'linear-gradient(to bottom, rgba(255,255,255,0.98), rgba(255,255,255,0.95))'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
          boxShadow: '0 4px 20px rgba(10, 31, 68, 0.08), 0 1px 3px rgba(10, 31, 68, 0.06)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(10, 31, 68, 0.05)',
        }}
      >
        {/* 3D Shadow Strip Effect */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(10, 31, 68, 0.1) 20%, rgba(10, 31, 68, 0.15) 50%, rgba(10, 31, 68, 0.1) 80%, transparent 100%)',
            boxShadow: '0 2px 8px rgba(10, 31, 68, 0.1)',
          }}
        />
        
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span 
                className="font-bold text-2xl text-[#0A1F44]"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  textShadow: '0 2px 4px rgba(10, 31, 68, 0.1)',
                }}
                data-testid="logo"
              >
                VOCT
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => handleNavClick('/')}
                className="font-medium text-gray-600 hover:text-[#0A1F44] transition-all duration-200 text-sm relative group"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
                data-testid="nav-home"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0A1F44] transition-all duration-200 group-hover:w-full" />
              </button>
              
              <button
                onClick={() => handleNavClick('/#services')}
                className="font-medium text-gray-600 hover:text-[#0A1F44] transition-all duration-200 text-sm relative group"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
                data-testid="nav-services"
              >
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0A1F44] transition-all duration-200 group-hover:w-full" />
              </button>
              
              <button
                onClick={() => navigate('/join-us')}
                className="font-medium text-gray-600 hover:text-[#0A1F44] transition-all duration-200 text-sm relative group"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
                data-testid="nav-join-us"
              >
                Join Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0A1F44] transition-all duration-200 group-hover:w-full" />
              </button>

              <button
                onClick={() => navigate('/about')}
                className="font-medium text-gray-600 hover:text-[#0A1F44] transition-all duration-200 text-sm relative group"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
                data-testid="nav-about-us"
              >
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0A1F44] transition-all duration-200 group-hover:w-full" />
              </button>
            </nav>

            {/* Auth Button */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full font-medium text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                    data-testid="profile-btn"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#0A1F44] text-white flex items-center justify-center text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    {user.name?.split(' ')[0]}
                    <i className={`ri-arrow-down-s-line transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}></i>
                  </button>
                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl py-2 border border-gray-100"
                        style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                      >
                        <Link
                          to="/profile"
                          className="block px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Account Details
                        </Link>
                        <Link
                          to="/bookings"
                          className="block px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Booking Details
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Address Details
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Help & Support
                        </Link>
                        <hr className="my-1.5 border-gray-100" />
                        <button
                          onClick={() => { logout(); setShowProfileMenu(false); }}
                          className="block w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-500 text-sm"
                        >
                          Log out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-2.5 bg-[#3B82F6] text-white rounded-full font-medium text-sm hover:bg-[#2563EB] transition-all duration-200"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                  }}
                  data-testid="login-btn"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#0A1F44] p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-btn"
            >
              <i className={`text-2xl ${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t border-gray-100"
            >
              <nav className="flex flex-col py-4">
                <button
                  onClick={() => handleNavClick('/')}
                  className="px-6 py-3 font-medium text-gray-600 hover:bg-gray-50 text-left text-sm"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick('/#services')}
                  className="px-6 py-3 font-medium text-gray-600 hover:bg-gray-50 text-left text-sm"
                >
                  Services
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/join-us'); }}
                  className="px-6 py-3 font-medium text-gray-600 hover:bg-gray-50 text-left text-sm"
                >
                  Join Us
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/about'); }}
                  className="px-6 py-3 font-medium text-gray-600 hover:bg-gray-50 text-left text-sm"
                >
                  About Us
                </button>
                {user ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="px-6 py-3 font-medium text-gray-600 hover:bg-gray-50 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="px-6 py-3 font-medium text-red-500 hover:bg-red-50 text-left text-sm"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setMobileMenuOpen(false); setShowAuthModal(true); }}
                    className="mx-6 mt-2 px-5 py-2.5 bg-[#3B82F6] text-white rounded-full font-medium text-sm"
                  >
                    Login
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Header;
