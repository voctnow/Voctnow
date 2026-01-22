import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const InternalLogin = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('practitioner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/internal/login', {
        email,
        password,
        role
      });

      if (response.data.success) {
        // Store auth data
        localStorage.setItem('internal_token', response.data.token);
        localStorage.setItem('internal_user', JSON.stringify({
          id: response.data.user_id,
          name: response.data.name,
          type: response.data.user_type,
          role: response.data.role
        }));

        // Redirect based on role
        if (response.data.user_type === 'practitioner') {
          navigate('/internal/practitioner/dashboard');
        } else {
          navigate('/internal/admin/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1F44] to-[#1a365d] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0A1F44]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            VOCT
          </h1>
          <p className="text-gray-500 text-sm mt-1">Internal Portal</p>
        </div>

        {/* Role Tabs */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            onClick={() => setRole('practitioner')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              role === 'practitioner'
                ? 'bg-white text-[#0A1F44] shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Practitioner
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              role === 'admin'
                ? 'bg-white text-[#0A1F44] shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Company
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder={role === 'practitioner' ? 'your.email@example.com' : 'admin@voct.in'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder={role === 'practitioner' ? 'Last 4 digits of phone' : 'Password'}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0A1F44] text-white rounded-lg font-semibold hover:bg-[#0d2a5c] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 font-medium mb-2">Demo Credentials:</p>
          {role === 'admin' ? (
            <p className="text-xs text-gray-600">
              Email: admin@voct.in<br />
              Password: voct2026
            </p>
          ) : (
            <p className="text-xs text-gray-600">
              Use your registered email<br />
              Password: Last 4 digits of phone
            </p>
          )}
        </div>

        {/* Back to Main Site */}
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-gray-500 hover:text-[#0A1F44]">
            ← Back to main site
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default InternalLogin;
