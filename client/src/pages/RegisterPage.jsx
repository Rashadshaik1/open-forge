import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle, Shield, QrCode, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { parseGvpceRoll } from '../utils/parseRollNumber';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  // Parse student roll and department in real time from email
  const parsedRollInfo = parseGvpceRoll(email.trim().split('@')[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const derivedRoll = parsedRollInfo.isValid
        ? parsedRollInfo.rollNumber
        : cleanEmail.split('@')[0].toUpperCase();

      const payload = {
        name: name.trim(),
        email: cleanEmail,
        password,
        role,
        rollNumber: derivedRoll,
        department: parsedRollInfo.isValid ? parsedRollInfo.branch : 'Information Technology',
        year: parsedRollInfo.isValid ? parsedRollInfo.currentYear : '2nd Year',
      };

      const res = await register(payload);

      if (res?.success) {
        if (role === 'volunteer') {
          navigate('/volunteer-scanner');
        } else if (role === 'board' || role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrorMessage(res?.error || 'Registration failed. Please check your credentials.');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Unable to connect to the authentication server.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#111827] p-8 sm:p-10 rounded-3xl border border-soft-peach dark:border-gray-800 shadow-xl">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3 group mb-1">
            <img
              src="/openforgelogo.png"
              alt="OpenForge Logo"
              className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
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
            Create an OpenForge Account
          </h2>
          <p className="text-sm text-[#4B5563] dark:text-gray-400">
            Join the community to register for events or coordinate check-ins
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#4B5563] dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-soft-peach/30 dark:bg-gray-800/80 text-sm text-[#111827] dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
              College Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#4B5563] dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="324103311051@gvpce.ac.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-soft-peach/30 dark:bg-gray-800/80 text-sm text-[#111827] dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            {parsedRollInfo.isValid && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                ✓ Identified: {parsedRollInfo.branch} • {parsedRollInfo.currentYear}
              </p>
            )}
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#4B5563] dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-soft-peach/30 dark:bg-gray-800/80 text-sm text-[#111827] dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          {/* Role Choice */}
          <div className="space-y-1.5 pt-1 text-left">
            <label className="text-xs font-semibold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
              I am participating as:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'student', label: 'Student', icon: User },
                { id: 'volunteer', label: 'Volunteer', icon: QrCode },
                { id: 'board', label: 'Board / Admin', icon: Shield },
              ].map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      role === r.id
                        ? 'border-primary bg-soft-peach dark:bg-gray-800 text-primary font-bold shadow-xs'
                        : 'border-soft-peach dark:border-gray-700 bg-white dark:bg-gray-900 text-[#4B5563] dark:text-gray-400 hover:border-accent/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-[#4B5563] dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-hover underline underline-offset-2">
            Log in instead
          </Link>
        </div>
      </div>
    </div>
  );
}