import React from 'react';
import { motion } from 'framer-motion';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A1F44] mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Terms & Conditions
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            <p className="text-sm text-gray-500 mb-6">Last updated: January 2026</p>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A1F44] mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using VOCT's services, you agree to be bound by these Terms and Conditions. 
                If you do not agree with any part of these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A1F44] mb-4">2. Services Description</h2>
              <p className="mb-4">
                VOCT provides home-based healthcare services including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Physiotherapy and rehabilitation services</li>
                <li>Neurological rehabilitation</li>
                <li>Geriatric care services</li>
                <li>Sports injury rehabilitation</li>
                <li>Women's health services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A1F44] mb-4">3. Booking and Cancellation</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Bookings must be made through our platform</li>
                <li>Cancellations must be made at least 24 hours before the scheduled appointment</li>
                <li>Late cancellations may be subject to a cancellation fee</li>
                <li>We reserve the right to reschedule appointments if necessary</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A1F44] mb-4">4. Payment Terms</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment is required at the time of booking</li>
                <li>We accept various payment methods as displayed on our platform</li>
                <li>Refunds are processed according to our refund policy</li>
                <li>Prices are subject to change without prior notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A1F44] mb-4">5. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate health information</li>
                <li>Follow practitioner recommendations</li>
                <li>Ensure a safe environment for home visits</li>
                <li>Inform us of any changes in health condition</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A1F44] mb-4">6. Limitation of Liability</h2>
              <p>
                VOCT and its practitioners are not liable for any indirect, incidental, or consequential 
                damages arising from the use of our services. Our liability is limited to the amount 
                paid for the specific service in question.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A1F44] mb-4">7. Medical Disclaimer</h2>
              <p>
                Our services do not replace emergency medical care. In case of medical emergencies, 
                please contact emergency services immediately. Our practitioners provide rehabilitation 
                and wellness services based on professional assessment.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A1F44] mb-4">8. Contact</h2>
              <p>
                For questions about these terms, contact us at:{' '}
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

export default TermsAndConditions;
