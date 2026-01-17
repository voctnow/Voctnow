import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-poppins font-bold text-4xl md:text-5xl text-navy mb-4" data-testid="about-title">
            About VOCT
          </h1>
          <p className="font-opensans text-lg text-gray-600 max-w-2xl mx-auto">
            Bringing quality healthcare to your doorstep
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-card p-8"
          >
            <h2 className="font-poppins font-bold text-2xl text-navy mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              At VOCT, we believe that <strong>pain is common, but pain is NOT normal</strong>. Our mission is to revolutionize healthcare delivery by bringing professional physiotherapy services directly to your home. We understand that mobility issues and health conditions can make it difficult to travel to clinics, which is why we've made healthcare accessible, convenient, and personal.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-card p-8"
          >
            <h2 className="font-poppins font-bold text-2xl text-navy mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              We envision a world where quality healthcare is not limited by location or mobility. VOCT aims to be the leading home healthcare provider, making professional physiotherapy accessible to every household in India. By leveraging technology and a network of skilled practitioners, we're building a future where healthcare truly comes home.
            </p>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-card p-8"
          >
            <h2 className="font-poppins font-bold text-2xl text-navy mb-6">Why Choose VOCT?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">Home-Based Care</h3>
                  <p className="text-sm text-gray-600">Treatment in the comfort of your home, saving time and effort</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">Verified Practitioners</h3>
                  <p className="text-sm text-gray-600">All our physiotherapists are certified and background verified</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">Flexible Scheduling</h3>
                  <p className="text-sm text-gray-600">Book sessions at your convenience, from 8 AM to 8 PM</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">Affordable Pricing</h3>
                  <p className="text-sm text-gray-600">Transparent pricing with no hidden charges</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-navy rounded-3xl shadow-card p-8 text-white"
          >
            <h2 className="font-poppins font-bold text-2xl mb-4">Get in Touch</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-blue-200">support@voct.in</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-blue-200">+91 98765 43210</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Hours</h3>
                <p className="text-blue-200">Mon-Sat, 9 AM - 6 PM</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
