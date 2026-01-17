import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { applyAsPractitioner, uploadCertificate } from '../api';

const JoinUsPage = () => {
  const [step, setStep] = useState(1); // 1: personal, 2: education, 3: bank, 4: joining, 5: success
  const [loading, setLoading] = useState(false);
  const [practitionerId, setPractitionerId] = useState(null);
  const [files, setFiles] = useState({ degree: null, certifications: [] });

  const [formData, setFormData] = useState({
    personal_details: {
      full_name: '',
      age: '',
      gender: '',
      contact_number: '',
      email: '',
      mothers_name: '',
      permanent_address: '',
      temporary_address: '',
      pin_code: '',
      city: '',
    },
    education: {
      institution_name: '',
      location: '',
      degree: '',
      bpth: false,
      mpth: false,
      mpth_specialization: '',
      aggregate_percentage: '',
      year_of_graduation: '',
      year_of_post_graduation: '',
      research_title: '',
      other_courses: '',
      registration_no: '',
    },
    bank_details: {
      bank_name: '',
      branch_name: '',
      branch_address: '',
      account_number: '',
      ifsc_code: '',
      pan_card_number: '',
      aadhar_number: '',
      upi_id: '',
    },
    joining_details: {
      years_of_experience: '',
      has_electrotherapy_equipment: false,
      travel_distance: '',
      emergency_availability: '',
      unique_practice: '',
      standout_quality: '',
    },
  });

  const updateFormData = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (type, e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
      if (type === 'degree') {
        setFiles((prev) => ({ ...prev, degree: file }));
      } else {
        setFiles((prev) => ({ ...prev, certifications: [...prev.certifications, file] }));
      }
    } else {
      alert('Please upload a PDF file under 5MB');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare data
      const submitData = {
        personal_details: {
          ...formData.personal_details,
          age: parseInt(formData.personal_details.age),
        },
        education: {
          ...formData.education,
          aggregate_percentage: parseFloat(formData.education.aggregate_percentage),
          year_of_graduation: parseInt(formData.education.year_of_graduation),
          year_of_post_graduation: formData.education.year_of_post_graduation
            ? parseInt(formData.education.year_of_post_graduation)
            : null,
        },
        bank_details: formData.bank_details,
        joining_details: {
          ...formData.joining_details,
          years_of_experience: parseInt(formData.joining_details.years_of_experience),
        },
      };

      const response = await applyAsPractitioner(submitData);
      setPractitionerId(response.data.id);

      // Upload files
      if (files.degree) {
        await uploadCertificate(response.data.id, files.degree, 'degree');
      }
      for (const cert of files.certifications) {
        await uploadCertificate(response.data.id, cert, 'certification');
      }

      setStep(5);
    } catch (error) {
      console.error('Application submission failed:', error);
      alert('Failed to submit application. Please try again.');
    }
    setLoading(false);
  };

  const renderPersonalDetails = () => (
    <>
      <h2 className="font-poppins font-bold text-2xl text-navy mb-6">Personal Details</h2>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">Full Name *</label>
            <input
              type="text"
              value={formData.personal_details.full_name}
              onChange={(e) => updateFormData('personal_details', 'full_name', e.target.value)}
              className="input-field"
              data-testid="practitioner-name"
            />
          </div>
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">Age *</label>
            <input
              type="number"
              value={formData.personal_details.age}
              onChange={(e) => updateFormData('personal_details', 'age', e.target.value)}
              className="input-field"
              min="18"
              max="100"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">Gender *</label>
            <select
              value={formData.personal_details.gender}
              onChange={(e) => updateFormData('personal_details', 'gender', e.target.value)}
              className="input-field"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">Contact Number *</label>
            <input
              type="tel"
              value={formData.personal_details.contact_number}
              onChange={(e) => updateFormData('personal_details', 'contact_number', e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="input-field"
            />
          </div>
        </div>
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">Email *</label>
          <input
            type="email"
            value={formData.personal_details.email}
            onChange={(e) => updateFormData('personal_details', 'email', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">Mother's Name *</label>
          <input
            type="text"
            value={formData.personal_details.mothers_name}
            onChange={(e) => updateFormData('personal_details', 'mothers_name', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">Permanent Address *</label>
          <textarea
            value={formData.personal_details.permanent_address}
            onChange={(e) => updateFormData('personal_details', 'permanent_address', e.target.value)}
            className="input-field h-20 resize-none"
          />
        </div>
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">Temporary Address</label>
          <textarea
            value={formData.personal_details.temporary_address}
            onChange={(e) => updateFormData('personal_details', 'temporary_address', e.target.value)}
            className="input-field h-20 resize-none"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">City *</label>
            <input
              type="text"
              value={formData.personal_details.city}
              onChange={(e) => updateFormData('personal_details', 'city', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">Pin Code *</label>
            <input
              type="text"
              value={formData.personal_details.pin_code}
              onChange={(e) => updateFormData('personal_details', 'pin_code', e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="input-field"
            />
          </div>
        </div>
      </div>
      <button onClick={() => setStep(2)} className="btn-3d w-full mt-8">
        Continue to Education Details
      </button>
    </>
  );

  const renderEducationDetails = () => (
    <>
      <h2 className="font-poppins font-bold text-2xl text-navy mb-6">Education Details</h2>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">Name of Institution *</label>
            <input
              type="text"
              value={formData.education.institution_name}
              onChange={(e) => updateFormData('education', 'institution_name', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">Location *</label>
            <input
              type="text"
              value={formData.education.location}
              onChange={(e) => updateFormData('education', 'location', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">Degree Obtained *</label>
          <input
            type="text"
            value={formData.education.degree}
            onChange={(e) => updateFormData('education', 'degree', e.target.value)}
            className="input-field"
          />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.education.bpth}
              onChange={(e) => updateFormData('education', 'bpth', e.target.checked)}
              className="w-5 h-5"
            />
            <span>B.P.T.H</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.education.mpth}
              onChange={(e) => updateFormData('education', 'mpth', e.target.checked)}
              className="w-5 h-5"
            />
            <span>M.P.T.H</span>
          </label>
        </div>
        {formData.education.mpth && (
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">M.P.T.H Specialization</label>
            <input
              type="text"
              value={formData.education.mpth_specialization}
              onChange={(e) => updateFormData('education', 'mpth_specialization', e.target.value)}
              className="input-field"
            />
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">Aggregate Percentage *</label>
            <input
              type="number"
              value={formData.education.aggregate_percentage}
              onChange={(e) => updateFormData('education', 'aggregate_percentage', e.target.value)}
              className="input-field"
              min="0"
              max="100"
              step="0.01"
            />
          </div>
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">Year of Graduation *</label>
            <input
              type="number"
              value={formData.education.year_of_graduation}
              onChange={(e) => updateFormData('education', 'year_of_graduation', e.target.value)}
              className="input-field"
              min="1990"
              max="2025"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">Year of Post Graduation</label>
            <input
              type="number"
              value={formData.education.year_of_post_graduation}
              onChange={(e) => updateFormData('education', 'year_of_post_graduation', e.target.value)}
              className="input-field"
              min="1990"
              max="2025"
            />
          </div>
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">Registration No. *</label>
            <input
              type="text"
              value={formData.education.registration_no}
              onChange={(e) => updateFormData('education', 'registration_no', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">Research / Thesis Title</label>
          <input
            type="text"
            value={formData.education.research_title}
            onChange={(e) => updateFormData('education', 'research_title', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">Any other courses attended</label>
          <textarea
            value={formData.education.other_courses}
            onChange={(e) => updateFormData('education', 'other_courses', e.target.value)}
            className="input-field h-20 resize-none"
          />
        </div>
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">Upload Degree Certificate (PDF, max 5MB)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange('degree', e)}
            className="input-field"
          />
          {files.degree && <p className="text-sm text-accent-green mt-1">✓ {files.degree.name}</p>}
        </div>
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">Upload Certifications (PDF, max 5MB each)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange('certification', e)}
            className="input-field"
          />
          {files.certifications.map((f, i) => (
            <p key={i} className="text-sm text-accent-green mt-1">✓ {f.name}</p>
          ))}
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        <button onClick={() => setStep(1)} className="flex-1 py-3 border-2 border-navy text-navy rounded-full font-semibold hover:bg-navy hover:text-white transition-all">
          Back
        </button>
        <button onClick={() => setStep(3)} className="flex-1 btn-3d">
          Continue
        </button>
      </div>
    </>
  );

  const renderBankDetails = () => (
    <>
      <h2 className="font-poppins font-bold text-2xl text-navy mb-6">Bank Details</h2>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">Bank Name *</label>
            <input
              type="text"
              value={formData.bank_details.bank_name}
              onChange={(e) => updateFormData('bank_details', 'bank_name', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">Branch Name *</label>
            <input
              type="text"
              value={formData.bank_details.branch_name}
              onChange={(e) => updateFormData('bank_details', 'branch_name', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">Branch Address *</label>
          <textarea
            value={formData.bank_details.branch_address}
            onChange={(e) => updateFormData('bank_details', 'branch_address', e.target.value)}
            className="input-field h-20 resize-none"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">Account Number *</label>
            <input
              type="text"
              value={formData.bank_details.account_number}
              onChange={(e) => updateFormData('bank_details', 'account_number', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">IFSC Code *</label>
            <input
              type="text"
              value={formData.bank_details.ifsc_code}
              onChange={(e) => updateFormData('bank_details', 'ifsc_code', e.target.value.toUpperCase())}
              className="input-field"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">PAN Card Number *</label>
            <input
              type="text"
              value={formData.bank_details.pan_card_number}
              onChange={(e) => updateFormData('bank_details', 'pan_card_number', e.target.value.toUpperCase().slice(0, 10))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block font-opensans font-medium text-gray-600 mb-2">Aadhar Number *</label>
            <input
              type="text"
              value={formData.bank_details.aadhar_number}
              onChange={(e) => updateFormData('bank_details', 'aadhar_number', e.target.value.replace(/\D/g, '').slice(0, 12))}
              className="input-field"
            />
          </div>
        </div>
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">UPI ID</label>
          <input
            type="text"
            value={formData.bank_details.upi_id}
            onChange={(e) => updateFormData('bank_details', 'upi_id', e.target.value)}
            className="input-field"
            placeholder="yourname@upi"
          />
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        <button onClick={() => setStep(2)} className="flex-1 py-3 border-2 border-navy text-navy rounded-full font-semibold hover:bg-navy hover:text-white transition-all">
          Back
        </button>
        <button onClick={() => setStep(4)} className="flex-1 btn-3d">
          Continue
        </button>
      </div>
    </>
  );

  const renderJoiningDetails = () => (
    <>
      <h2 className="font-poppins font-bold text-2xl text-navy mb-6">Joining Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">Years of Experience *</label>
          <input
            type="number"
            value={formData.joining_details.years_of_experience}
            onChange={(e) => updateFormData('joining_details', 'years_of_experience', e.target.value)}
            className="input-field"
            min="0"
          />
        </div>
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">Do you have any electrotherapy equipment?</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => updateFormData('joining_details', 'has_electrotherapy_equipment', true)}
              className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                formData.joining_details.has_electrotherapy_equipment
                  ? 'border-navy bg-navy text-white'
                  : 'border-gray-200 hover:border-navy'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => updateFormData('joining_details', 'has_electrotherapy_equipment', false)}
              className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                formData.joining_details.has_electrotherapy_equipment === false
                  ? 'border-navy bg-navy text-white'
                  : 'border-gray-200 hover:border-navy'
              }`}
            >
              No
            </button>
          </div>
        </div>
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">How far can you travel for a visit? *</label>
          <select
            value={formData.joining_details.travel_distance}
            onChange={(e) => updateFormData('joining_details', 'travel_distance', e.target.value)}
            className="input-field"
          >
            <option value="">Select distance</option>
            <option value="5km">Up to 5 km</option>
            <option value="10km">Up to 10 km</option>
            <option value="15km">Up to 15 km</option>
            <option value="20km+">20+ km</option>
          </select>
        </div>
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">
            If you are in Thane and you get a booking in Colaba within 2 hours, will you be able to do it? *
          </label>
          <select
            value={formData.joining_details.emergency_availability}
            onChange={(e) => updateFormData('joining_details', 'emergency_availability', e.target.value)}
            className="input-field"
          >
            <option value="">Select</option>
            <option value="yes">Yes, I can manage</option>
            <option value="maybe">Depends on the situation</option>
            <option value="no">No, that's too far</option>
          </select>
        </div>
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">
            What makes your practice different from others? *
          </label>
          <textarea
            value={formData.joining_details.unique_practice}
            onChange={(e) => updateFormData('joining_details', 'unique_practice', e.target.value)}
            className="input-field h-24 resize-none"
            maxLength={500}
          />
        </div>
        <div>
          <label className="block font-opensans font-medium text-gray-600 mb-2">
            What 1 quality makes you stand out from others? *
          </label>
          <textarea
            value={formData.joining_details.standout_quality}
            onChange={(e) => updateFormData('joining_details', 'standout_quality', e.target.value)}
            className="input-field h-24 resize-none"
            maxLength={500}
          />
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        <button onClick={() => setStep(3)} className="flex-1 py-3 border-2 border-navy text-navy rounded-full font-semibold hover:bg-navy hover:text-white transition-all">
          Back
        </button>
        <button onClick={handleSubmit} disabled={loading} className="flex-1 btn-3d disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="font-poppins font-bold text-3xl text-navy mb-4">Application Submitted!</h2>
      <p className="text-gray-600 mb-8">
        Thank you for applying to join VOCT. Our team will review your application and get back to you within 3-5 business days.
      </p>
      <p className="text-sm text-gray-500">
        Application ID: <strong>{practitionerId?.slice(0, 8)}</strong>
      </p>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-poppins font-bold text-4xl md:text-5xl text-navy mb-4" data-testid="joinus-title">
            Join Us as a Practitioner
          </h1>
          <p className="font-opensans text-lg text-gray-600">
            Be part of our mission to bring quality healthcare home
          </p>
        </motion.div>

        {/* Progress Bar */}
        {step < 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {['Personal', 'Education', 'Bank', 'Joining'].map((label, index) => (
                <div key={label} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step > index + 1
                        ? 'bg-accent-green text-white'
                        : step === index + 1
                        ? 'bg-navy text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > index + 1 ? '✓' : index + 1}
                  </div>
                  {index < 3 && (
                    <div
                      className={`w-12 md:w-24 h-1 mx-1 ${
                        step > index + 1 ? 'bg-accent-green' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-card p-8"
        >
          {step === 1 && renderPersonalDetails()}
          {step === 2 && renderEducationDetails()}
          {step === 3 && renderBankDetails()}
          {step === 4 && renderJoiningDetails()}
          {step === 5 && renderSuccess()}
        </motion.div>
      </div>
    </div>
  );
};

export default JoinUsPage;
