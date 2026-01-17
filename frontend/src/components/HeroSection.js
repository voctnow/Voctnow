import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  // Apple-style 3D reveal animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      rotateX: -90,
      y: 80,
      scale: 0.8,
    },
    visible: { 
      opacity: 1, 
      rotateX: 0,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
        duration: 1.2,
      },
    },
  };

  const subtitleVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      rotateX: -45,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 120,
        delay: 0.8,
      },
    },
  };

  const sloganVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 80,
        delay: 1.1,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 100,
        delay: 0.5,
      },
    },
  };

  const letters = ['V', 'O', 'C', 'T'];

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white pt-16">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left" style={{ perspective: '1200px' }}>
            {/* VOCT Logo - Apple-style 3D Reveal */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-center lg:justify-start items-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="text-8xl md:text-[10rem] font-bold text-[#0A1F44] leading-none tracking-tight inline-block"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    transformStyle: 'preserve-3d',
                    textShadow: '0 10px 30px rgba(10, 31, 68, 0.15)',
                  }}
                  data-testid={`hero-letter-${letter}`}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>

            {/* Subtitle - 3D Reveal */}
            <motion.div
              variants={subtitleVariants}
              initial="hidden"
              animate="visible"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span 
                className="text-[#0A1F44]/70 font-semibold tracking-[0.15em] uppercase text-lg inline-block"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  textShadow: '0 4px 12px rgba(10, 31, 68, 0.1)',
                }}
                data-testid="hero-subtitle"
              >
                Healthcare Comes Home
              </span>
            </motion.div>

            {/* Slogan - 3D Reveal */}
            <motion.p
              variants={sloganVariants}
              initial="hidden"
              animate="visible"
              className="text-xl md:text-2xl font-semibold text-gray-900 mt-8"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                transformStyle: 'preserve-3d',
              }}
              data-testid="hero-slogan"
            >
              Pain is common, but pain is{' '}
              <span className="font-bold" style={{ color: 'red' }}>NOT</span>
              {' '}normal.
            </motion.p>
          </div>

          {/* Right Image */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center lg:justify-end"
          >
            <img
              src="https://customer-assets.emergentagent.com/job_github-website-2/artifacts/91zcp83t_IMG_8878%203.PNG"
              alt="Home physiotherapy"
              className="w-full max-w-md lg:max-w-lg"
              data-testid="hero-image"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
