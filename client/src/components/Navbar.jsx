import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Community', path: '/community' },
    { name: 'Team', path: '/team' },
    { name: 'About', path: '/about' },
  ];

  const getPortalLink = () => {
    if (user?.role === 'admin' || user?.role === 'board') return '/admin';
    if (user?.role === 'volunteer') return '/scanner';
    return '/dashboard';
  };

  const getPortalLabel = () => {
    if (user?.role === 'admin') return 'Admin Panel';
    if (user?.role === 'board') return 'Board Console';
    if (user?.role === 'volunteer') return 'Scanner Gate';
    return 'Dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-md border-b border-soft-peach dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          
          {/* Brand Logo & Department Subtitle */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0 pr-2">
            <img
              src="/openforgelogo.png"
              alt="OpenForge Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:scale-105 transition-transform duration-300 shrink-0"
            />
            <div className="flex flex-col text-left truncate">
              <span className="font-black text-lg sm:text-xl tracking-tight text-[#111827] dark:text-white leading-none">
                OPEN<span className="text-[#E53E24]">FORGE</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold tracking-wider sm:tracking-widest text-[#E53E24] uppercase mt-1 leading-none truncate">
                DEPT. OF IT &bull; GVPCE
              </span>
            </div>
          </Link>

          {/* Desktop Links (lg+) */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-5 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'text-[#E53E24]'
                      : 'text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] dark:hover:text-[#E53E24]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E53E24] rounded-full shadow-xs" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop Right Action Controls (lg+) */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-700" />
              )}
            </button>

            {/* Expandable Search Input */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] dark:hover:text-[#E53E24] rounded-xl hover:bg-soft-peach dark:hover:bg-gray-800 transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {searchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#111827] rounded-2xl p-2 shadow-xl border border-soft-peach dark:border-gray-700 flex items-center gap-2 animate-in fade-in duration-200 z-50"
                >
                  <Search className="w-4 h-4 text-[#4B5563] dark:text-gray-400 ml-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events, workshops..."
                    autoFocus
                    className="w-full text-xs py-1.5 focus:outline-none bg-transparent text-[#111827] dark:text-white placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-xs text-[#4B5563] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </form>
              )}
            </div>

            {/* Desktop Auth Controls */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to={getPortalLink()}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl text-[#E53E24] bg-[#FFF7ED] dark:bg-gray-800 border border-[#E53E24]/20 hover:bg-[#FFF7ED]/80 transition-colors"
                >
                  {getPortalLabel()}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] rounded-xl hover:bg-soft-peach dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-[#E53E24] border border-[#E53E24] hover:bg-[#FFF7ED] dark:hover:bg-gray-800 rounded-xl transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-xs font-bold text-white bg-[#E53E24] hover:bg-[#CB321A] rounded-xl shadow-xs transition-all"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile & Tablet Header Controls (< lg) */}
          <div className="flex items-center lg:hidden gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-700" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] hover:bg-soft-peach dark:hover:bg-gray-800 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-soft-peach dark:border-gray-800 bg-white/98 dark:bg-[#0B0F17]/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          
          {/* Integrated Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, workshops..."
              className="w-full text-xs py-2 pl-9 pr-4 rounded-xl border border-soft-peach dark:border-gray-700 bg-[#FFF7ED]/40 dark:bg-gray-800/60 text-[#111827] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E53E24]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </form>

          {/* Navigation Items */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-[#E53E24] bg-[#FFF7ED] dark:bg-gray-800/80'
                      : 'text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] hover:bg-soft-peach/60 dark:hover:bg-gray-800/40'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* User Status / Account Actions */}
          <div className="pt-3 border-t border-soft-peach dark:border-gray-800 space-y-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to={getPortalLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24] font-bold text-xs border border-[#E53E24]/20"
                >
                  {getPortalLabel()}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 text-center text-xs font-semibold text-gray-500 hover:text-[#E53E24] cursor-pointer"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-xl border border-[#E53E24] text-xs font-bold text-[#E53E24] hover:bg-[#FFF7ED] dark:hover:bg-gray-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-xl bg-[#E53E24] hover:bg-[#CB321A] text-xs font-bold text-white shadow-xs"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}