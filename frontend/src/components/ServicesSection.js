import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { getServices } from '../api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Service background colors and styles
const serviceStyles = {
  orthopaedic: { 
    bg: 'bg-gradient-to-br from-blue-100 to-blue-50', 
    accent: '#3B82F6',
    icon: 'ri-walk-line'
  },
  neurological: { 
    bg: 'bg-gradient-to-br from-purple-100 to-purple-50', 
    accent: '#8B5CF6',
    icon: 'ri-brain-line'
  },
  geriatric: { 
    bg: 'bg-gradient-to-br from-emerald-100 to-emerald-50', 
    accent: '#10B981',
    icon: 'ri-heart-pulse-line'
  },
  womens_health: { 
    bg: 'bg-gradient-to-br from-pink-100 to-pink-50', 
    accent: '#EC4899',
    icon: 'ri-women-line'
  },
  lifestyle: { 
    bg: 'bg-gradient-to-br from-amber-100 to-amber-50', 
    accent: '#F59E0B',
    icon: 'ri-leaf-line'
  },
  sports: { 
    bg: 'bg-gradient-to-br from-red-100 to-red-50', 
    accent: '#EF4444',
    icon: 'ri-run-line'
  },
};

// SVG Illustrations for each service
const ServiceIllustration = ({ type, className }) => {
  const illustrations = {
    orthopaedic: (
      <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Person doing leg exercise with therapist */}
        <ellipse cx="100" cy="180" rx="80" ry="10" fill="#E5E7EB" opacity="0.5"/>
        {/* Patient on bed */}
        <rect x="30" y="130" width="100" height="40" rx="6" fill="#60A5FA"/>
        <rect x="30" y="125" width="100" height="10" rx="3" fill="#3B82F6"/>
        {/* Patient body */}
        <circle cx="55" cy="105" r="18" fill="#FBBF24"/>
        <ellipse cx="55" cy="108" rx="12" ry="8" fill="#FCD34D"/>
        <circle cx="50" cy="102" r="2" fill="#1F2937"/>
        <circle cx="60" cy="102" r="2" fill="#1F2937"/>
        <path d="M52 110 Q55 113 58 110" stroke="#1F2937" strokeWidth="1.5" fill="none"/>
        <rect x="45" y="120" width="20" height="25" rx="4" fill="#60A5FA"/>
        {/* Leg being stretched */}
        <rect x="75" y="130" width="40" height="10" rx="3" fill="#FBBF24"/>
        <circle cx="115" cy="135" r="8" fill="#FBBF24"/>
        {/* Therapist */}
        <circle cx="150" cy="90" r="15" fill="#FBBF24"/>
        <circle cx="146" cy="87" r="2" fill="#1F2937"/>
        <circle cx="154" cy="87" r="2" fill="#1F2937"/>
        <path d="M147 94 Q150 97 153 94" stroke="#1F2937" strokeWidth="1.5" fill="none"/>
        <rect x="140" y="105" width="20" height="35" rx="4" fill="#34D399"/>
        <rect x="130" y="115" width="15" height="8" rx="2" fill="#FBBF24"/>
        <rect x="140" y="140" width="8" height="30" rx="2" fill="#60A5FA"/>
        <rect x="152" y="140" width="8" height="30" rx="2" fill="#60A5FA"/>
      </svg>
    ),
    neurological: (
      <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="180" rx="80" ry="10" fill="#E5E7EB" opacity="0.5"/>
        {/* Brain icon */}
        <circle cx="100" cy="60" r="35" fill="#C4B5FD"/>
        <path d="M85 45 Q75 55 80 70 Q85 85 100 85 Q115 85 120 70 Q125 55 115 45 Q105 35 100 45 Q95 35 85 45Z" fill="#8B5CF6"/>
        <path d="M90 50 Q85 60 90 70" stroke="#DDD6FE" strokeWidth="2" fill="none"/>
        <path d="M110 50 Q115 60 110 70" stroke="#DDD6FE" strokeWidth="2" fill="none"/>
        {/* Patient with walker */}
        <circle cx="70" cy="115" r="12" fill="#FBBF24"/>
        <circle cx="67" cy="113" r="1.5" fill="#1F2937"/>
        <circle cx="73" cy="113" r="1.5" fill="#1F2937"/>
        <rect x="63" y="127" width="14" height="25" rx="3" fill="#60A5FA"/>
        <rect x="63" y="152" width="6" height="20" rx="2" fill="#3B82F6"/>
        <rect x="71" y="152" width="6" height="20" rx="2" fill="#3B82F6"/>
        {/* Walker */}
        <rect x="85" y="130" width="3" height="40" fill="#9CA3AF"/>
        <rect x="95" y="130" width="3" height="40" fill="#9CA3AF"/>
        <rect x="85" y="128" width="15" height="5" rx="2" fill="#9CA3AF"/>
        <circle cx="87" cy="172" r="3" fill="#6B7280"/>
        <circle cx="97" cy="172" r="3" fill="#6B7280"/>
        {/* Therapist helping */}
        <circle cx="130" cy="115" r="12" fill="#FBBF24"/>
        <rect x="123" y="127" width="14" height="25" rx="3" fill="#34D399"/>
        <rect x="117" y="135" width="10" height="6" rx="2" fill="#FBBF24"/>
      </svg>
    ),
    geriatric: (
      <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="180" rx="80" ry="10" fill="#E5E7EB" opacity="0.5"/>
        {/* Elderly person in chair */}
        <rect x="50" y="110" width="50" height="50" rx="6" fill="#34D399"/>
        <rect x="45" y="105" width="60" height="10" rx="3" fill="#10B981"/>
        <rect x="45" y="160" width="10" height="15" rx="2" fill="#10B981"/>
        <rect x="95" y="160" width="10" height="15" rx="2" fill="#10B981"/>
        {/* Elderly person */}
        <circle cx="75" cy="85" r="16" fill="#FBBF24"/>
        <circle cx="71" cy="82" r="2" fill="#1F2937"/>
        <circle cx="79" cy="82" r="2" fill="#1F2937"/>
        <path d="M72 89 Q75 92 78 89" stroke="#1F2937" strokeWidth="1.5" fill="none"/>
        {/* White hair */}
        <path d="M60 78 Q65 65 75 63 Q85 65 90 78" fill="#E5E7EB"/>
        <rect x="66" y="100" width="18" height="30" rx="4" fill="#60A5FA"/>
        {/* Caregiver */}
        <circle cx="135" cy="90" r="14" fill="#FBBF24"/>
        <circle cx="131" cy="87" r="2" fill="#1F2937"/>
        <circle cx="139" cy="87" r="2" fill="#1F2937"/>
        <path d="M132 94 Q135 97 138 94" stroke="#1F2937" strokeWidth="1.5" fill="none"/>
        <rect x="128" y="104" width="14" height="28" rx="4" fill="#F472B6"/>
        {/* Arm reaching to help */}
        <rect x="115" y="115" width="18" height="6" rx="2" fill="#FBBF24"/>
        <rect x="128" y="132" width="6" height="25" rx="2" fill="#3B82F6"/>
        <rect x="136" y="132" width="6" height="25" rx="2" fill="#3B82F6"/>
        {/* Heart */}
        <path d="M155 70 Q160 60 170 70 Q180 60 185 70 Q185 85 170 100 Q155 85 155 70Z" fill="#F87171"/>
      </svg>
    ),
    womens_health: (
      <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="180" rx="80" ry="10" fill="#E5E7EB" opacity="0.5"/>
        {/* Yoga mat */}
        <rect x="40" y="150" width="120" height="8" rx="2" fill="#F472B6"/>
        {/* Woman doing yoga */}
        <circle cx="100" cy="70" r="18" fill="#FBBF24"/>
        <circle cx="95" cy="67" r="2" fill="#1F2937"/>
        <circle cx="105" cy="67" r="2" fill="#1F2937"/>
        <path d="M97 75 Q100 78 103 75" stroke="#1F2937" strokeWidth="1.5" fill="none"/>
        {/* Hair */}
        <path d="M82 65 Q85 50 100 48 Q115 50 118 65" fill="#7C3AED"/>
        <path d="M118 65 Q125 70 120 85" fill="#7C3AED"/>
        {/* Body in seated pose */}
        <ellipse cx="100" cy="110" rx="15" ry="25" fill="#EC4899"/>
        {/* Legs crossed */}
        <ellipse cx="85" cy="140" rx="20" ry="8" fill="#3B82F6"/>
        <ellipse cx="115" cy="140" rx="20" ry="8" fill="#3B82F6"/>
        {/* Arms up */}
        <rect x="70" y="85" width="8" height="30" rx="3" fill="#FBBF24" transform="rotate(-30 70 85)"/>
        <rect x="122" y="85" width="8" height="30" rx="3" fill="#FBBF24" transform="rotate(30 130 85)"/>
        {/* Hands */}
        <circle cx="62" cy="65" r="6" fill="#FBBF24"/>
        <circle cx="138" cy="65" r="6" fill="#FBBF24"/>
        {/* Decorative flowers */}
        <circle cx="45" cy="100" r="8" fill="#FDE68A"/>
        <circle cx="45" cy="100" r="4" fill="#FBBF24"/>
        <circle cx="155" cy="100" r="8" fill="#FDE68A"/>
        <circle cx="155" cy="100" r="4" fill="#FBBF24"/>
      </svg>
    ),
    lifestyle: (
      <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="180" rx="80" ry="10" fill="#E5E7EB" opacity="0.5"/>
        {/* Person stretching */}
        <circle cx="100" cy="55" r="16" fill="#FBBF24"/>
        <circle cx="96" cy="52" r="2" fill="#1F2937"/>
        <circle cx="104" cy="52" r="2" fill="#1F2937"/>
        <path d="M97 59 Q100 62 103 59" stroke="#1F2937" strokeWidth="1.5" fill="none"/>
        {/* Body */}
        <rect x="90" y="70" width="20" height="35" rx="5" fill="#34D399"/>
        {/* Legs */}
        <rect x="90" y="105" width="8" height="40" rx="3" fill="#3B82F6"/>
        <rect x="102" y="105" width="8" height="40" rx="3" fill="#3B82F6"/>
        {/* Arms stretching */}
        <rect x="60" y="75" width="35" height="8" rx="3" fill="#FBBF24"/>
        <rect x="105" y="75" width="35" height="8" rx="3" fill="#FBBF24"/>
        {/* Leaves/nature elements */}
        <path d="M40 130 Q50 110 60 130 Q50 125 40 130Z" fill="#34D399"/>
        <path d="M35 145 Q45 125 55 145 Q45 140 35 145Z" fill="#10B981"/>
        <path d="M150 130 Q160 110 170 130 Q160 125 150 130Z" fill="#34D399"/>
        <path d="M155 145 Q165 125 175 145 Q165 140 155 145Z" fill="#10B981"/>
        {/* Sun */}
        <circle cx="160" cy="40" r="15" fill="#FDE68A"/>
        <circle cx="160" cy="40" r="10" fill="#FBBF24"/>
      </svg>
    ),
    sports: (
      <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="180" rx="80" ry="10" fill="#E5E7EB" opacity="0.5"/>
        {/* Runner */}
        <circle cx="90" cy="50" r="16" fill="#FBBF24"/>
        <circle cx="86" cy="47" r="2" fill="#1F2937"/>
        <circle cx="94" cy="47" r="2" fill="#1F2937"/>
        <path d="M87 54 Q90 57 93 54" stroke="#1F2937" strokeWidth="1.5" fill="none"/>
        {/* Body leaning forward */}
        <rect x="80" y="65" width="18" height="30" rx="4" fill="#EF4444" transform="rotate(15 90 80)"/>
        {/* Running legs */}
        <rect x="75" y="95" width="8" height="35" rx="3" fill="#3B82F6" transform="rotate(-20 80 95)"/>
        <rect x="100" y="90" width="8" height="35" rx="3" fill="#3B82F6" transform="rotate(35 100 90)"/>
        {/* Arms */}
        <rect x="65" y="70" width="6" height="25" rx="2" fill="#FBBF24" transform="rotate(30 68 70)"/>
        <rect x="100" y="68" width="6" height="25" rx="2" fill="#FBBF24" transform="rotate(-40 103 68)"/>
        {/* Motion lines */}
        <rect x="45" y="70" width="15" height="3" rx="1" fill="#9CA3AF"/>
        <rect x="40" y="80" width="20" height="3" rx="1" fill="#9CA3AF"/>
        <rect x="45" y="90" width="15" height="3" rx="1" fill="#9CA3AF"/>
        {/* Dumbbell */}
        <rect x="145" y="100" width="30" height="6" rx="2" fill="#6B7280"/>
        <rect x="140" y="95" width="10" height="16" rx="2" fill="#4B5563"/>
        <rect x="170" y="95" width="10" height="16" rx="2" fill="#4B5563"/>
        {/* Ball */}
        <circle cx="155" cy="150" r="15" fill="#F97316"/>
        <path d="M145 145 Q155 140 165 145" stroke="#FDBA74" strokeWidth="2" fill="none"/>
        <path d="M145 155 Q155 160 165 155" stroke="#FDBA74" strokeWidth="2" fill="none"/>
      </svg>
    ),
  };
  
  return illustrations[type] || illustrations.orthopaedic;
};

const ServiceCard = ({ service, index, onBook }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const styles = serviceStyles[service.id] || serviceStyles.orthopaedic;

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
        {/* Front Side - Illustration Card */}
        <div 
          className="absolute inset-0 bg-white rounded-2xl overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          {/* Illustration Container */}
          <div className={`h-[280px] sm:h-[310px] ${styles.bg} flex items-center justify-center p-4`}>
            <ServiceIllustration type={service.id} className="w-full h-full" />
          </div>
          
          {/* Service Name */}
          <div className="p-4 text-center bg-white">
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
          className="absolute inset-0 rounded-2xl p-5 sm:p-6 text-white flex flex-col overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)',
            backgroundColor: styles.accent,
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
