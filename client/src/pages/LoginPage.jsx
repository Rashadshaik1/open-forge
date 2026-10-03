import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      const userRole = res?.user?.role;
      if (userRole === 'admin' || userRole === 'board') {
        navigate('/admin');
      } else if (userRole === 'volunteer') {
        navigate('/scanner');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    setResetLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email: resetEmail });
      setResetSuccess(res.data?.message || 'Password reset link sent! Check your inbox.');
      setTimeout(() => {
        setForgotModalOpen(false);
        setResetSuccess('');
        setResetEmail('');
      }, 4000);
    } catch (err) {
      setResetError(err.response?.data?.message || 'Unable to find an account with that email.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED]/30 dark:bg-[#0B0F17] flex items-center justify-center p-4 py-16 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-[#111827] rounded-3xl p-8 sm:p-10 border border-soft-peach dark:border-gray-800 shadow-xl space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <img src="/openforgelogo.png" alt="OpenForge Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
          </Link>
          <h1 className="text-2xl font-black text-[#111827] dark:text-white tracking-tight">
            Sign in to Open<span className="text-[#E53E24]">Forge</span>
          </h1>
          <p className="text-xs text-[#4B5563] dark:text-gray-400">
            Access your event tickets, verified credentials, and society console.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
              GVPCE / Institutional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rollnumber@gvpce.ac.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#E53E24]"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setForgotModalOpen(true);
                }}
                className="text-[11px] font-semibold text-[#E53E24] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#E53E24]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#E53E24] hover:bg-[#CB321A] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-[#4B5563] dark:text-gray-400">
          New to OpenForge?{' '}
          <Link to="/register" className="font-bold text-[#E53E24] hover:underline">
            Create an Account
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-soft-peach dark:border-gray-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-soft-peach dark:border-gray-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#E53E24]" />
                <h3 className="font-bold text-sm text-[#111827] dark:text-white">Reset Account Password</h3>
              </div>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="text-[#4B5563] hover:text-[#111827] dark:hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#4B5563] dark:text-gray-400 leading-relaxed">
              Enter your registered college email address and we'll send you instructions to recover your account.
            </p>

            {resetError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-xs font-medium text-red-600 dark:text-red-400">
                {resetError}
              </div>
            )}

            {resetSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-3.5">
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="324103311051@gvpce.ac.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#E53E24]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#4B5563] hover:text-[#111827] dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-4 py-2 rounded-xl bg-[#E53E24] hover:bg-[#CB321A] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {resetLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Send Reset Instructions</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}