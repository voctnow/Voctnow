import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getUser, updateUser, getUserBookings } from '../api';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiCalendar, FiHelpCircle, FiLogOut } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
  });

  const [address, setAddress] = useState({
    label: '',
    address: '',
    city: '',
    pincode: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    setFormData({
      name: user.name || '',
      age: user.age || '',
      gender: user.gender || '',
      email: user.email || '',
    });
    
    // Fetch bookings
    getUserBookings(user.id)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error('Failed to load bookings:', err));
  }, [user, navigate]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await updateUser(user.id, formData);
      setUser(response.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update profile');
    }
    setLoading(false);
  };

  const handleAddAddress = async () => {
    if (!address.label || !address.address || !address.city || !address.pincode) {
      alert('Please fill all address fields');
      return;
    }
    setLoading(true);
    try {
      const newAddresses = [...(user.addresses || []), address];
      const response = await updateUser(user.id, { addresses: newAddresses });
      setUser(response.data);
      setAddress({ label: '', address: '', city: '', pincode: '' });
      alert('Address added successfully!');
    } catch (error) {
      console.error('Failed to add address:', error);
      alert('Failed to add address');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'account', label: 'Account Details', icon: FiUser },
    { id: 'bookings', label: 'Booking Details', icon: FiCalendar },
    { id: 'addresses', label: 'Address Details', icon: FiMapPin },
    { id: 'help', label: 'Help and Support', icon: FiHelpCircle },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-accent-green text-white';
      case 'pending_payment': return 'bg-yellow-500 text-white';
      case 'completed': return 'bg-accent-blue text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-poppins font-bold text-4xl text-navy mb-2" data-testid="profile-title">
            My Profile
          </h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-navy text-white'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-500 hover:bg-red-50 mt-2"
                data-testid="logout-btn"
              >
                <FiLogOut size={20} />
                Log out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              {/* Account Details */}
              {activeTab === 'account' && (
                <>
                  <h2 className="font-poppins font-bold text-xl text-navy mb-6">Account Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-opensans font-medium text-gray-600 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-opensans font-medium text-gray-600 mb-2">Age</label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block font-opensans font-medium text-gray-600 mb-2">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="input-field"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-opensans font-medium text-gray-600 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block font-opensans font-medium text-gray-600 mb-2">Phone</label>
                      <input
                        type="text"
                        value={user.phone}
                        className="input-field bg-gray-50"
                        disabled
                      />
                    </div>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="btn-3d disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </>
              )}

              {/* Bookings */}
              {activeTab === 'bookings' && (
                <>
                  <h2 className="font-poppins font-bold text-xl text-navy mb-6">My Bookings</h2>
                  {bookings.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FiCalendar size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No bookings yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-navy capitalize">
                                {booking.service_type.replace('_', ' ')}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Booking ID: {booking.id.slice(0, 8)}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Date:</strong> {booking.preferred_date}</p>
                            <p><strong>Time:</strong> {booking.preferred_time}</p>
                            <p><strong>Sessions:</strong> {booking.session_count}</p>
                            <p><strong>Amount:</strong> ₹{booking.amount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Addresses */}
              {activeTab === 'addresses' && (
                <>
                  <h2 className="font-poppins font-bold text-xl text-navy mb-6">Saved Addresses</h2>
                  {user.addresses?.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {user.addresses.map((addr, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-4">
                          <h4 className="font-semibold text-navy">{addr.label}</h4>
                          <p className="text-sm text-gray-600">
                            {addr.address}, {addr.city} - {addr.pincode}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <h3 className="font-semibold text-navy mb-4">Add New Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-opensans font-medium text-gray-600 mb-2">Label</label>
                      <input
                        type="text"
                        value={address.label}
                        onChange={(e) => setAddress({ ...address, label: e.target.value })}
                        className="input-field"
                        placeholder="Home, Office, etc."
                      />
                    </div>
                    <div>
                      <label className="block font-opensans font-medium text-gray-600 mb-2">Address</label>
                      <textarea
                        value={address.address}
                        onChange={(e) => setAddress({ ...address, address: e.target.value })}
                        className="input-field h-20 resize-none"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-opensans font-medium text-gray-600 mb-2">City</label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block font-opensans font-medium text-gray-600 mb-2">Pincode</label>
                        <input
                          type="text"
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                          className="input-field"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleAddAddress}
                      disabled={loading}
                      className="btn-3d disabled:opacity-50"
                    >
                      {loading ? 'Adding...' : 'Add Address'}
                    </button>
                  </div>
                </>
              )}

              {/* Help */}
              {activeTab === 'help' && (
                <>
                  <h2 className="font-poppins font-bold text-xl text-navy mb-6">Help and Support</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-navy mb-2">Contact Us</h3>
                      <p className="text-gray-600 mb-4">Have questions? We're here to help!</p>
                      <div className="space-y-2 text-sm">
                        <p><strong>Email:</strong> support@voct.in</p>
                        <p><strong>Phone:</strong> +91 98765 43210</p>
                        <p><strong>Hours:</strong> Mon-Sat, 9 AM - 6 PM</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-navy mb-4">FAQs</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-navy">How do I book a session?</h4>
                          <p className="text-sm text-gray-600">Choose a service, select sessions, fill details, and pay securely.</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-navy">Can I cancel my booking?</h4>
                          <p className="text-sm text-gray-600">Yes, cancellations are free up to 24 hours before the session.</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-navy">How are physiotherapists assigned?</h4>
                          <p className="text-sm text-gray-600">Our system matches you with the best available physio based on your needs and location.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
