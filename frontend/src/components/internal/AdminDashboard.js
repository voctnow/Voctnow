import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../../api';

// Admin Sidebar
const AdminSidebar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/internal/admin/dashboard', label: 'Overview', icon: 'ri-dashboard-line' },
    { path: '/internal/admin/bookings', label: 'Bookings', icon: 'ri-calendar-line' },
    { path: '/internal/admin/practitioners', label: 'Practitioners', icon: 'ri-user-star-line' },
    { path: '/internal/admin/users', label: 'Customers', icon: 'ri-group-line' },
    { path: '/internal/admin/analytics', label: 'Analytics', icon: 'ri-line-chart-line' },
    { path: '/internal/admin/settings', label: 'Settings', icon: 'ri-settings-3-line' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('internal_token');
    localStorage.removeItem('internal_user');
    navigate('/internal/login');
  };

  return (
    <div className="w-64 bg-[#0A1F44] min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white">VOCT</h1>
        <p className="text-blue-300 text-xs mt-1">Admin Portal</p>
      </div>

      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{user?.name || 'Admin'}</p>
            <p className="text-blue-300 text-xs capitalize">{user?.role || 'Founder'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-amber-500 text-white'
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

// Overview Dashboard
const OverviewDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/internal/admin/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const overview = data?.overview || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Executive Overview</h1>
        <p className="text-gray-500">Real-time business metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">₹{(overview.total_revenue || 0).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <i className="ri-money-rupee-circle-line text-2xl text-green-600"></i>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">Platform: ₹{(overview.platform_commission || 0).toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{overview.total_bookings || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <i className="ri-calendar-check-line text-2xl text-blue-600"></i>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Completed: {overview.completed_bookings || 0}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Practitioners</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{overview.verified_practitioners || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <i className="ri-user-star-line text-2xl text-purple-600"></i>
            </div>
          </div>
          <p className="text-xs text-amber-600 mt-2">Pending: {overview.pending_practitioners || 0}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Clients</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{overview.total_clients || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <i className="ri-group-line text-2xl text-amber-600"></i>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Cancel Rate: {overview.cancellation_rate || 0}%</p>
        </motion.div>
      </div>

      {/* Growth Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">This Month</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Bookings</span>
              <span className="font-bold text-gray-800">{data?.growth_indicators?.bookings_this_month || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">New Users</span>
              <span className="font-bold text-gray-800">{data?.growth_indicators?.new_users_this_month || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link to="/internal/admin/practitioners" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <i className="ri-user-add-line text-purple-600"></i>
              <span className="text-sm text-gray-700">Review Pending Practitioners</span>
            </Link>
            <Link to="/internal/admin/bookings" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <i className="ri-calendar-line text-blue-600"></i>
              <span className="text-sm text-gray-700">View All Bookings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(data?.recent_bookings || []).slice(0, 5).map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{booking.customer_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.service_type}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">₹{(booking.amount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Bookings Management
const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await API.get('/internal/admin/bookings?limit=100');
        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Bookings Management</h1>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Sessions</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{booking.id?.slice(0, 8)}...</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-800">{booking.customer_name}</p>
                    <p className="text-xs text-gray-500">{booking.customer_phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.service_type}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{booking.session_count}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">₹{(booking.amount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.preferred_date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Practitioners Management
const PractitionersManagement = () => {
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPractitioners = async () => {
      try {
        const response = await API.get('/internal/admin/practitioners');
        setPractitioners(response.data.practitioners || []);
      } catch (error) {
        console.error('Failed to fetch practitioners:', error);
      }
      setLoading(false);
    };
    fetchPractitioners();
  }, []);

  const handleVerify = async (practitionerId, approve) => {
    try {
      await API.put(`/internal/admin/practitioner/${practitionerId}/verify?approve=${approve}`);
      // Refresh list
      const response = await API.get('/internal/admin/practitioners');
      setPractitioners(response.data.practitioners || []);
    } catch (error) {
      console.error('Failed to verify practitioner:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Practitioners Management</h1>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : practitioners.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {practitioners.map((prac) => (
                <tr key={prac.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-800">{prac.personal_details?.full_name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{prac.personal_details?.email}</p>
                    <p className="text-xs text-gray-500">{prac.personal_details?.contact_number}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{prac.education?.mpth_specialization || 'General'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{prac.experience?.years_of_experience || 0} years</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      prac.is_verified ? 'bg-green-100 text-green-700' :
                      prac.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {prac.is_verified ? 'Verified' : prac.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {!prac.is_verified && prac.status !== 'rejected' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerify(prac.id, true)}
                          className="text-sm text-green-600 hover:text-green-800"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerify(prac.id, false)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <i className="ri-user-star-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No practitioners found</p>
        </div>
      )}
    </div>
  );
};

// Users/Customers Management
const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get('/internal/admin/users');
        setUsers(response.data.users || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : users.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <i className="ri-group-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No customers found</p>
        </div>
      )}
    </div>
  );
};

// Analytics Page
const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await API.get('/internal/admin/analytics');
        setAnalytics(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <>
          {/* By Service */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Revenue by Service</h3>
            <div className="space-y-3">
              {(analytics?.by_service || []).map((item) => (
                <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{item._id || 'Unknown'}</span>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">₹{(item.revenue || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{item.count} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By Session Count */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Popular Plans</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {(analytics?.by_session_count || []).map((item) => (
                <div key={item._id} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-800">{item.count}</p>
                  <p className="text-sm text-gray-500">{item._id} sessions</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Settings Page
const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <p className="text-gray-500">System settings coming soon...</p>
      </div>
    </div>
  );
};

// Main Admin Dashboard
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('internal_user');
    if (!storedUser) {
      navigate('/internal/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    if (userData.type !== 'admin') {
      navigate('/internal/login');
      return;
    }
    setUser(userData);
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar user={user} />
      <div className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route path="dashboard" element={<OverviewDashboard />} />
          <Route path="bookings" element={<BookingsManagement />} />
          <Route path="practitioners" element={<PractitionersManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
