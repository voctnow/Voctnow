import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPhone, FiUser, FiCalendar } from 'react-icons/fi';
import { sendOTP, verifyOTP, signup } from '../api';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [step, setStep] = useState('phone'); // phone, otp, signup
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  
  const [signupData, setSignupData] = useState({
    name: '',
    age: '',
    gender: '',
  });

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await sendOTP(phone.startsWith('+') ? phone : `+91${phone}`);
      // Extract demo OTP from response
      const match = response.data.message.match(/Use OTP (\d+)/);
      if (match) setDemoOtp(match[1]);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await verifyOTP(phone.startsWith('+') ? phone : `+91${phone}`, otp);
      if (response.data.user_id) {
        // Existing user - login
        login({ id: response.data.user_id, phone });
        onClose();
        resetForm();
      } else {
        // New user - show signup
        setStep('signup');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP');
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupData.name || !signupData.age || !signupData.gender) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await signup({
        ...signupData,
        age: parseInt(signupData.age),
        phone: phone.startsWith('+') ? phone : `+91${phone}`,
      });
      login(response.data);
      onClose();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setStep('phone');
    setPhone('');
    setOtp('');
    setSignupData({ name: '', age: '', gender: '' });
    setError('');
    setDemoOtp('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => { onClose(); resetForm(); }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => { onClose(); resetForm(); }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          data-testid="close-auth-modal"
        >
          <FiX size={24} />
        </button>

        <h2 className="font-poppins font-bold text-2xl text-navy mb-6">
          {step === 'phone' && 'Login / Sign Up'}
          {step === 'otp' && 'Enter OTP'}
          {step === 'signup' && 'Complete Registration'}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {step === 'phone' && (
          <form onSubmit={handleSendOTP}>
            <div className="mb-4">
              <label className="block font-opensans font-medium text-gray-600 mb-2">
                Phone Number
              </label>
              <div className="flex">
                <span className="flex items-center px-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-gray-600">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter your phone number"
                  className="input-field rounded-l-none"
                  data-testid="phone-input"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-3d w-full disabled:opacity-50"
              data-testid="send-otp-btn"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP}>
            <p className="text-gray-600 mb-4">
              OTP sent to +91{phone}
            </p>
            {demoOtp && (
              <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg mb-4 text-sm">
                Demo Mode: Use OTP <strong>{demoOtp}</strong>
              </div>
            )}
            <div className="mb-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="input-field text-center text-2xl tracking-widest"
                maxLength={6}
                data-testid="otp-input"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-3d w-full disabled:opacity-50"
              data-testid="verify-otp-btn"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full mt-3 text-gray-600 hover:text-navy"
            >
              Change phone number
            </button>
          </form>
        )}

        {step === 'signup' && (
          <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <label className="block font-opensans font-medium text-gray-600 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="input-field"
                  data-testid="signup-name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-opensans font-medium text-gray-600 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={signupData.age}
                    onChange={(e) => setSignupData({ ...signupData, age: e.target.value })}
                    placeholder="Age"
                    className="input-field"
                    min="1"
                    max="120"
                    data-testid="signup-age"
                  />
                </div>
                <div>
                  <label className="block font-opensans font-medium text-gray-600 mb-2">
                    Gender *
                  </label>
                  <select
                    value={signupData.gender}
                    onChange={(e) => setSignupData({ ...signupData, gender: e.target.value })}
                    className="input-field"
                    data-testid="signup-gender"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-3d w-full mt-6 disabled:opacity-50"
              data-testid="signup-submit-btn"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AuthModal;
