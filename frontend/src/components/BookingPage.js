import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getService, getPricing, createBooking, mockPaymentSuccess } from '../api';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { format, addDays } from 'date-fns';

const sessionPlans = [
  { sessions: 1, price: 999, label: '1 Session', tag: null },
  { sessions: 3, price: 2899, label: '3 Sessions', tag: null },
  { sessions: 7, price: 6299, label: '7 Sessions', tag: 'Most Popular' },
  { sessions: 15, price: 12735, label: '15 Sessions', tag: 'Recommended for ongoing care' },
  { sessions: 30, price: 23970, label: '30 Sessions', tag: 'Best for long-term transformation' },
];

const BookingPage = () => {
  const { serviceId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const assessmentId = searchParams.get('assessment');

  const [service, setService] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [bookingData, setBookingData] = useState({
    session_count: 7,
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    address: '',
    city: '',
    pincode: '',
    preferred_date: '',
    preferred_time: '',
    physio_gender_preference: '',
  });

  const [createdBooking, setCreatedBooking] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceRes = await getService(serviceId);
        setService(serviceRes.data);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    fetchData();
  }, [serviceId]);

  useEffect(() => {
    if (user) {
      setBookingData((prev) => ({
        ...prev,
        customer_name: user.name || '',
        customer_phone: user.phone?.replace('+91', '') || '',
        customer_email: user.email || '',
      }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const getAmount = () => {
    const plan = sessionPlans.find(p => p.sessions === bookingData.session_count);
    return plan ? plan.price : bookingData.session_count * 999;
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 20) slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const generateDateOptions = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const date = addDays(new Date(), i);
      dates.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'EEE, MMM d'),
        day: format(date, 'd'),
        month: format(date, 'MMM'),
        weekday: format(date, 'EEE'),
      });
    }
    return dates;
  };

  const handleProceedToDetails = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setStep(2);
  };

  const handleProceedToSchedule = () => {
    if (!bookingData.customer_name || !bookingData.customer_phone || !bookingData.address || !bookingData.city || !bookingData.pincode) {
      alert('Please fill all required fields');
      return;
    }
    setStep(3);
  };

  const handleProceedToPayment = async () => {
    if (!bookingData.preferred_date || !bookingData.preferred_time) {
      alert('Please select date and time');
      return;
    }
    setLoading(true);
    try {
      const response = await createBooking({
        user_id: user.id,
        service_type: serviceId,
        session_count: bookingData.session_count,
        amount: getAmount(),
        customer_name: bookingData.customer_name,
        customer_phone: `+91${bookingData.customer_phone}`,
        customer_email: bookingData.customer_email,
        address: bookingData.address,
        city: bookingData.city,
        pincode: bookingData.pincode,
        preferred_date: bookingData.preferred_date,
        preferred_time: bookingData.preferred_time,
        physio_gender_preference: bookingData.physio_gender_preference || null,
        assessment_id: assessmentId,
      });
      setCreatedBooking(response.data);
      setStep(4);
    } catch (error) {
      console.error('Booking creation failed:', error);
      alert('Failed to create booking. Please try again.');
    }
    setLoading(false);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      await mockPaymentSuccess(createdBooking.id);
      setStep(5);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
    setLoading(false);
  };

  if (!service) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {['Sessions', 'Details', 'Schedule', 'Payment', 'Confirmed'].map((label, index) => (
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
                  {index < 4 && (
                    <div
                      className={`w-8 md:w-20 h-1 mx-1 ${
                        step > index + 1 ? 'bg-accent-green' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Service Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-navy text-white rounded-2xl p-6 md:p-8 mb-8"
          >
            <p className="text-blue-200 text-sm md:text-base mb-2">Start your recovery today</p>
            <h1 className="font-poppins font-bold text-2xl md:text-3xl">{service.name}</h1>
          </motion.div>

          {/* Step Content */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-card p-6 md:p-8"
          >
            {/* Step 1: Session Selection */}
            {step === 1 && (
              <>
                <h2 className="font-poppins font-bold text-xl md:text-2xl text-navy mb-6">
                  Choose Your Plan
                </h2>
                <div className="space-y-3 mb-8">
                  {sessionPlans.map((plan) => (
                    <div
                      key={plan.sessions}
                      onClick={() => handleInputChange('session_count', plan.sessions)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        bookingData.session_count === plan.sessions
                          ? 'border-navy bg-blue-50'
                          : 'border-gray-200 hover:border-navy'
                      }`}
                      data-testid={`session-${plan.sessions}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            bookingData.session_count === plan.sessions
                              ? 'border-navy bg-navy'
                              : 'border-gray-300'
                          }`}>
                            {bookingData.session_count === plan.sessions && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-poppins font-bold text-navy">{plan.label}</div>
                            {plan.tag && (
                              <div className="text-xs text-accent-green font-medium mt-1">{plan.tag}</div>
                            )}
                          </div>
                        </div>
                        <div className="font-bold text-navy text-lg">₹{plan.price.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-opensans text-gray-600">
                      {bookingData.session_count} sessions of {service.name}
                    </span>
                    <span className="font-poppins font-bold text-xl text-navy">
                      ₹{getAmount().toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleProceedToDetails}
                  className="btn-3d w-full"
                  data-testid="proceed-to-details"
                >
                  Proceed to Details
                </button>
              </>
            )}

            {/* Step 2: Customer Details */}
            {step === 2 && (
              <>
                <h2 className="font-poppins font-bold text-xl md:text-2xl text-navy mb-6">
                  Customer Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block font-opensans font-medium text-gray-600 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={bookingData.customer_name}
                      onChange={(e) => handleInputChange('customer_name', e.target.value)}
                      className="input-field"
                      data-testid="booking-name"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-opensans font-medium text-gray-600 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={bookingData.customer_phone}
                        onChange={(e) => handleInputChange('customer_phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="input-field"
                        data-testid="booking-phone"
                      />
                    </div>
                    <div>
                      <label className="block font-opensans font-medium text-gray-600 mb-2">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        value={bookingData.customer_email}
                        onChange={(e) => handleInputChange('customer_email', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-opensans font-medium text-gray-600 mb-2">
                      Address *
                    </label>
                    <textarea
                      value={bookingData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="input-field h-24 resize-none"
                      placeholder="Full address where the physiotherapist will visit"
                      data-testid="booking-address"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-opensans font-medium text-gray-600 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={bookingData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="input-field"
                        data-testid="booking-city"
                      />
                    </div>
                    <div>
                      <label className="block font-opensans font-medium text-gray-600 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={bookingData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="input-field"
                        data-testid="booking-pincode"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-opensans font-medium text-gray-600 mb-2">
                      Physiotherapist Gender Preference (for female patients only)
                    </label>
                    <select
                      value={bookingData.physio_gender_preference}
                      onChange={(e) => handleInputChange('physio_gender_preference', e.target.value)}
                      className="input-field"
                    >
                      <option value="">No preference</option>
                      <option value="female">Female physiotherapist</option>
                      <option value="male">Male physiotherapist</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border-2 border-navy text-navy rounded-full font-semibold hover:bg-navy hover:text-white transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleProceedToSchedule}
                    className="flex-1 btn-3d"
                    data-testid="proceed-to-schedule"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Schedule */}
            {step === 3 && (
              <>
                <h2 className="font-poppins font-bold text-xl md:text-2xl text-navy mb-6">
                  Select Date & Time
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block font-opensans font-medium text-gray-600 mb-3">
                      Preferred Date *
                    </label>
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                      {generateDateOptions().map((date) => (
                        <div
                          key={date.value}
                          onClick={() => handleInputChange('preferred_date', date.value)}
                          className={`p-2 md:p-3 rounded-xl border-2 cursor-pointer text-center transition-all ${
                            bookingData.preferred_date === date.value
                              ? 'border-navy bg-blue-50'
                              : 'border-gray-200 hover:border-navy'
                          }`}
                        >
                          <div className="text-xs text-gray-500">{date.weekday}</div>
                          <div className="font-bold text-lg text-navy">{date.day}</div>
                          <div className="text-xs text-gray-500">{date.month}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-opensans font-medium text-gray-600 mb-3">
                      Preferred Time *
                    </label>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {generateTimeSlots().map((time) => (
                        <div
                          key={time}
                          onClick={() => handleInputChange('preferred_time', time)}
                          className={`p-2 rounded-lg border-2 cursor-pointer text-center text-sm transition-all ${
                            bookingData.preferred_time === time
                              ? 'border-navy bg-blue-50'
                              : 'border-gray-200 hover:border-navy'
                          }`}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border-2 border-navy text-navy rounded-full font-semibold hover:bg-navy hover:text-white transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleProceedToPayment}
                    disabled={loading}
                    className="flex-1 btn-3d disabled:opacity-50"
                    data-testid="proceed-to-payment"
                  >
                    {loading ? 'Creating Booking...' : 'Proceed to Payment'}
                  </button>
                </div>
              </>
            )}

            {/* Step 4: Payment */}
            {step === 4 && createdBooking && (
              <>
                <h2 className="font-poppins font-bold text-xl md:text-2xl text-navy mb-6">
                  Complete Payment
                </h2>
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service</span>
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sessions</span>
                      <span className="font-medium">{bookingData.session_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">{bookingData.preferred_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time</span>
                      <span className="font-medium">{bookingData.preferred_time}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="font-semibold">Total Amount</span>
                      <span className="font-bold text-xl text-navy">₹{getAmount().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>DEMO MODE:</strong> Payment is mocked. In production, Razorpay payment gateway will be integrated.
                  </p>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="btn-3d w-full disabled:opacity-50"
                  data-testid="complete-payment"
                >
                  {loading ? 'Processing...' : `Pay ₹${getAmount().toLocaleString()}`}
                </button>
              </>
            )}

            {/* Step 5: Confirmation */}
            {step === 5 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-poppins font-bold text-2xl md:text-3xl text-navy mb-4">
                  Booking Confirmed!
                </h2>
                <p className="text-gray-600 mb-2">
                  Your booking ID: <strong>{createdBooking?.id?.slice(0, 8)}</strong>
                </p>
                <p className="text-gray-600 mb-8">
                  A confirmation has been sent to your phone. Our team will assign a physiotherapist shortly.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="btn-3d px-8"
                >
                  Back to Home
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default BookingPage;
