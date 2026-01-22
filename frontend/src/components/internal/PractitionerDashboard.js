import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../../api';

// Sidebar Navigation
const Sidebar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/internal/practitioner/dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
    { path: '/internal/practitioner/bookings', label: 'Bookings', icon: 'ri-calendar-line' },
    { path: '/internal/practitioner/clients', label: 'Clients', icon: 'ri-user-heart-line' },
    { path: '/internal/practitioner/earnings', label: 'Earnings', icon: 'ri-money-dollar-circle-line' },
    { path: '/internal/practitioner/profile', label: 'My Profile', icon: 'ri-user-settings-line' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('internal_token');
    localStorage.removeItem('internal_user');
    navigate('/internal/login');
  };

  return (
    <div className="w-64 bg-[#0A1F44] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white">VOCT</h1>
        <p className="text-blue-300 text-xs mt-1">Practitioner Portal</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{user?.name || 'Practitioner'}</p>
            <p className="text-blue-300 text-xs">Physiotherapist</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-500 text-white'
                    : 'text-blue-200 hover:bg-white/10'
                }`}
              >
                <i className={`${item.icon} text-lg`}></i>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/20 w-full transition-colors"
        >
          <i className="ri-logout-box-line text-lg"></i>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

// Dashboard Home
const DashboardHome = ({ user }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await API.get(`/internal/practitioner/${user?.id}/dashboard`);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      }
      setLoading(false);
    };

    if (user?.id) {
      fetchDashboard();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {data?.practitioner?.name || 'Doctor'}!</h1>
        <p className="text-gray-500">Here's your overview for today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <i className="ri-calendar-check-line text-2xl text-blue-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{data?.stats?.total_sessions || 0}</p>
              <p className="text-gray-500 text-sm">Total Sessions</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <i className="ri-check-double-line text-2xl text-green-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{data?.stats?.completed_sessions || 0}</p>
              <p className="text-gray-500 text-sm">Completed</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <i className="ri-user-heart-line text-2xl text-purple-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{data?.stats?.active_clients || 0}</p>
              <p className="text-gray-500 text-sm">Active Clients</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <i className="ri-money-rupee-circle-line text-2xl text-amber-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">₹{(data?.stats?.total_earnings || 0).toLocaleString()}</p>
              <p className="text-gray-500 text-sm">Total Earnings</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Today's Schedule</h2>
        </div>
        <div className="p-6">
          {data?.todays_schedule?.length > 0 ? (
            <div className="space-y-4">
              {data.todays_schedule.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <i className="ri-user-line text-blue-600"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{booking.customer_name}</p>
                      <p className="text-sm text-gray-500">{booking.service_type} • {booking.preferred_time}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No sessions scheduled for today</p>
          )}
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Upcoming Bookings</h2>
        </div>
        <div className="p-6">
          {data?.upcoming_bookings?.length > 0 ? (
            <div className="space-y-3">
              {data.upcoming_bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800">{booking.customer_name}</p>
                    <p className="text-sm text-gray-500">{booking.preferred_date} at {booking.preferred_time}</p>
                  </div>
                  <span className="text-sm text-gray-600">{booking.service_type}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No upcoming bookings</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Bookings Page
const BookingsPage = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const params = filter !== 'all' ? `?status=${filter}` : '';
        const response = await API.get(`/internal/practitioner/${user?.id}/bookings${params}`);
        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
      setLoading(false);
    };

    if (user?.id) {
      fetchBookings();
    }
  }, [user?.id, filter]);

  const handleCompleteSession = async (bookingId) => {
    try {
      await API.post(`/internal/practitioner/${user?.id}/session/${bookingId}/complete`);
      // Refresh bookings
      const response = await API.get(`/internal/practitioner/${user?.id}/bookings`);
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Failed to complete session:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="all">All Bookings</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : bookings.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{booking.customer_name}</p>
                    <p className="text-sm text-gray-500">{booking.city}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{booking.service_type}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {booking.preferred_date}<br />
                    <span className="text-sm text-gray-400">{booking.preferred_time}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCompleteSession(booking.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Mark Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <i className="ri-calendar-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No bookings found</p>
        </div>
      )}
    </div>
  );
};

// Clients Page
const ClientsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Client Records</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <i className="ri-user-heart-line text-4xl text-gray-300 mb-4"></i>
        <p className="text-gray-500">Client records will appear here as you complete sessions</p>
      </div>
    </div>
  );
};

// Earnings Page
const EarningsPage = ({ user }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`/internal/practitioner/${user?.id}/dashboard`);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch earnings:', error);
      }
    };
    if (user?.id) fetchData();
  }, [user?.id]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Earnings & Payouts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-2">Total Earnings</p>
          <p className="text-3xl font-bold text-gray-800">₹{(data?.stats?.total_earnings || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-2">Pending Payout</p>
          <p className="text-3xl font-bold text-amber-600">₹{(data?.stats?.pending_payout || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-2">Sessions Completed</p>
          <p className="text-3xl font-bold text-green-600">{data?.stats?.completed_sessions || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Payout Information</h2>
        </div>
        <div className="p-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Payout Cycle:</strong> Weekly (Every Monday)<br />
              <strong>Platform Commission:</strong> 30%<br />
              <strong>Your Share:</strong> 70% of each session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Page
const ProfileSettingsPage = ({ user }) => {
  const [availability, setAvailability] = useState(true);

  const handleAvailabilityToggle = async () => {
    try {
      await API.put(`/internal/practitioner/${user?.id}/availability`, null, {
        params: { is_available: !availability }
      });
      setAvailability(!availability);
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Availability Settings</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Available for Bookings</p>
              <p className="text-sm text-gray-500">Toggle to pause receiving new bookings</p>
            </div>
            <button
              onClick={handleAvailabilityToggle}
              className={`w-14 h-8 rounded-full transition-colors ${
                availability ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                availability ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Profile Details</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500">Profile editing coming soon...</p>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const PractitionerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('internal_user');
    if (!storedUser) {
      navigate('/internal/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    if (userData.type !== 'practitioner') {
      navigate('/internal/login');
      return;
    }
    setUser(userData);
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 p-8">
        <Routes>
          <Route path="dashboard" element={<DashboardHome user={user} />} />
          <Route path="bookings" element={<BookingsPage user={user} />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="earnings" element={<EarningsPage user={user} />} />
          <Route path="profile" element={<ProfileSettingsPage user={user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default PractitionerDashboard;
