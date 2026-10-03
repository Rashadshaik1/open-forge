import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role'); // 'student' | 'volunteer' | 'board' | 'admin'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const isSpecialRole = ['volunteer', 'board', 'admin'].includes((roleParam || '').toLowerCase());

  const handleRoleRedirect = (role) => {
    const normalizedRole = (role || '').toLowerCase();
    if (normalizedRole === 'volunteer') {
      navigate('/volunteer-scanner');
    } else if (normalizedRole === 'board' || normalizedRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const res = await login(email.trim(), password);

      if (res?.success) {
        const returnedRole = res.user?.role || res.data?.user?.role || 'student';
        handleRoleRedirect(returnedRole);
      } else {
        setErrorMessage(res?.error || res?.message || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Authentication failed. Please verify credentials.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] dark:bg-[#0B0F17] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-[#111827] p-8 sm:p-10 rounded-2xl shadow-xl border border-soft-peach dark:border-gray-800 space-y-6">
        
        {roleParam && (
          <div className="flex items-center justify-between pb-2 border-b border-soft-peach dark:border-gray-800">
            <Link
              to="/portal"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] dark:hover:text-[#E53E24] transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Role Gateway</span>
            </Link>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E53E24] bg-[#FFF7ED] dark:bg-gray-800 px-2 py-0.5 rounded-full border border-[#E53E24]/20">
              {roleParam} portal
            </span>
          </div>
        )}

        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3 group mb-1">
            <img
              src="/openforgelogo.png"
              alt="OpenForge Logo"
              className="w-11 h-11 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col text-left">
              <span className="font-black text-xl tracking-tight text-[#111827] dark:text-white uppercase leading-none">
                OPEN<span className="text-[#E53E24]">FORGE</span>
              </span>
              <span className="text-[9px] font-bold tracking-widest text-[#E53E24] uppercase mt-1 leading-none">
                DEPT. OF INFORMATION TECHNOLOGY
              </span>
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-[#111827] dark:text-white tracking-tight">
            {isSpecialRole ? `Sign in as ${roleParam.charAt(0).toUpperCase() + roleParam.slice(1)}` : 'Sign in to your account'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-300">
            {isSpecialRole
              ? 'Authorized portal access for campus operations'
              : 'Enter your college credentials to continue'}
          </p>
        </div>

        {isSpecialRole && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/50 flex flex-col items-center gap-1.5 text-center animate-in fade-in duration-200">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#E53E24] text-white shadow-xs tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Creds Provided by Admin</span>
            </div>
            <p className="text-[11px] text-[#4B5563] dark:text-amber-200 font-medium">
              Enter the official email & passkey issued by the Super Admin.
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
              {isSpecialRole ? 'Authorized Email' : 'College Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#4B5563] dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  isSpecialRole
                    ? `${roleParam}@gvpce.ac.in`
                    : 'e.g. 324103311051@gvpce.ac.in'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800/80 text-sm text-[#111827] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#E53E24] focus:ring-1 focus:ring-[#E53E24] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#4B5563] dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800/80 text-sm text-[#111827] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#E53E24] focus:ring-1 focus:ring-[#E53E24] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors p-0.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-700 text-[#E53E24] focus:ring-[#E53E24] bg-white dark:bg-gray-800"
              />
              <span className="text-xs text-[#4B5563] dark:text-gray-300">Remember me</span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#E53E24] hover:bg-[#CB321A] shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In to {isSpecialRole ? roleParam.toUpperCase() : 'Account'}</span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-[#4B5563] dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
          {isSpecialRole ? (
            <p>
              Need standard student access?{' '}
              <Link
                to="/login?role=student"
                className="font-bold text-[#E53E24] hover:text-[#CB321A] underline underline-offset-2 transition-colors"
              >
                Student Sign In
              </Link>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-[#E53E24] hover:text-[#CB321A] underline underline-offset-2 transition-colors"
              >
                Sign up
              </Link>
            </p>
          )}

          <div>
            <Link
              to="/portal"
              className="text-[11px] text-gray-400 dark:text-gray-500 hover:text-[#E53E24] transition-colors"
            >
              ← Choose another door in Role Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}