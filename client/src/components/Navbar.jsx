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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Community', path: '/community' },
    { name: 'Team', path: '/team' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-md border-b border-soft-peach dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo & Subtitle */}
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

          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
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

          {/* Right Action Items */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Switcher */}
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

            {/* Quick Search */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] dark:hover:text-[#E53E24] rounded-lg hover:bg-soft-peach dark:hover:bg-gray-800 transition-colors cursor-pointer"
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
                    className="text-xs text-[#4B5563] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Auth Gate Button */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2.5">
                <Link
                  to={
                    user?.role === 'admin' || user?.role === 'board'
                      ? '/admin'
                      : user?.role === 'volunteer'
                      ? '/scanner'
                      : '/dashboard'
                  }
                  className="px-3.5 py-2 text-sm font-semibold rounded-lg text-[#E53E24] bg-[#FFF7ED] dark:bg-gray-800 border border-[#E53E24]/20 hover:bg-[#FFF7ED]/80 transition-colors"
                >
                  {user?.role === 'admin'
                    ? 'Admin Panel'
                    : user?.role === 'board'
                    ? 'Board Console'
                    : user?.role === 'volunteer'
                    ? 'Scanner Gate'
                    : 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] rounded-lg hover:bg-soft-peach dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
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
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Controls */}
          <div className="flex items-center md:hidden gap-1">
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
              className="p-2 text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] rounded-lg cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] hover:bg-soft-peach dark:hover:bg-gray-800 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
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

          <div className="pt-3 border-t border-soft-peach dark:border-gray-800 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={
                    user?.role === 'admin' || user?.role === 'board'
                      ? '/admin'
                      : user?.role === 'volunteer'
                      ? '/scanner'
                      : '/dashboard'
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-lg bg-soft-peach dark:bg-gray-800 text-[#E53E24] font-semibold text-sm"
                >
                  {user?.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-center text-sm font-semibold text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] cursor-pointer"
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