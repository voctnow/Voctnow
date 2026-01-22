import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 100,
        delay: 1.3,
      },
    },
  };

  const letters = ['V', 'O', 'C', 'T'];

  return (
    <section className="relative min-h-screen lg:min-h-[85vh] flex items-center overflow-hidden pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
          {/* Text Content - Always on top for mobile */}
          <div className="text-center lg:text-left lg:flex-1 order-1" style={{ perspective: '1200px' }}>
            {/* VOCT Logo */}
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
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-[10rem] xl:text-[12rem] font-bold text-[#0A1F44] leading-none tracking-tight inline-block"
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

            {/* Subtitle */}
            <motion.div
              variants={subtitleVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-center lg:justify-center lg:max-w-[580px] mt-2"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span 
                className="text-[#0A1F44]/70 font-semibold tracking-[0.08em] sm:tracking-[0.1em] md:tracking-[0.15em] uppercase text-xs sm:text-sm md:text-lg inline-block"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  textShadow: '0 4px 12px rgba(10, 31, 68, 0.1)',
                }}
                data-testid="hero-subtitle"
              >
                Healthcare Comes Home
              </span>
            </motion.div>

            {/* Slogan */}
            <motion.p
              variants={sloganVariants}
              initial="hidden"
              animate="visible"
              className="text-sm sm:text-base md:text-lg lg:text-2xl font-semibold text-gray-900 mt-4 md:mt-6 lg:mt-8 text-center lg:text-center lg:max-w-[580px] px-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
              data-testid="hero-slogan"
            >
              Pain is common, but pain is <span className="font-bold italic text-[#0A1F44]">NOT</span> normal.
            </motion.p>
          </div>

          {/* Image - Below text on mobile, right side on desktop */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center lg:justify-end lg:flex-1 order-2 mt-8 lg:mt-0"
          >
            <img
              src="/hero-physio.png"
              alt="Home physiotherapy"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl"
              data-testid="hero-image"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
