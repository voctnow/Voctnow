import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createAssessment } from '../api';

const chiefComplaints = [
  { id: 'joint_muscle', label: 'Joint or muscle pain / injury', icon: 'ri-heart-pulse-line' },
  { id: 'nerve_related', label: 'Nerve-related problem', icon: 'ri-brain-line' },
  { id: 'walking_balance', label: 'Difficulty walking or balance issues', icon: 'ri-walk-line' },
  { id: 'post_surgery', label: 'Surgery done recently', icon: 'ri-surgical-mask-line' },
  { id: 'sports_injury', label: 'Sports injury or fitness pain', icon: 'ri-football-line' },
  { id: 'community_care', label: 'Community / home-bound care', icon: 'ri-home-heart-line' },
];

const conditionalQuestions = {
  joint_muscle: [
    { id: 'painLocation', question: 'Where is your pain?', type: 'select', options: ['Neck', 'Shoulder', 'Back', 'Knee', 'Hip', 'Ankle / Foot'] },
    { id: 'painDuration', question: 'Pain duration', type: 'select', options: ['< 2 weeks', '2–6 weeks', '> 6 weeks'] },
    { id: 'painSeverity', question: 'Pain severity (0–10)', type: 'range', min: 0, max: 10 },
    { id: 'painWithMovement', question: 'Does pain increase with movement?', type: 'boolean' },
  ],
  nerve_related: [
    { id: 'neuroDiagnosis', question: 'Have you been diagnosed with', type: 'select', options: ['Stroke', 'Spinal cord injury', "Parkinson's", 'Nerve compression / slipped disc'] },
    { id: 'neuroSymptoms', question: 'Current difficulty', type: 'select', options: ['Weakness in arm/leg', 'Tingling or numbness', 'Difficulty walking', 'Balance problems'] },
    { id: 'walkIndependently', question: 'Can you walk independently?', type: 'select', options: ['Yes', 'With support', 'No'] },
  ],
  walking_balance: [
    { id: 'geriatricExperience', question: 'Do you experience', type: 'select', options: ['Fear of falling', 'Difficulty getting up', 'General weakness', 'Balance issues'] },
    { id: 'recentFalls', question: 'Any recent falls?', type: 'boolean' },
    { id: 'assistanceAtHome', question: 'Need assistance at home?', type: 'boolean' },
  ],
  post_surgery: [
    { id: 'surgeryType', question: 'Surgery type', type: 'select', options: ['Knee replacement', 'Hip replacement', 'Spine surgery', 'Fracture fixation'] },
    { id: 'surgeryDays', question: 'Days since surgery', type: 'number' },
    { id: 'stitchesRemoved', question: 'Stitches removed?', type: 'boolean' },
    { id: 'doctorAdvised', question: 'Doctor advised physiotherapy?', type: 'boolean' },
  ],
  sports_injury: [
    { id: 'activityLevel', question: 'Activity level', type: 'select', options: ['Gym', 'Running', 'Sports (football, cricket, etc.)'] },
    { id: 'injuryType', question: 'Injury type', type: 'select', options: ['Muscle strain', 'Ligament injury', 'Overuse pain'] },
    { id: 'duringActivity', question: 'Happened during sports?', type: 'boolean' },
  ],
  community_care: [
    { id: 'careType', question: 'Looking for', type: 'select', options: ['Long-term home care', 'Bed-bound patient rehab', 'Group physiotherapy'] },
    { id: 'patientCondition', question: 'Patient condition', type: 'select', options: ['Bed-bound', 'Wheelchair-bound', 'Limited mobility'] },
  ],
};

