import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'Why should I choose VOCT?',
    answer: 'VOCT provides qualified physiotherapists, personalized treatment, and reliable home visits—ensuring safe and effective care in the comfort of your home.'
  },
  {
    question: 'What is homecare physiotherapy?',
    answer: 'Homecare physiotherapy is professional treatment provided at your home, ideal for patients with pain, mobility issues, post-surgery recovery, or difficulty traveling.'
  },
  {
    question: 'How much is the session time?',
    answer: 'Each physiotherapy session usually lasts 45–60 minutes, depending on your condition and treatment needs.'
  },
  {
    question: 'How does the payment plan work?',
    answer: 'Payment options include per-session or package plans. Payments are usually taken in advance, with clear communication before starting treatment.'
  },
  {
    question: 'How many sessions will I need?',
    answer: 'The number of sessions depends on your condition and recovery progress. Your physiotherapist will guide you after the first assessment.'
  },
  {
    question: 'Can I change the session timing?',
    answer: 'Yes, session timings can be adjusted with prior notice, subject to therapist availability.'
  },
  {
    question: 'Can VOCT help with long-term conditions?',
    answer: 'Yes, VOCT provides structured physiotherapy programs for long-term and chronic conditions, focusing on pain relief, mobility, and functional independence.'
  }
];

const FAQItem = ({ faq, isOpen, onClick, index }) => {
  return (
    <div className="faq-item">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span 
          className="font-semibold text-[#0A1F44] pr-4 group-hover:text-blue-600 transition-colors"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <i className="ri-arrow-down-s-line text-lg text-gray-500"></i>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p 
              className="pb-5 text-gray-500 leading-relaxed"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 
            className="text-4xl md:text-5xl font-bold text-[#0A1F44] mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
            data-testid="faq-title"
          >
            Common Questions
          </h2>
          <p 
            className="text-lg text-gray-500"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Everything you need to know about VOCT
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 md:p-8"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
