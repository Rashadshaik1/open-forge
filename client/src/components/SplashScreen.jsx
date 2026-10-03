import { useState, useEffect } from 'react';

export default function SplashScreen({ onFinish, duration = 1800 }) {
  const [fadingOut, setFadingOut] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Begin fade-out 350ms before duration expires
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, Math.max(duration - 350, 800));

    // Finish completely and unmount
    const finishTimer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0F17] text-white transition-opacity duration-400 ease-out select-none ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient radial glowing circles */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#E53E24]/30 via-[#F97316]/25 to-transparent blur-3xl animate-pulse" />
      <div className="absolute w-48 h-48 rounded-full bg-[#E53E24]/20 blur-2xl animate-ping" />

      {/* Centered Pulsing OpenForge Logo with Glowing Ring */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        <div className="relative">
          {/* Outer glowing radial ring */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#E53E24] to-[#F97316] opacity-75 blur-md animate-pulse" />

          {/* Logo Container */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/20 p-2 flex items-center justify-center shadow-2xl">
            <img
              src="/openforgelogo.png"
              alt="OpenForge Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain animate-pulse drop-shadow-lg"
            />
          </div>
        </div>

        {/* Text animation: OPENFORGE + Slogan */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-widest uppercase bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            OPEN<span className="text-[#E53E24]">FORGE</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium tracking-[0.22em] uppercase text-[#F97316]">
            Where Ideas Get Built
          </p>
        </div>

        {/* Minimal loading indicator line */}
        <div className="w-36 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-[#E53E24] to-[#F97316] rounded-full animate-[progress_1.8s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
