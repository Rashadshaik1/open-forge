import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Printer,
  ArrowLeft,
  Copy,
  Check,
  Download,
  Award,
  Calendar,
  Loader2,
} from 'lucide-react';
import { getEvents, getCertificateDownloadUrl } from '../api';

export default function PosterPage() {
  const [copied, setCopied] = useState(false);
  const portalUrl = typeof window !== 'undefined' ? `${window.location.origin}/register` : 'https://openforge.gvpce.ac.in/register';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    portalUrl
  )}&margin=10&color=E53E24&bgcolor=FFFFFF`;

  // Certificate Generator States
  const [eventsList, setEventsList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [rollNumberInput, setRollNumberInput] = useState('');

  useEffect(() => {
    getEvents().then((res) => {
      const list = res.data?.data || [];
      setEventsList(list);
      if (list.length > 0) setSelectedEventId(list[0]._id);
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCertificate = (e) => {
    e.preventDefault();
    if (!selectedEventId || !rollNumberInput.trim()) {
      alert('Please select an event and provide your 12-digit roll number.');
      return;
    }
    const downloadUrl = getCertificateDownloadUrl(selectedEventId, rollNumberInput.trim());
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED]/50 dark:bg-[#0B0F17] py-8 px-4 sm:px-6 transition-colors duration-200">
      
      {/* 1. VERIFIED CERTIFICATE DOWNLOAD CARD (Hidden during print) */}
      <div className="no-print max-w-3xl mx-auto mb-8 p-6 rounded-3xl bg-white dark:bg-[#111827] border-2 border-primary/30 shadow-lg space-y-4 text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-primary flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#111827] dark:text-white">
              Download Event Participation Certificate
            </h2>
            <p className="text-xs text-[#4B5563] dark:text-gray-400">
              Attendance verified at the door? Download your official stamped GVPCE certificate.
            </p>
          </div>
        </div>

        <form onSubmit={handleDownloadCertificate} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-2">
          <div className="sm:col-span-5 space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-gray-200">
              Select Event
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-soft-peach dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-[#111827] dark:text-white focus:outline-none focus:border-primary"
            >
              {eventsList.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.title}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4 space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-gray-200">
              Roll Number
            </label>
            <input
              type="text"
              required
              value={rollNumberInput}
              onChange={(e) => setRollNumberInput(e.target.value)}
              placeholder="e.g. 324103311051"
              className="w-full px-3 py-2.5 text-xs font-mono font-bold rounded-xl border border-soft-peach dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-[#111827] dark:text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-bold bg-primary hover:bg-primary-hover text-white text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Get PDF</span>
            </button>
          </div>
        </form>
      </div>

      {/* Action Header */}
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
        <div className="space-y-1">
          <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#E53E24]">
            GAYATRI VIDYA PARISHAD COLLEGE OF ENGINEERING (A)
          </p>
          <p className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
            Campus Tech Society &bull; Annual Club Day 2026
          </p>
        </div>

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

        <div className="relative p-4 rounded-3xl bg-white border-2 border-dashed border-[#E53E24] shadow-lg flex flex-col items-center">
          <img
            src={qrCodeUrl}
            alt="OpenForge Registration QR"
            className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl"
          />
          <span className="mt-2 text-[10px] font-mono text-gray-500">
            Scan with any Camera App or QR Reader
          </span>
        </div>

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

        <div className="w-full pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-medium">
          <span>Department of Information Technology &bull; GVPCE Campus</span>
          <span className="font-mono text-[#E53E24] font-bold">
            openforge.gvpce.ac.in
          </span>
        </div>
      </div>
    </div>
  );
}