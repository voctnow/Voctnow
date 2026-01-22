import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { getServices } from '../api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Service cover images - processed local images
const serviceImages = {
  orthopaedic: '/service-orthopaedic.png',
  neurological: '/service-neurological.png', // Will be added when user provides
  geriatric: '/service-geriatric.png',
  womens_health: '/service-womens_health.png',
  lifestyle: '/service-lifestyle.png',
  sports: '/service-sports.png',
};

// Fallback colors for cards
const serviceColors = {
  orthopaedic: '#3B82F6',
  neurological: '#8B5CF6',
  geriatric: '#10B981',
  womens_health: '#EC4899',
  lifestyle: '#F59E0B',
  sports: '#EF4444',
};

const ServiceCard = ({ service, index, onBook }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const imageUrl = serviceImages[service.id] || serviceImages.orthopaedic;
  const accentColor = serviceColors[service.id] || serviceColors.orthopaedic;

  const handleCardInteraction = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[300px] mx-auto cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={handleCardInteraction}
      data-testid={`service-card-${service.id}`}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-[360px] sm:h-[400px]"
      >
        {/* Front Side - Image Card */}
        <div 
          className="absolute inset-0 bg-white rounded-2xl overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          {/* Image Container */}
          <div className="h-[280px] sm:h-[310px] bg-white flex items-center justify-center overflow-hidden">
            <img 
              src={imageUrl}
              alt={service.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          
          {/* Service Name */}
          <div className="p-4 text-center bg-white border-t border-gray-100">
            <h3 
              className="text-base sm:text-lg font-semibold text-[#4B5563]"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {service.name}
            </h3>
          </div>
        </div>

        {/* Back Side - Details */}
        <div 
          className="absolute inset-0 rounded-2xl p-5 sm:p-6 text-white flex flex-col overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)',
            backgroundColor: accentColor,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          }}
        >
          <div className="flex flex-col h-full">
            <h3 
              className="text-xl sm:text-2xl font-bold mb-3"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {service.name}
            </h3>
            
            <p 
              className="text-white/80 text-sm mb-4"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              {service.description}
            </p>
            
            <ul className="space-y-2 flex-1 overflow-y-auto">
              {service.sub_services.slice(0, 4).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <i className="ri-check-line text-white mt-0.5 flex-shrink-0"></i>
                  <span className="text-white/90">{item}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBook(service.id);
              }}
              className="w-full py-3 bg-white text-gray-800 rounded-xl font-bold text-base transition-all duration-200 hover:scale-[1.02] mt-4"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices();
        setServices(response.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };
    fetchServices();
  }, []);

  const handleBookService = (serviceId) => {
    navigate(`/book/${serviceId}`);
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0A1F44] mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Our Services
          </h2>
          <p 
            className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Care that moves with you
          </p>
        </motion.div>

        {/* Carousel */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={1.15}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          grabCursor={true}
          speed={600}
          centeredSlides={true}
          breakpoints={{
            480: { slidesPerView: 1.3, spaceBetween: 16 },
            640: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false },
            1024: { slidesPerView: 3, spaceBetween: 24, centeredSlides: false },
            1280: { slidesPerView: 4, spaceBetween: 24, centeredSlides: false },
          }}
          className="pb-16 service-swiper"
        >
          {services.map((service, index) => (
            <SwiperSlide key={service.id}>
              <ServiceCard 
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
