import { Link } from 'react-router-dom';

export default function Footer() {
  const footerLinks = [
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Poster', path: '/poster' },
    { name: 'Community', path: '/community' },
    { name: 'Team', path: '/team' },
    { name: 'About', path: '/about' },
  ];

  return (
    <footer className="bg-white dark:bg-[#0B0F17] border-t border-soft-peach dark:border-gray-800 mt-auto py-8 sm:py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-soft-peach dark:border-gray-800">
          
          {/* Brand Info & Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <img
                src="/openforgelogo.png"
                alt="OpenForge Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col text-left">
                <span className="font-black text-sm sm:text-base tracking-wider text-[#111827] dark:text-white uppercase leading-none">
                  OPEN<span className="text-[#E53E24]">FORGE</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-[#E53E24] tracking-wide mt-1 leading-none">
                  Dept. of IT &bull; GVPCE(A)
                </span>
              </div>
            </Link>
            <span className="hidden sm:inline text-gray-300 dark:text-gray-700 text-xs">•</span>
            <p className="text-[11px] sm:text-xs text-[#4B5563] dark:text-gray-400">
              &copy; {new Date().getFullYear()} OpenForge. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-[#4B5563] dark:text-gray-300">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-[#E53E24] dark:hover:text-[#E53E24] transition-colors py-1"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Social Links & Motto */}
          <div className="flex flex-col items-center lg:items-end gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 text-[#4B5563] dark:text-gray-400">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/openforge_gvpihlr?stkn=MXcwcjZxeTN5ejFsMw=="
                aria-label="Instagram"
                className="hover:text-[#E53E24] dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-soft-peach dark:hover:bg-gray-800"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/openforge/"
                aria-label="LinkedIn"
                className="hover:text-[#E53E24] dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-soft-peach dark:hover:bg-gray-800"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>

            {/* Slogan */}
            <span className="font-serif italic text-[11px] sm:text-xs tracking-wider text-[#E53E24] font-medium">
              Code. Create. Collaborate.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
} 