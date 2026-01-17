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
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/book/:serviceId" element={<><BookingPage /><Footer /></>} />
            <Route path="/join-us" element={<><JoinUsPage /><Footer /></>} />
            <Route path="/profile" element={<><ProfilePage /><Footer /></>} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/about" element={<><AboutPage /><Footer /></>} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
