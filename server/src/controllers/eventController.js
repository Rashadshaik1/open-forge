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
// @route   PUT /api/events/:id
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