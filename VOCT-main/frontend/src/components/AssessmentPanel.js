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

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={resetAndClose}
      />

      {/* Slide Panel from Right */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="slide-panel"
      >
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#0A1F44]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Assessment
            </h2>
            <p className="text-sm text-gray-500">Step {step} of 3</p>
          </div>
          <button 
            onClick={resetAndClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <i className="ri-close-line text-xl text-gray-600"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-[#0A1F44] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Personal Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="input-field"
                      data-testid="assessment-name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="25"
                        className="input-field"
                        data-testid="assessment-age"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="input-field select-dropdown"
                        data-testid="assessment-gender"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City / Area</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="e.g. Bandra, Mumbai"
                      className="input-field"
                      data-testid="assessment-city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                    <input
                      type="tel"
                      value={formData.contact}
                      onChange={(e) => handleInputChange('contact', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Mobile Number"
                      className="input-field"
                      data-testid="assessment-phone"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className={`w-full mt-8 py-4 rounded-xl font-semibold transition-all ${
                    canProceedStep1 
                      ? 'bg-[#0A1F44] text-white hover:bg-[#1a3a5c]' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  data-testid="assessment-next-1"
                >
                  Continue
                </button>
              </motion.div>
            )}

            {/* Step 2: Chief Complaint */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-[#0A1F44] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  What describes your condition?
                </h3>
                <p className="text-sm text-gray-500 mb-6">Select one that best matches</p>
                <div className="space-y-3">
                  {chiefComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      onClick={() => handleInputChange('chiefComplaint', complaint.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                        formData.chiefComplaint === complaint.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      data-testid={`complaint-${complaint.id}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.chiefComplaint === complaint.id 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <i className={`${complaint.icon} text-lg`}></i>
                      </div>
                      <span className="font-medium text-gray-700 text-sm">{complaint.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2}
                    className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                      canProceedStep2 
                        ? 'bg-[#0A1F44] text-white hover:bg-[#1a3a5c]' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    data-testid="assessment-next-2"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Conditional Questions */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-[#0A1F44] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Additional Details
                </h3>
                <div className="space-y-5">
                  {currentQuestions.map((q) => (
                    <div key={q.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{q.question}</label>
                      {q.type === 'select' && (
                        <select
                          value={formData[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className="input-field select-dropdown"
                        >
                          <option value="">Select</option>
                          {q.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}
                      {q.type === 'boolean' && (
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => handleInputChange(q.id, 'Yes')}
                            className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                              formData[q.id] === 'Yes'
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInputChange(q.id, 'No')}
                            className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                              formData[q.id] === 'No'
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      )}
                      {q.type === 'range' && (
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">{q.min}</span>
                          <input
                            type="range"
                            min={q.min}
                            max={q.max}
                            value={formData[q.id] || q.min}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            className="flex-1"
                          />
                          <span className="font-bold text-[#0A1F44] w-8 text-center">
                            {formData[q.id] || q.min}
                          </span>
                        </div>
                      )}
                      {q.type === 'number' && (
                        <input
                          type="number"
                          value={formData[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder="Enter number"
                          className="input-field"
                          min="0"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-4 rounded-xl font-semibold bg-[#0A1F44] text-white hover:bg-[#1a3a5c] transition-colors disabled:opacity-50"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    data-testid="assessment-submit"
                  >
                    {loading ? 'Submitting...' : 'Get Recommendation'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default AssessmentPanel;
