export default function HeroBlob({ className = '', variant = 'gradient' }) {
  return (
    <div className={`relative pointer-events-none select-none ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute -top-12 -left-12 w-72 h-72 md:w-96 md:h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-8 -right-8 w-64 h-64 md:w-80 md:h-80 bg-primary/20 rounded-full blur-3xl" />

      {/* Organic SVG Blob */}
      <svg
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl transition-transform duration-700 hover:scale-105"
      >
        <defs>
          <linearGradient id="blob-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E53E24" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#F97316" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFF7ED" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="blob-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#CB321A" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Secondary backing blob */}
        <path
          fill="url(#blob-grad-2)"
          d="M421.5,310.5Q411,371,353,400.5Q295,430,234.5,417Q174,404,118.5,364Q63,324,67,258.5Q71,193,115.5,142Q160,91,226.5,74Q293,57,357.5,91.5Q422,126,427,188Q432,250,421.5,310.5Z"
        />

        {/* Primary foreground blob */}
        <path
          fill="url(#blob-grad-1)"
          d="M399.5,304.5Q366,359,313.5,389Q261,419,203.5,398.5Q146,378,103.5,331.5Q61,285,73.5,223Q86,161,133.5,116.5Q181,72,246,69.5Q311,67,364,107.5Q417,148,425,199Q433,250,399.5,304.5Z"
        />
      </svg>
    </div>
  );
}
