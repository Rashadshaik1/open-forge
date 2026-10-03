import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, LogOut, Sun, Moon, Sparkles, Printer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/#events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Community', path: '/community' },
    { name: 'Team', path: '/team' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-md border-b border-soft-peach dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Left: OpenForge logo + bold text OPENFORGE with Department Subtitle */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/openforgelogo.png"
              alt="OpenForge Logo"
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col text-left">
              <span className="font-black text-xl tracking-tight text-[#111827] dark:text-white leading-none">
                OPEN<span className="text-[#E53E24]">FORGE</span>
              </span>
              <span className="text-[9px] font-bold tracking-widest text-[#E53E24] uppercase mt-1 leading-none">
                DEPT. OF INFORMATION TECHNOLOGY
              </span>
            </div>
          </Link>

          {/* Center Navigation Links with active bottom indicator bar */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isHashLink = link.path.includes('#');
              const isActive = isHashLink
                ? location.pathname === '/' && location.hash === link.path.replace('/', '')
                : location.pathname === link.path && !location.hash;

              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`relative py-5 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'text-[#E53E24]'
                      : 'text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] dark:hover:text-[#E53E24]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E53E24] rounded-full shadow-xs" />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Right Actions: Portal Shortcut, Theme Toggle, Search, Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Campus Role Portal Link */}
            <Link
              to="/portal"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#E53E24] bg-[#FFF7ED] dark:bg-[#E53E24]/10 hover:bg-[#E53E24]/10 dark:hover:bg-[#E53E24]/20 border border-[#E53E24]/20 transition-colors"
              title="Campus Role Portal"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Portal</span>
            </Link>

            {/* Light / Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Club Day Printable Poster Link */}
            <Link
              to="/poster"
              title="Print Club Day Standee Poster"
              className="p-2 text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] dark:hover:text-[#E53E24] rounded-lg hover:bg-soft-peach dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-5 h-5 text-[#E53E24]" />
              <span className="hidden xl:inline text-xs font-bold text-[#111827] dark:text-white">
                Club Day Poster
              </span>
            </Link>

            {/* Search Button & Popover */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] dark:hover:text-[#E53E24] rounded-lg hover:bg-soft-peach dark:hover:bg-gray-800 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {searchOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#111827] rounded-2xl p-2 shadow-xl border border-soft-peach dark:border-gray-700 flex items-center gap-2 animate-in fade-in duration-200 z-50">
                  <Search className="w-4 h-4 text-[#4B5563] dark:text-gray-400 ml-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events, workshops..."
                    autoFocus
                    className="w-full text-xs py-1.5 pr-2 focus:outline-none bg-transparent text-[#111827] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="text-xs text-[#4B5563] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white p-1"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/dashboard"
                  className="px-3.5 py-2 text-sm font-semibold rounded-lg text-[#E53E24] bg-[#FFF7ED] dark:bg-gray-800 border border-[#E53E24]/20 hover:bg-[#FFF7ED]/80 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] rounded-lg hover:bg-soft-peach dark:hover:bg-gray-800 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#E53E24] border border-[#E53E24] hover:bg-[#FFF7ED] dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#E53E24] hover:bg-[#CB321A] rounded-lg shadow-sm hover:shadow transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions Toggle */}
          <div className="flex items-center md:hidden gap-1">
            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] rounded-lg"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] hover:bg-soft-peach dark:hover:bg-gray-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search bar if open */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-soft-peach/60 dark:bg-gray-800/80 rounded-xl border border-soft-peach dark:border-gray-700">
            <Search className="w-4 h-4 text-[#4B5563] dark:text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, workshops..."
              className="w-full text-sm bg-transparent focus:outline-none text-[#111827] dark:text-white placeholder:text-gray-400"
            />
          </div>
        </div>
      )}

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-soft-peach dark:border-gray-800 bg-white dark:bg-[#111827] px-4 pt-2 pb-5 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-[#111827] dark:text-white hover:text-[#E53E24] hover:bg-soft-peach dark:hover:bg-gray-800"
            >
              {link.name}
            </Link>
          ))}

          <Link
            to="/poster"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold text-[#111827] dark:text-white hover:text-[#E53E24] hover:bg-soft-peach dark:hover:bg-gray-800"
          >
            <Printer className="w-4 h-4 text-[#E53E24]" />
            <span>Club Day Printable Poster</span>
          </Link>

          <Link
            to="/portal"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold text-[#E53E24] hover:bg-soft-peach dark:hover:bg-gray-800"
          >
            <Sparkles className="w-4 h-4" />
            <span>Role Selection Portal</span>
          </Link>

          <div className="pt-3 border-t border-soft-peach dark:border-gray-800 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-lg bg-soft-peach dark:bg-gray-800 text-[#E53E24] font-semibold text-sm"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-center text-sm font-semibold text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24]"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-lg border border-[#E53E24] text-sm font-semibold text-[#E53E24] hover:bg-[#FFF7ED] dark:hover:bg-gray-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-lg bg-[#E53E24] hover:bg-[#CB321A] text-sm font-semibold text-white shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
