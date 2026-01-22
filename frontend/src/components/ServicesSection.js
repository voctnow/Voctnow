import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { getServices } from '../api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Service illustration images - matching the reference style
const serviceImages = {
  orthopaedic: 'https://img.freepik.com/free-vector/physiotherapist-helping-patient-rehabilitation-clinic_74855-14065.jpg?w=600',
  neurological: 'https://img.freepik.com/free-vector/rehabilitation-center-physiotherapy_74855-6695.jpg?w=600',
  geriatric: 'https://img.freepik.com/free-vector/elderly-people-doing-sport_74855-5763.jpg?w=600',
  womens_health: 'https://img.freepik.com/free-vector/pregnant-woman-doing-prenatal-yoga_74855-5277.jpg?w=600',
  lifestyle: 'https://img.freepik.com/free-vector/physiotherapy-rehabilitation-people-composition_1284-62854.jpg?w=600',
  sports: 'https://img.freepik.com/free-vector/sports-physiotherapist-treating-athlete_74855-10684.jpg?w=600',
};

// Fallback local images with similar style
const localServiceImages = {
  orthopaedic: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&q=80',
  neurological: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&q=80',
  geriatric: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=500&q=80',
  womens_health: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80',
  lifestyle: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80',
  sports: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
};

const ServiceCard = ({ service, index, onBook }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const imageUrl = imageError 
    ? localServiceImages[service.id] || localServiceImages.orthopaedic
    : serviceImages[service.id] || serviceImages.orthopaedic;

  const handleCardInteraction = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[320px] mx-auto cursor-pointer"
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
        className="relative w-full h-[380px] sm:h-[420px]"
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
          <div className="h-[280px] sm:h-[320px] overflow-hidden bg-gradient-to-b from-blue-50 to-white">
            <img 
              src={imageUrl}
              alt={service.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
          
          {/* Service Name */}
          <div className="p-4 text-center bg-gradient-to-b from-gray-50 to-white">
            <h3 
              className="text-lg sm:text-xl font-semibold text-[#0A1F44]"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {service.name}
            </h3>
          </div>
        </div>

        {/* Back Side - Details */}
        <div 
          className="absolute inset-0 rounded-2xl p-5 sm:p-6 bg-[#0A1F44] text-white flex flex-col overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)',
            boxShadow: '0 10px 40px rgba(10, 31, 68, 0.3)',
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
                  <i className="ri-check-line text-green-400 mt-0.5 flex-shrink-0"></i>
                  <span className="text-white/90">{item}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBook(service.id);
              }}
              className="w-full py-3 bg-white text-[#0A1F44] rounded-xl font-bold text-base transition-all duration-200 hover:scale-[1.02] mt-4"
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
            1280: { slidesPerView: 3.5, spaceBetween: 24, centeredSlides: false },
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
