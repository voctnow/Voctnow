import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
        duration: 0.8,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 60, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 80,
        delay: 0.3,
        duration: 1,
      },
    },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="text-left"
          >
            {/* VOCT Logo */}
            <motion.h1
              variants={textVariants}
              className="text-6xl md:text-8xl font-bold text-[#0A1F44] leading-none tracking-tight mb-4"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                textShadow: '0 8px 24px rgba(10, 31, 68, 0.12)',
              }}
              data-testid="hero-logo"
            >
              VOCT
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              variants={textVariants}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-semibold text-[#0A1F44] mb-6"
              style={{ fontFamily: 'Poppins, sans-serif' }}
              data-testid="hero-subtitle"
            >
              Healthcare Comes Home
            </motion.h2>

            {/* Slogan */}
            <motion.p
              variants={textVariants}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 mb-8"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
              data-testid="hero-slogan"
            >
              Pain is common, but pain is not normal
            </motion.p>

            {/* CTA Button */}
            <motion.button
              variants={textVariants}
              transition={{ delay: 0.6 }}
              onClick={() => {
                const servicesSection = document.getElementById('services');
                servicesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-3d text-base px-8 py-4"
              data-testid="hero-cta"
            >
              Explore Services
            </motion.button>
          </motion.div>

          {/* Right Image */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <div 
              className="relative z-10"
              style={{
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))',
              }}
            >
              <img
                src="https://customer-assets.emergentagent.com/job_github-website-2/artifacts/91zcp83t_IMG_8878%203.PNG"
                alt="Home physiotherapy illustration - therapist helping patient"
                className="w-full max-w-lg mx-auto lg:max-w-none"
                data-testid="hero-image"
              />
            </div>
            {/* Background blob */}
            <div 
              className="absolute inset-0 -z-10 opacity-30"
              style={{
                background: 'radial-gradient(ellipse at center, #E8F4F8 0%, transparent 70%)',
                transform: 'scale(1.2)',
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
