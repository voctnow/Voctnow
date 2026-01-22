import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { getServices } from '../api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Light attractive minimal colors for each service card
const cardColors = [
  { bg: 'from-rose-400 to-pink-500', shadow: 'rgba(244, 63, 94, 0.3)' },
  { bg: 'from-amber-400 to-orange-500', shadow: 'rgba(251, 146, 60, 0.3)' },
  { bg: 'from-emerald-400 to-teal-500', shadow: 'rgba(20, 184, 166, 0.3)' },
  { bg: 'from-sky-400 to-cyan-500', shadow: 'rgba(6, 182, 212, 0.3)' },
  { bg: 'from-violet-400 to-purple-500', shadow: 'rgba(139, 92, 246, 0.3)' },
  { bg: 'from-fuchsia-400 to-pink-500', shadow: 'rgba(232, 121, 249, 0.3)' },
];

// Service icons mapping
const serviceIcons = {
  orthopaedic: 'ri-walk-line',
  neurological: 'ri-brain-line',
  geriatric: 'ri-heart-pulse-line',
  womens_health: 'ri-women-line',
  lifestyle: 'ri-leaf-line',
  sports: 'ri-run-line',
  default: 'ri-health-book-line',
};

const FlipCard = ({ service, index, onBook }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const colorIndex = index % cardColors.length;
  const cardColor = cardColors[colorIndex];
  const icon = serviceIcons[service.id] || serviceIcons.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="min-w-[340px] md:min-w-[380px] h-[480px] cursor-pointer snap-center"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      data-testid={`service-card-${service.id}`}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full"
      >
        {/* Front Side - Clean Minimal Card with only Title */}
        <div 
          className="absolute inset-0 rounded-3xl p-10 bg-white flex flex-col items-center justify-center text-center"
          style={{ 
            backfaceVisibility: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
          }}
        >
          {/* Icon */}
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${cardColor.bg} flex items-center justify-center mb-8 shadow-lg`}
               style={{ boxShadow: `0 8px 24px ${cardColor.shadow}` }}>
            <i className={`${icon} text-3xl text-white`}></i>
          </div>
          
          {/* Title Only */}
          <h3 
            className="text-2xl font-bold text-[#0A1F44]"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {service.name}
          </h3>
          
          {/* Hover prompt */}
          <div className="flex items-center gap-2 text-gray-400 font-medium text-sm mt-8">
            <span>Hover to explore</span>
            <i className="ri-arrow-right-line"></i>
          </div>
        </div>

        {/* Back Side - Colorful with 3D effect, shadow and big heading */}
        <div 
          className={`absolute inset-0 rounded-3xl p-8 bg-gradient-to-br ${cardColor.bg} text-white flex flex-col`}
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)',
            boxShadow: `0 20px 50px ${cardColor.shadow}, 0 10px 30px rgba(0,0,0,0.15)`,
          }}
        >
          <div className="flex flex-col h-full">
            {/* Big Title with 3D shadow effect */}
            <h3 
              className="text-3xl font-bold mb-2"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                textShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              {service.name}
            </h3>
            
            {/* Description */}
            <p 
              className="text-white/80 text-sm mb-6"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              {service.description}
            </p>
            
            {/* Service items */}
            <ul className="space-y-2 flex-1 overflow-y-auto">
              {service.sub_services.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <i className="ri-check-line text-white mt-0.5 flex-shrink-0"></i>
                  <span className="text-white/95">{item}</span>
                </li>
              ))}
            </ul>
            
            {/* Book button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBook(service.id);
              }}
              className="w-full py-4 bg-white/95 text-gray-800 rounded-xl font-bold text-base transition-all duration-200 hover:bg-white hover:scale-[1.02] mt-4"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              }}
              data-testid={`book-${service.id}-btn`}
            >
              Book Now
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data))
      .catch((err) => console.error('Failed to load services:', err));
  }, []);

  const handleBookService = (serviceId) => {
    navigate(`/book/${serviceId}`);
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 
            className="text-4xl md:text-5xl font-bold text-[#0A1F44] mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
            data-testid="services-title"
          >
            Our Services
          </h2>
          <p 
            className="text-lg text-gray-500 max-w-2xl mx-auto"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Care that moves with you
          </p>
        </motion.div>

        {/* Infinite Loop Carousel */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 1.5, centeredSlides: true },
            1024: { slidesPerView: 2.5, centeredSlides: true },
            1280: { slidesPerView: 3, centeredSlides: false },
          }}
          className="pb-16"
        >
          {services.map((service, index) => (
            <SwiperSlide key={service.id}>
              <FlipCard 
                service={service} 
                index={index}
                onBook={handleBookService}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ServicesSection;
