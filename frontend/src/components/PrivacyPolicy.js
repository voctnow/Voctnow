import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A1F44] mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            <p className="text-sm text-gray-500 mb-6">Last updated: January 2026</p>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A1F44] mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal information (name, email, phone number)</li>
                <li>Health and medical information for service delivery</li>
                <li>Payment information for transactions</li>
                <li>Communication records with our team</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A1F44] mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and improve our healthcare services</li>
                <li>Match you with appropriate practitioners</li>
                <li>Process payments and send confirmations</li>
                <li>Communicate about appointments and updates</li>
                <li>Ensure quality and safety of services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A1F44] mb-4">3. Information Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information. 
                Your health data is stored securely and accessed only by authorized personnel 
                necessary for providing your care.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A1F44] mb-4">4. Data Sharing</h2>
              <p className="mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Healthcare practitioners assigned to your care</li>
                <li>Payment processors for transactions</li>
                <li>Service providers who assist our operations</li>
                <li>As required by law or legal process</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A1F44] mb-4">5. Your Rights</h2>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A1F44] mb-4">6. Contact Us</h2>
              <p>
                For privacy-related questions, contact us at:{' '}
                <a href="mailto:support@voct.in" className="text-blue-600 hover:underline">
                  support@voct.in
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
