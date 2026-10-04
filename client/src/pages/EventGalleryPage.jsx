import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Loader2,
  FolderOpen,
  Layers,
  Trash2,
  Download,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getEventById, removeGalleryMedia } from '../api';

export default function EventGalleryPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdminOrBoard = user?.role === 'admin' || user?.role === 'board';

  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEventData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getEventById(eventId);
      const eventData = res.data?.data || res.data;
      setEvent(eventData);

      const photoList = [];

      // Extract all galleryImages
      if (Array.isArray(eventData.galleryImages) && eventData.galleryImages.length > 0) {
        eventData.galleryImages.forEach((img, idx) => {
          photoList.push({
            _id: img._id || `img-${idx}`,
            url: typeof img === 'string' ? img : img.url,
            caption: (typeof img === 'object' && img.caption) || eventData.title,
          });
        });
      } else if (eventData.bannerImage) {
        photoList.push({
          _id: 'banner',
          url: eventData.bannerImage,
          caption: eventData.title,
        });
      }

      setPhotos(photoList);
    } catch (err) {
      console.error('Failed to load event gallery:', err);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) fetchEventData();
  }, [eventId, fetchEventData]);

  // Robust download handler for base64 & external URLs
  const handleDownload = async (e, photoUrl, filename = 'event_photo.jpg') => {
    e.stopPropagation();
    try {
      if (photoUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = photoUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // Remote URL: fetch blob to trigger immediate file download
      const response = await fetch(photoUrl, { mode: 'cors' });
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      // Fallback: direct window download trigger
      const link = document.createElement('a');
      link.href = photoUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle Photo Deletion
  const handleDeletePhoto = async (e, photo) => {
    e.stopPropagation();
    if (!isAdminOrBoard) return;

    const confirmDelete = window.confirm(
      'Are you sure you want to permanently delete this photo from the event album?'
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await removeGalleryMedia(eventId, photo._id);

      // Remove photo from local state
      setPhotos((prev) => prev.filter((p) => p._id !== photo._id));

      if (lightboxIndex !== null) {
        setLightboxIndex(null);
      }
    } catch (err) {
      console.error('Failed to delete photo:', err);
      alert(err.response?.data?.message || 'Failed to remove media. Check permissions.');
    } finally {
      setIsDeleting(false);
    }
  };

  const showNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev + 1) % photos.length);
  }, [lightboxIndex, photos.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [lightboxIndex, photos.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, showNext, showPrev]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF7ED]/30 dark:bg-[#0B0F17]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E53E24] mb-3" />
        <p className="text-xs font-bold uppercase text-gray-500">Loading Album...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED]/30 dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] pb-24 transition-colors duration-200">
      {/* Top Header */}
      <section className="py-8 border-b border-soft-peach dark:border-gray-800 bg-white dark:bg-[#111827]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <button
            onClick={() => navigate('/gallery')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Albums</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#E53E24]/10 text-[#E53E24]">
                {event?.category || 'Event'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-2 text-[#111827] dark:text-white">
                {event?.title}
              </h1>
              <div className="flex items-center gap-4 text-xs text-[#4B5563] dark:text-gray-400 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#E53E24]" />
                  {event?.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'TBA'}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E53E24]" />
                  {event?.venue}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <Layers className="w-4 h-4 text-[#E53E24]" />
              <span>{photos.length} {photos.length === 1 ? 'Photograph' : 'Photographs'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Photos Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {photos.map((item, index) => (
              <div
                key={item._id}
                onClick={() => setLightboxIndex(index)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-soft-peach dark:border-gray-800 bg-gray-100 dark:bg-gray-800 cursor-pointer shadow-xs hover:shadow-xl transition-all"
              >
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Top Action Buttons (Download + Admin Delete) */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    type="button"
                    onClick={(e) =>
                      handleDownload(
                        e,
                        item.url,
                        `${(event?.title || 'photo').replace(/\s+/g, '_')}_${index + 1}.jpg`
                      )
                    }
                    className="p-2 bg-black/60 hover:bg-black/90 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                    title="Download photograph"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  {isAdminOrBoard && (
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={(e) => handleDeletePhoto(e, item)}
                      className="p-2 bg-red-600/90 hover:bg-red-600 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                      title="Delete photograph"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* View Overlay Center */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3 py-1.5 bg-white text-xs font-bold text-gray-900 rounded-full flex items-center gap-1 shadow-md">
                    <Maximize2 className="w-3.5 h-3.5 text-[#E53E24]" />
                    <span>View</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 space-y-2">
            <FolderOpen className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="font-bold">No photos uploaded for this event yet</h3>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white z-20">
            <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded-full">
              Photo {lightboxIndex + 1} of {photos.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) =>
                  handleDownload(
                    e,
                    photos[lightboxIndex].url,
                    `${(event?.title || 'photo').replace(/\s+/g, '_')}_${lightboxIndex + 1}.jpg`
                  )
                }
                className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                title="Download Photo"
              >
                <Download className="w-4 h-4" />
              </button>

              {isAdminOrBoard && (
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={(e) => handleDeletePhoto(e, photos[lightboxIndex])}
                  className="p-2 rounded-full bg-red-600/80 hover:bg-red-600 text-white transition-colors cursor-pointer"
                  title="Delete Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                title="Close Lightbox (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white cursor-pointer z-20"
            title="Previous (Arrow Left)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white cursor-pointer z-20"
            title="Next (Arrow Right)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col items-center"
          >
            <img
              src={photos[lightboxIndex].url}
              alt="Expanded"
              className="max-h-[75vh] w-auto object-contain rounded-xl select-none"
            />
            {photos[lightboxIndex].caption && (
              <p className="text-xs text-gray-300 mt-3 text-center">
                {photos[lightboxIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}