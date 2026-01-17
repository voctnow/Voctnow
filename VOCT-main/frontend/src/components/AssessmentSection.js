import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createAssessment } from '../api';

// TypeScript-like interface structure
const initialFormData = {
  // Step 1 - Required
  name: '',
  age: '',
  gender: '',
  city: '',
  contact: '',
  // Step 2 - Required
  chiefComplaint: '',
  // Step 3 - Conditional
  painLocation: '',
  painDuration: '',
  painSeverity: '',
  painWithMovement: '',
  neuroSymptoms: [],
  neuroDiagnosis: '',
  walkIndependently: '',
  geriatricExperience: '',
  recentFalls: '',
  assistanceAtHome: '',
  surgeryType: '',
  surgeryDays: '',
  stitchesRemoved: '',
  doctorAdvised: '',
  activityLevel: '',
  injuryType: '',
  duringActivity: '',
  careType: '',
  patientCondition: '',
};

const chiefComplaints = [
  { id: 'joint_muscle', label: 'Joint or muscle pain / injury', icon: 'ri-heart-pulse-line', maps: 'Ortho Rehab' },
  { id: 'nerve_related', label: 'Nerve-related problem (weakness, paralysis, tingling)', icon: 'ri-brain-line', maps: 'Neuro Rehab' },
  { id: 'walking_balance', label: 'Difficulty walking, balance issues, or age-related weakness', icon: 'ri-walk-line', maps: 'Geriatric Rehab' },
  { id: 'post_surgery', label: 'Surgery done recently', icon: 'ri-surgical-mask-line', maps: 'Post-Operative Rehabilitation' },
  { id: 'sports_injury', label: 'Sports injury or fitness-related pain', icon: 'ri-football-line', maps: 'Sports Rehab' },
  { id: 'community_care', label: 'Need physiotherapy for community / group / home-bound care', icon: 'ri-home-heart-line', maps: 'Community Rehab' },
];

const conditionalQuestions = {
  joint_muscle: [
    { id: 'painLocation', question: 'Where is your pain?', type: 'select', options: ['Neck', 'Shoulder', 'Back', 'Knee', 'Hip', 'Ankle / Foot'] },
    { id: 'painDuration', question: 'Pain duration', type: 'select', options: ['< 2 weeks', '2–6 weeks', '> 6 weeks'] },
    { id: 'painSeverity', question: 'Pain severity (0–10 scale)', type: 'range', min: 0, max: 10 },
    { id: 'painWithMovement', question: 'Does pain increase with movement?', type: 'boolean' },
  ],
  nerve_related: [
    { id: 'neuroDiagnosis', question: 'Have you been diagnosed with', type: 'select', options: ['Stroke', 'Spinal cord injury', "Parkinson's", 'Nerve compression / slipped disc'] },
    { id: 'neuroSymptoms', question: 'Current difficulty', type: 'select', options: ['Weakness in arm/leg', 'Tingling or numbness', 'Difficulty walking', 'Balance problems'] },
    { id: 'walkIndependently', question: 'Are you able to walk independently?', type: 'select', options: ['Yes', 'With support', 'No'] },
  ],
  walking_balance: [
    { id: 'geriatricExperience', question: 'Do you experience', type: 'select', options: ['Fear of falling', 'Difficulty getting up from chair', 'General weakness', 'Balance issues'] },
    { id: 'recentFalls', question: 'Any recent falls?', type: 'boolean' },
    { id: 'assistanceAtHome', question: 'Do you require assistance at home?', type: 'boolean' },
  ],
  post_surgery: [
    { id: 'surgeryType', question: 'Have you undergone surgery recently?', type: 'select', options: ['Knee replacement', 'Hip replacement', 'Spine surgery', 'Fracture fixation'] },
    { id: 'surgeryDays', question: 'How many days since surgery?', type: 'number' },
    { id: 'stitchesRemoved', question: 'Are stitches removed?', type: 'boolean' },
    { id: 'doctorAdvised', question: 'Doctor advised physiotherapy?', type: 'boolean' },
  ],
  sports_injury: [
    { id: 'activityLevel', question: 'Activity level', type: 'select', options: ['Gym', 'Running', 'Sports (football, cricket, etc.)'] },
    { id: 'injuryType', question: 'Injury type', type: 'select', options: ['Muscle strain', 'Ligament injury', 'Overuse pain'] },
    { id: 'duringActivity', question: 'Did injury happen during sports?', type: 'boolean' },
  ],
  community_care: [
    { id: 'careType', question: 'Are you looking for', type: 'select', options: ['Long-term home care', 'Bed-bound patient rehab', 'Group/community physiotherapy'] },
    { id: 'patientCondition', question: 'Patient condition', type: 'select', options: ['Bed-bound', 'Wheelchair-bound', 'Limited mobility'] },
  ],
};

