import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import CTASection from "./components/CTASection";
import AssessmentPanel from "./components/AssessmentPanel";
import FAQSection from "./components/FAQSection";
import BookingPage from "./components/BookingPage";
import JoinUsPage from "./components/JoinUsPage";
import ProfilePage from "./components/ProfilePage";
import AboutPage from "./components/AboutPage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";

// Internal Dashboard (Hidden from customers)
import InternalLogin from "./components/internal/InternalLogin";
import PractitionerDashboard from "./components/internal/PractitionerDashboard";
import AdminDashboard from "./components/internal/AdminDashboard";

// Home Page
const HomePage = () => {
  const [showAssessment, setShowAssessment] = useState(false);

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <CTASection onOpenAssessment={() => setShowAssessment(true)} />
      <FAQSection />
      <Footer />
      
      {/* Assessment Slide Panel */}
      <AnimatePresence>
        {showAssessment && (
          <AssessmentPanel 
            isOpen={showAssessment} 
            onClose={() => setShowAssessment(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Bookings List Page
const BookingsPage = () => {
  return (
    <>
      <ProfilePage />
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Public Routes with Header */}
            <Route path="/" element={<><Header /><HomePage /></>} />
            <Route path="/book/:serviceId" element={<><Header /><BookingPage /><Footer /></>} />
            <Route path="/join-us" element={<><Header /><JoinUsPage /><Footer /></>} />
            <Route path="/profile" element={<><Header /><ProfilePage /><Footer /></>} />
            <Route path="/bookings" element={<><Header /><BookingsPage /></>} />
            <Route path="/about" element={<><Header /><AboutPage /><Footer /></>} />
            <Route path="/privacy-policy" element={<><Header /><PrivacyPolicy /><Footer /></>} />
            <Route path="/terms-and-conditions" element={<><Header /><TermsAndConditions /><Footer /></>} />
            
            {/* Internal Routes (No public header/footer) */}
            <Route path="/internal/login" element={<InternalLogin />} />
            <Route path="/internal/practitioner/*" element={<PractitionerDashboard />} />
            <Route path="/internal/admin/*" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
