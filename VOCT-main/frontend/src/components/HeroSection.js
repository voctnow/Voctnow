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

  const letters = ['V', 'O', 'C', 'T'];

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-white">
      <div className="container mx-auto px-6 text-center relative" style={{ perspective: '1200px' }}>
        {/* VOCT Logo - Apple-style 3D Reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center items-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="text-8xl md:text-[12rem] font-bold text-[#0A1F44] leading-none tracking-tight inline-block"
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
          className="text-2xl md:text-3xl font-semibold text-gray-900 mt-8"
          style={{ 
            fontFamily: 'Poppins, sans-serif',
            transformStyle: 'preserve-3d',
          }}
          data-testid="hero-slogan"
        >
          Pain is common, but pain is{' '}
          <span className="text-[#0A1F44] italic font-bold">NOT</span> normal.
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