const AssessmentSection = ({ fullPage = false }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, threshold: 0.1 });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation rules
  const canProceedStep1 = formData.name && formData.age && formData.gender && formData.city && formData.contact;
  const canProceedStep2 = formData.chiefComplaint;

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Map chief complaint to service
      const complaintToService = {
        joint_muscle: 'orthopaedic',
        nerve_related: 'neurological',
        walking_balance: 'geriatric',
        post_surgery: 'orthopaedic',
        sports_injury: 'sports',
        community_care: 'womens_health',
      };
      
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
      
      setSubmitted(true);
      
      // Auto-reset after 3000ms
      setTimeout(() => {
        setSubmitted(false);
        setCurrentStep(1);
        setFormData(initialFormData);
        navigate(`/book/${response.data.recommended_service}?assessment=${response.data.id}`);
      }, 3000);
      
    } catch (error) {
      console.error('Assessment submission failed:', error);
      alert('Failed to submit assessment. Please try again.');
    }
    setLoading(false);
  };

  const currentQuestions = conditionalQuestions[formData.chiefComplaint] || [];

  const content = (
    <div 
      className="bg-white rounded-3xl p-8 md:p-12 max-w-5xl mx-auto relative"
      style={{ boxShadow: '0 16px 48px rgba(10,31,68,0.12)' }}
    >
      {/* Progress Stepper - 3 circles connected by lines */}
      <div className="flex items-center justify-center mb-12">
        {[1, 2, 3].map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                  currentStep === step
                    ? 'bg-[#0A1F44] text-white animate-pulse'
                    : currentStep > step
                    ? 'bg-[#0A1F44] text-white'
                    : 'bg-[#E5E7EB] text-[#4B5563] opacity-40'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {currentStep > step ? <i className="ri-check-line"></i> : step}
              </div>
              <span 
                className="text-sm mt-2 font-medium text-[#4B5563]"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {step === 1 ? 'Basic Info' : step === 2 ? 'Chief Complaint' : 'Details'}
              </span>
            </div>
            {index < 2 && (
              <div 
                className={`w-16 h-1 mx-2 transition-all duration-200 ${
                  currentStep > step ? 'bg-[#0A1F44]' : 'bg-[#E5E7EB]'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Success State */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-check-line text-4xl text-white"></i>
          </div>
          <h3 className="text-2xl font-bold text-[#0A1F44] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Assessment Submitted!
          </h3>
          <p className="text-[#4B5563]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Redirecting you to booking...
          </p>
        </motion.div>
      )}

      {!submitted && (
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 
                className="text-2xl font-bold text-[#0A1F44] mb-6"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Basic Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-[#4B5563] mb-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-xl transition-colors focus:border-[#0A1F44] focus:outline-none"
                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                    data-testid="assessment-name"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-[#4B5563] mb-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                      Age *
                    </label>
                    <input
                      type="number"
                      name="age"
                      required
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Age"
                      className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-xl transition-colors focus:border-[#0A1F44] focus:outline-none"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                      min="1"
                      max="120"
                      data-testid="assessment-age"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#4B5563] mb-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                      Gender *
                    </label>
                    <select
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-xl transition-colors focus:border-[#0A1F44] focus:outline-none"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                      data-testid="assessment-gender"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-[#4B5563] mb-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    City / Area *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter your city or area"
                    className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-xl transition-colors focus:border-[#0A1F44] focus:outline-none"
                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                    data-testid="assessment-city"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#4B5563] mb-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    required
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter your contact number"
                    className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-xl transition-colors focus:border-[#0A1F44] focus:outline-none"
                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                    data-testid="assessment-phone"
                  />
                </div>
              </div>
              <button
                onClick={handleNext}
                disabled={!canProceedStep1}
                className={`w-full mt-8 py-4 px-8 rounded-full font-semibold text-white transition-all duration-200 ${
                  canProceedStep1 
                    ? 'bg-gradient-to-r from-[#0A1F44] to-[#1a3a5c] hover:-translate-y-0.5 active:translate-y-1' 
                    : 'opacity-50 cursor-not-allowed bg-[#0A1F44]'
                }`}
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  boxShadow: canProceedStep1 ? '0 6px 0 #050f22, 0 8px 16px rgba(10,31,68,0.3)' : 'none'
                }}
                data-testid="assessment-next-1"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* Step 2: Chief Complaint */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 
                className="text-2xl font-bold text-[#0A1F44] mb-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                What best describes your chief complaint?
              </h3>
              <p className="text-[#4B5563] mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Select one option that matches your condition
              </p>
              <div className="space-y-3">
                {chiefComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    onClick={() => handleInputChange('chiefComplaint', complaint.id)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4 ${
                      formData.chiefComplaint === complaint.id
                        ? 'border-[#0A1F44] bg-blue-50 shadow-lg'
                        : 'border-[#E5E7EB] hover:border-[#0A1F44] hover:shadow-md'
                    }`}
                    data-testid={`complaint-${complaint.id}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <i className={`${complaint.icon} text-2xl text-[#0A1F44]`}></i>
                    </div>
                    <span className="font-medium text-gray-800" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                      {complaint.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleBack}
                  className="flex-1 py-4 px-8 border-2 border-[#0A1F44] text-[#0A1F44] rounded-full font-semibold transition-all duration-200 hover:bg-[#0A1F44] hover:text-white"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canProceedStep2}
                  className={`flex-1 py-4 px-8 rounded-full font-semibold text-white transition-all duration-200 ${
                    canProceedStep2 
                      ? 'bg-gradient-to-r from-[#0A1F44] to-[#1a3a5c] hover:-translate-y-0.5 active:translate-y-1' 
                      : 'opacity-50 cursor-not-allowed bg-[#0A1F44]'
                  }`}
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: canProceedStep2 ? '0 6px 0 #050f22, 0 8px 16px rgba(10,31,68,0.3)' : 'none'
                  }}
                  data-testid="assessment-next-2"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Conditional Questions */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 
                className="text-2xl font-bold text-[#0A1F44] mb-6"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Additional Details
              </h3>
              <div className="space-y-6">
                {currentQuestions.map((q) => (
                  <div key={q.id}>
                    <label 
                      className="block font-medium text-[#4B5563] mb-3"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                      {q.question}
                    </label>
                    {q.type === 'select' && (
                      <select
                        name={q.id}
                        value={formData[q.id] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-xl transition-colors focus:border-[#0A1F44] focus:outline-none"
                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                        data-testid={`question-${q.id}`}
                      >
                        <option value="">Select an option</option>
                        {q.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                    {q.type === 'boolean' && (
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => handleInputChange(q.id, 'Yes')}
                          className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                            formData[q.id] === 'Yes'
                              ? 'border-[#0A1F44] bg-[#0A1F44] text-white'
                              : 'border-[#E5E7EB] hover:border-[#0A1F44]'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInputChange(q.id, 'No')}
                          className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                            formData[q.id] === 'No'
                              ? 'border-[#0A1F44] bg-[#0A1F44] text-white'
                              : 'border-[#E5E7EB] hover:border-[#0A1F44]'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    )}
                    {q.type === 'range' && (
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[#4B5563]">{q.min}</span>
                        <input
                          type="range"
                          min={q.min}
                          max={q.max}
                          value={formData[q.id] || q.min}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className="flex-1"
                        />
                        <span className="font-bold text-[#0A1F44] text-xl w-8 text-center">
                          {formData[q.id] || q.min}
                        </span>
                        <span className="text-sm text-[#4B5563]">{q.max}</span>
                      </div>
                    )}
                    {q.type === 'number' && (
                      <input
                        type="number"
                        name={q.id}
                        value={formData[q.id] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        placeholder="Enter number"
                        className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-xl transition-colors focus:border-[#0A1F44] focus:outline-none"
                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                        min="0"
                      />
                    )}
                    {q.type === 'textarea' && (
                      <textarea
                        name={q.id}
                        value={formData[q.id] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        placeholder="Enter your response"
                        maxLength={500}
                        className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-xl transition-colors focus:border-[#0A1F44] focus:outline-none h-24 resize-none"
                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleBack}
                  className="flex-1 py-4 px-8 border-2 border-[#0A1F44] text-[#0A1F44] rounded-full font-semibold transition-all duration-200 hover:bg-[#0A1F44] hover:text-white"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-4 px-8 rounded-full font-semibold text-white bg-gradient-to-r from-[#0A1F44] to-[#1a3a5c] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-1 disabled:opacity-50"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 6px 0 #050f22, 0 8px 16px rgba(10,31,68,0.3)'
                  }}
                  data-testid="assessment-submit"
                >
                  {loading ? 'Submitting...' : 'Get Recommendation'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-[#F9FAFB]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 
              className="text-4xl md:text-5xl font-bold text-[#0A1F44] mb-4"
              style={{ fontFamily: 'Poppins, sans-serif' }}
              data-testid="assessment-title"
            >
              VOCT Assessment
            </h1>
            <p 
              className="text-lg text-[#4B5563]"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              Help us understand your condition to recommend the best service for you
            </p>
          </motion.div>
          {content}
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 md:py-32 bg-[#F9FAFB]" ref={sectionRef}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 
            className="text-4xl md:text-5xl font-bold text-[#0A1F44] mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Take Free Assessment
          </h2>
          <p 
            className="text-lg text-[#4B5563]"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Not sure which service is right?
          </p>
        </motion.div>
        {content}
      </div>
    </section>
  );
};

export default AssessmentSection;
