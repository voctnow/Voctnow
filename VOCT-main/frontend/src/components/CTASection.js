import React from 'react';
import { motion } from 'framer-motion';

const CTASection = ({ onOpenAssessment }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="text-3xl md:text-4xl font-bold text-[#0A1F44] mb-8"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Not sure which service to choose?
          </h2>
          
          <button
            onClick={onOpenAssessment}
            className="btn-3d text-lg px-12 py-5"
            data-testid="cta-assessment-btn"
          >
            Take Assessment
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