const AssessmentPanel = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    city: '',
    contact: '',
    chiefComplaint: '',
  });

  const progress = (step / 3) * 100;

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const canProceedStep1 = formData.name && formData.age && formData.gender && formData.city && formData.contact;
  const canProceedStep2 = formData.chiefComplaint;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await createAssessment({
        basic_details: {
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender,
          city_area: formData.city,
          contact_number: formData.contact,
        },
        chief_complaint: formData.chiefComplaint,
        conditional_answers: formData,
      });
      
      onClose();
      navigate(`/book/${response.data.recommended_service}?assessment=${response.data.id}`);
    } catch (error) {
      console.error('Assessment submission failed:', error);
      alert('Failed to submit. Please try again.');
    }
    setLoading(false);
  };

  const resetAndClose = () => {
    setStep(1);
    setFormData({
      name: '',
      age: '',
      gender: '',
      city: '',
      contact: '',
      chiefComplaint: '',
    });
    onClose();
  };

  const currentQuestions = conditionalQuestions[formData.chiefComplaint] || [];

  if (!isOpen) return null;

  // 3D Panel animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const panelVariants = {
    hidden: { 
      x: '100%', 
      rotateY: -15,
      scale: 0.95,
      opacity: 0 
    },
    visible: { 
      x: 0, 
      rotateY: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
        duration: 0.6
      }
    },
    exit: { 
      x: '100%', 
      rotateY: -15,
      scale: 0.95,
      opacity: 0,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
        delay: 0.1
      }
    },
    exit: { opacity: 0, y: -20, scale: 0.98 }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, rotateX: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 150,
        delay: i * 0.08
      }
    }),
    hover: {
      scale: 1.02,
      y: -4,
      boxShadow: '0 12px 30px rgba(10, 31, 68, 0.15)',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <>
      {/* Overlay with blur effect */}
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 31, 68, 0.4) 0%, rgba(10, 31, 68, 0.6) 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onClick={resetAndClose}
      />

      {/* 3D Slide Panel */}
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed top-0 right-0 h-full w-full max-w-xl z-50 overflow-hidden"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        <div 
          className="h-full bg-white overflow-y-auto"
          style={{
            boxShadow: '-20px 0 60px rgba(10, 31, 68, 0.2), -8px 0 20px rgba(10, 31, 68, 0.1)',
            borderLeft: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          {/* Animated Progress Bar */}
          <div className="h-1.5 bg-gradient-to-r from-gray-100 to-gray-200 relative overflow-hidden">
            <motion.div 
              className="h-full absolute left-0 top-0"
              style={{
                background: 'linear-gradient(90deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Header with 3D effect */}
          <motion.div 
            className="flex items-center justify-between p-6 border-b border-gray-100 relative"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(249,250,251,1) 100%)',
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <motion.h2 
                className="text-2xl font-bold text-[#0A1F44]" 
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  textShadow: '0 2px 4px rgba(10, 31, 68, 0.1)',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Assessment
              </motion.h2>
              <motion.div 
                className="flex items-center gap-2 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex gap-1">
                  {[1, 2, 3].map((s) => (
                    <motion.div
                      key={s}
                      className={`w-2 h-2 rounded-full ${s <= step ? 'bg-blue-500' : 'bg-gray-300'}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 + s * 0.1 }}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-1">Step {step} of 3</span>
              </motion.div>
            </div>
            <motion.button 
              onClick={resetAndClose}
              className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="ri-close-line text-xl text-gray-600"></i>
            </motion.button>
          </motion.div>

          {/* Content with 3D animations */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.h3 
                    className="text-xl font-semibold text-[#0A1F44] mb-6" 
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Personal Details
                  </motion.h3>
                  <div className="space-y-5">
                    {[
                      { label: 'Full Name', field: 'name', type: 'text', placeholder: 'e.g. Alex Johnson', testId: 'assessment-name' },
                    ].map((input, i) => (
                      <motion.div
                        key={input.field}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">{input.label}</label>
                        <input
                          type={input.type}
                          value={formData[input.field]}
                          onChange={(e) => handleInputChange(input.field, e.target.value)}
                          placeholder={input.placeholder}
                          className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-blue-500 focus:bg-white transition-all outline-none"
                          style={{
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.04)',
                          }}
                          data-testid={input.testId}
                        />
                      </motion.div>
                    ))}
                    <motion.div 
                      className="grid grid-cols-2 gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          placeholder="25"
                          className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-blue-500 focus:bg-white transition-all outline-none"
                          data-testid="assessment-age"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 12px center',
                          }}
                          data-testid="assessment-gender"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">City / Area</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="e.g. Bandra, Mumbai"
                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-blue-500 focus:bg-white transition-all outline-none"
                        data-testid="assessment-city"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                      <input
                        type="tel"
                        value={formData.contact}
                        onChange={(e) => handleInputChange('contact', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Mobile Number"
                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-blue-500 focus:bg-white transition-all outline-none"
                        data-testid="assessment-phone"
                      />
                    </motion.div>
                  </div>
                  <motion.button
                    onClick={() => setStep(2)}
                    disabled={!canProceedStep1}
                    className={`w-full mt-8 py-4 rounded-xl font-semibold transition-all ${
                      canProceedStep1 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      boxShadow: canProceedStep1 ? '0 8px 24px rgba(59, 130, 246, 0.4)' : 'none',
                    }}
                    whileHover={canProceedStep1 ? { scale: 1.02, y: -2 } : {}}
                    whileTap={canProceedStep1 ? { scale: 0.98 } : {}}
                    data-testid="assessment-next-1"
                  >
                    Continue
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Chief Complaint */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.h3 
                    className="text-xl font-semibold text-[#0A1F44] mb-2" 
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    What describes your condition?
                  </motion.h3>
                  <motion.p 
                    className="text-sm text-gray-500 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    Select one that best matches
                  </motion.p>
                  <div className="space-y-3" style={{ perspective: '1000px' }}>
                    {chiefComplaints.map((complaint, i) => (
                      <motion.div
                        key={complaint.id}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleInputChange('chiefComplaint', complaint.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-4 ${
                          formData.chiefComplaint === complaint.id
                            ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                        style={{
                          boxShadow: formData.chiefComplaint === complaint.id 
                            ? '0 8px 24px rgba(59, 130, 246, 0.2)' 
                            : '0 2px 8px rgba(0,0,0,0.04)',
                          transformStyle: 'preserve-3d',
                        }}
                        data-testid={`complaint-${complaint.id}`}
                      >
                        <motion.div 
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            formData.chiefComplaint === complaint.id 
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' 
                              : 'bg-gray-100 text-gray-500'
                          }`}
                          style={{
                            boxShadow: formData.chiefComplaint === complaint.id 
                              ? '0 4px 12px rgba(59, 130, 246, 0.4)' 
                              : 'none',
                          }}
                          animate={{
                            rotateY: formData.chiefComplaint === complaint.id ? [0, 360] : 0,
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          <i className={`${complaint.icon} text-xl`}></i>
                        </motion.div>
                        <span className="font-medium text-gray-700">{complaint.label}</span>
                        {formData.chiefComplaint === complaint.id && (
                          <motion.div
                            className="ml-auto"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <i className="ri-checkbox-circle-fill text-2xl text-blue-500"></i>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-8">
                    <motion.button
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      onClick={() => setStep(3)}
                      disabled={!canProceedStep2}
                      className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                        canProceedStep2 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        boxShadow: canProceedStep2 ? '0 8px 24px rgba(59, 130, 246, 0.4)' : 'none',
                      }}
                      whileHover={canProceedStep2 ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canProceedStep2 ? { scale: 0.98 } : {}}
                      data-testid="assessment-next-2"
                    >
                      Continue
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Conditional Questions */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.h3 
                    className="text-xl font-semibold text-[#0A1F44] mb-6" 
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Additional Details
                  </motion.h3>
                  <div className="space-y-5">
                    {currentQuestions.map((q, i) => (
                      <motion.div 
                        key={q.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-gray-50 rounded-xl p-4"
                        style={{
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.04)',
                        }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-3">{q.question}</label>
                        {q.type === 'select' && (
                          <select
                            value={formData[q.id] || ''}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-800 focus:border-blue-500 transition-all outline-none appearance-none"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 12px center',
                            }}
                          >
                            <option value="">Select</option>
                            {q.options.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        )}
                        {q.type === 'boolean' && (
                          <div className="flex gap-3">
                            {['Yes', 'No'].map((opt) => (
                              <motion.button
                                key={opt}
                                type="button"
                                onClick={() => handleInputChange(q.id, opt)}
                                className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                                  formData[q.id] === opt
                                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                                    : 'border-gray-200 bg-white hover:border-blue-300'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {opt}
                              </motion.button>
                            ))}
                          </div>
                        )}
                        {q.type === 'range' && (
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 w-6">{q.min}</span>
                            <input
                              type="range"
                              min={q.min}
                              max={q.max}
                              value={formData[q.id] || q.min}
                              onChange={(e) => handleInputChange(q.id, e.target.value)}
                              className="flex-1 h-2 rounded-full appearance-none bg-gray-200"
                              style={{
                                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((formData[q.id] || q.min) / q.max) * 100}%, #E5E7EB ${((formData[q.id] || q.min) / q.max) * 100}%, #E5E7EB 100%)`,
                              }}
                            />
                            <motion.span 
                              className="font-bold text-blue-600 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm"
                              key={formData[q.id]}
                              initial={{ scale: 1.3 }}
                              animate={{ scale: 1 }}
                            >
                              {formData[q.id] || q.min}
                            </motion.span>
                          </div>
                        )}
                        {q.type === 'number' && (
                          <input
                            type="number"
                            value={formData[q.id] || ''}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            placeholder="Enter number"
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-800 focus:border-blue-500 transition-all outline-none"
                            min="0"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-8">
                    <motion.button
                      onClick={() => setStep(2)}
                      className="flex-1 py-4 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 py-4 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white disabled:opacity-50"
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                      }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      data-testid="assessment-submit"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.i 
                            className="ri-loader-4-line"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          Submitting...
                        </span>
                      ) : 'Get Recommendation'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AssessmentPanel;
