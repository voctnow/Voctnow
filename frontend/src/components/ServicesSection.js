import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { getServices } from '../api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Service cover images and colors
const serviceCovers = {
  orthopaedic: {
    image: 'https://images.unsplash.com/photo-1649751361457-01d3a696c7e6?w=600&q=80',
    gradient: 'from-blue-600/90 to-blue-800/90',
    color: '#1e40af'
  },
  neurological: {
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80',
    gradient: 'from-purple-600/90 to-purple-800/90',
    color: '#7c3aed'
  },
  geriatric: {
    image: 'https://images.unsplash.com/photo-1758691462321-9b6c98c40f7e?w=600&q=80',
    gradient: 'from-emerald-600/90 to-emerald-800/90',
    color: '#059669'
  },
  womens_health: {
    image: 'https://images.unsplash.com/photo-1717500252780-036bfd89f810?w=600&q=80',
    gradient: 'from-pink-500/90 to-rose-600/90',
    color: '#db2777'
  },
  lifestyle: {
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    gradient: 'from-amber-500/90 to-orange-600/90',
    color: '#d97706'
  },
  sports: {
    image: 'https://images.unsplash.com/photo-4506160/pexels-photo-4506160.jpeg?w=600&q=80',
    gradient: 'from-red-500/90 to-red-700/90',
    color: '#dc2626'
  },
};

const defaultCover = {
  image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
  gradient: 'from-gray-600/90 to-gray-800/90',
  color: '#4b5563'
};

const FlipCard = ({ service, index, onBook }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cover = serviceCovers[service.id] || defaultCover;

  const handleCardInteraction = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px] h-[420px] sm:h-[450px] md:h-[480px] cursor-pointer snap-center"
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
        className="relative w-full h-full"
      >
        {/* Front Side - Illustration Cover */}
        <div 
          className="absolute inset-0 rounded-3xl overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
          }}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${cover.image})`,
              filter: 'brightness(0.7)',
            }}
          />
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${cover.gradient}`} />
          
          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
            <h3 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              {service.name}
            </h3>
            <div className="flex items-center gap-2 text-white/70 font-medium text-sm mt-4">
              <span className="hidden md:inline">Hover to explore</span>
              <span className="md:hidden">Tap to explore</span>
              <i className="ri-arrow-right-line"></i>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 rounded-3xl p-5 sm:p-6 md:p-8 text-white flex flex-col overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)',
            backgroundColor: cover.color,
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          }}
        >
          <div className="flex flex-col h-full">
            <h3 
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                textShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
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
              {service.sub_services.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <i className="ri-check-line text-white mt-0.5 flex-shrink-0"></i>
                  <span className="text-white/95">{item}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBook(service.id);
              }}
              className="w-full py-3 md:py-4 bg-white text-gray-800 rounded-xl font-bold text-base transition-all duration-200 hover:scale-[1.02] mt-4"
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
    <section id="services" className="py-16 md:py-24 bg-gray-50 overflow-hidden">
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
          spaceBetween={20}
          slidesPerView={1.2}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          grabCursor={true}
          speed={600}
          centeredSlides={true}
          breakpoints={{
            480: { slidesPerView: 1.3, spaceBetween: 20 },
            640: { slidesPerView: 1.5, spaceBetween: 24 },
            1024: { slidesPerView: 2.5, spaceBetween: 24 },
            1280: { slidesPerView: 3, spaceBetween: 24, centeredSlides: false },
          }}
          className="pb-16 service-swiper"
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
