import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import { sendEventUpdateEmail } from '../utils/sendEmail.js';

// @desc    Get all active/upcoming events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;

    const events = await Event.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ eventDate: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events: ' + error.message,
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email role');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event: ' + error.message,
    });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Board & Admin only)
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      venue,
      eventDate,
      registrationDeadline,
      capacity,
      bannerImage,
    } = req.body;

    if (!title || !description || !venue || !eventDate || !registrationDeadline || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required event details.',
      });
    }

    const event = await Event.create({
      title,
      description,
      category,
      venue,
      eventDate,
      registrationDeadline,
      capacity,
      bannerImage,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create event: ' + error.message,
    });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id or PATCH /api/events/:id
// @access  Private (Board & Admin only)
export const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Admins can update any event; Board members can only update events they created
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit events you created.',
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // If date, venue, or status was updated, broadcast to all registered attendees
    const { eventDate, venue, status } = req.body;
    if (eventDate || venue || status) {
      Registration.find({ event: event._id })
        .populate('user', 'name email')
        .then((registrations) => {
          const summary = `Event status: ${event.status.toUpperCase()} | Venue: ${event.venue} | Date: ${new Date(event.eventDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
          registrations.forEach((reg) => {
            if (reg.user?.email) {
              sendEventUpdateEmail({
                user: reg.user,
                event,
                changeSummary: summary,
              }).catch((e) => console.error(e.message));
            }
          });
        })
        .catch((e) => console.error('[Broadcast Error]:', e.message));
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update event: ' + error.message,
    });
  }
};

// @desc    Append media photos to an event's gallery array
// @route   POST /api/events/:id/gallery
// @access  Private (Board & Admin only)
export const addGalleryMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, caption, images } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Handle single photo or array of photos
    const newItems = [];
    if (Array.isArray(images) && images.length > 0) {
      images.forEach((img) => {
        if (typeof img === 'string') newItems.push({ url: img, caption: caption || '' });
        else if (img?.url) newItems.push({ url: img.url, caption: img.caption || caption || '' });
      });
    } else if (url) {
      newItems.push({ url, caption: caption || '' });
    }

    if (newItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one valid image URL or base64 string.',
      });
    }

    // Push into galleryImages array without touching existing items
    event.galleryImages.push(...newItems);

    // If event does not yet have a primary banner, set the first gallery image as banner
    if (!event.bannerImage && newItems.length > 0) {
      event.bannerImage = newItems[0].url;
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: `${newItems.length} photo(s) added to gallery.`,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload gallery media: ' + error.message,
    });
  }
};

// @desc    Remove a media photo from an event's gallery
// @route   DELETE /api/events/:id/gallery/:mediaId
// @access  Private (Board & Admin only)
export const removeGalleryMedia = async (req, res) => {
  try {
    const { id, mediaId } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event.galleryImages = event.galleryImages.filter(
      (img) => img._id.toString() !== mediaId && img.url !== mediaId
    );

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Media removed from gallery.',
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery media: ' + error.message,
    });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Admin only)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete event: ' + error.message,
    });
  }
};

// @desc    Manually toggle registration open/close
// @route   PATCH /api/events/:id/toggle-registration
// @access  Private (Board & Admin only)
export const toggleEventRegistration = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (typeof req.body.isOpen === 'boolean') {
      event.isRegistrationOpen = req.body.isOpen;
    } else {
      event.isRegistrationOpen = !event.isRegistrationOpen;
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: `Registrations are now ${event.isRegistrationOpen ? 'OPEN' : 'CLOSED'}.`,
      data: {
        eventId: event._id,
        isRegistrationOpen: event.isRegistrationOpen,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Manually set event status (upcoming, ongoing, completed, cancelled)
// @route   PATCH /api/events/:id/status
// @access  Private (Board & Admin only)
export const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event.status = status;

    if (status === 'completed' || status === 'cancelled') {
      event.isRegistrationOpen = false;
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: `Event status manually updated to '${status}'.`,
      data: event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};