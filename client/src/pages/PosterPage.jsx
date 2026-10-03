import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Printer,
  ArrowLeft,
  QrCode,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Share2,
} from 'lucide-react';

export default function PosterPage() {
  const [copied, setCopied] = useState(false);
  const portalUrl = typeof window !== 'undefined' ? `${window.location.origin}/register` : 'https://openforge.gvpce.ac.in/register';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    portalUrl
  )}&margin=10&color=E53E24&bgcolor=FFFFFF`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED]/50 dark:bg-[#0B0F17] py-8 px-4 sm:px-6 transition-colors duration-200">
      {/* Action Header (Hidden during Print) */}
      <div className="no-print max-w-3xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#111827] border border-soft-peach dark:border-gray-800 shadow-md">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to OpenForge</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-soft-peach dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111827] dark:text-white hover:border-[#E53E24] transition-all flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#E53E24]" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl font-bold bg-[#E53E24] hover:bg-[#CB321A] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Standee Poster</span>
          </button>
        </div>
      </div>

      {/* Printable Poster Standee Container */}
      <div className="print-container max-w-2xl mx-auto bg-white text-[#111827] rounded-[2.5rem] border-4 border-[#E53E24] p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center text-center space-y-6">
        {/* Top Decorative Corner Flares */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-[#E53E24]/20 via-[#F97316]/10 to-transparent rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-gradient-to-tr from-[#E53E24]/20 via-[#F97316]/10 to-transparent rounded-tr-full pointer-events-none" />

        {/* Institution Kicker */}
        <div className="space-y-1">
          <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#E53E24]">
            GAYATRI VIDYA PARISHAD COLLEGE OF ENGINEERING (A)
          </p>
          <p className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
            Campus Tech Society &bull; Annual Club Day 2025-2026
          </p>
        </div>

        {/* Brand Logo Container */}
        <div className="w-24 h-24 p-2 rounded-3xl bg-white border-2 border-soft-peach shadow-xl flex items-center justify-center">
          <img
            src="/openforgelogo.png"
            alt="OpenForge Official Logo"
            className="w-20 h-20 object-contain drop-shadow"
          />
        </div>

        {/* Main Title, Department & Slogan */}
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-[#111827] uppercase leading-none">
            OPEN<span className="text-[#E53E24]">FORGE</span>
          </h1>
          <p className="text-xs sm:text-sm font-bold tracking-widest text-[#E53E24] uppercase mt-1">
            Department of Information Technology &bull; GVPCE(A)
          </p>
          <p className="text-base sm:text-lg font-bold text-[#F97316]">
            Where Ideas Get Built.
          </p>
        </div>

        {/* Instruction Kicker */}
        <div className="px-5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#E53E24]/30 text-xs sm:text-sm font-extrabold text-[#E53E24] uppercase tracking-wide">
          Scan to Join OpenForge &bull; Claim Your Digital Pass
        </div>

        {/* High-Res QR Code Card */}
        <div className="relative p-4 rounded-3xl bg-white border-2 border-dashed border-[#E53E24] shadow-lg flex flex-col items-center">
          {/* Corner target marks */}
          <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-[#E53E24]" />
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-[#E53E24]" />
          <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-[#E53E24]" />
          <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-[#E53E24]" />

          <img
            src={qrCodeUrl}
            alt="OpenForge Registration QR"
            className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl"
          />

          <span className="mt-2 text-[10px] font-mono text-gray-500">
            Scan with any Camera App or QR Reader
          </span>
        </div>

        {/* 3 Step Quick Guide */}
        <div className="grid grid-cols-3 gap-3 w-full pt-2 text-left">
          <div className="p-3 rounded-2xl bg-[#FFF7ED]/70 border border-orange-200 flex flex-col justify-between">
            <span className="text-xs font-black text-[#E53E24]">STEP 1</span>
            <p className="text-[11px] font-semibold text-gray-800 mt-1">
              Point camera & open the link
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFF7ED]/70 border border-orange-200 flex flex-col justify-between">
            <span className="text-xs font-black text-[#E53E24]">STEP 2</span>
            <p className="text-[11px] font-semibold text-gray-800 mt-1">
              Enter college email or roll number
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFF7ED]/70 border border-orange-200 flex flex-col justify-between">
            <span className="text-xs font-black text-[#E53E24]">STEP 3</span>
            <p className="text-[11px] font-semibold text-gray-800 mt-1">
              Flash digital pass at booth for goodies
            </p>
          </div>
        </div>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2 text-[11px] font-bold text-gray-700">
          <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
            ⚡ Instant Roll Verification
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
            🎟️ Digital QR Pass
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
            🕵️ Sherlock Mysteries
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
            💻 Web Bootcamps
          </span>
        </div>

        {/* Poster Bottom Strip */}
        <div className="w-full pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-medium">
          <span>Student Activity Council &bull; GVPCE Campus</span>
          <span className="font-mono text-[#E53E24] font-bold">
            openforge.gvpce.ac.in
          </span>
        </div>
      </div>
    </div>
  );
}
