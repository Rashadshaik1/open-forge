import crypto from 'crypto';
import QRCode from 'qrcode';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import { Parser } from 'json2csv';
import { sendTicketEmail } from '../utils/sendEmail.js';

// @desc    Register logged-in student for an event
// @route   POST /api/registrations/:eventId
// @access  Private (All authenticated users)
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        message: `Cannot register: Event is currently ${event.status}`,
      });
    }

    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed',
      });
    }

    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event registration is full',
      });
    }

    // Check existing registration
    const existingRegistration = await Registration.findOne({ event: eventId, user: userId });
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    // Generate unique ticket code
    const ticketCode = `OF-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Create QR Data URL containing ticket identifier
    const qrPayload = JSON.stringify({ ticketCode, eventId, userId });
    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload);

    const registration = await Registration.create({
      event: eventId,
      user: userId,
      ticketCode,
      qrCodeDataUrl,
    });

    // Increment registeredCount on Event
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

    // Send ticket confirmation email in background
    sendTicketEmail({
      user: req.user,
      event,
      ticketCode,
      qrCodeDataUrl,
    }).catch((err) => console.error('[Registration Email Background Error]:', err.message));

    res.status(201).json({
      success: true,
      message: 'Registration successful! Ticket issued.',
      data: registration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed: ' + error.message,
    });
  }
};

// @desc    Get user's tickets
// @route   GET /api/registrations/my-tickets
// @access  Private
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Registration.find({ user: req.user._id })
      .populate('event', 'title venue eventDate category status bannerImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets: ' + error.message,
    });
  }
};

// @desc    Verify QR attendance at venue door
// @route   POST /api/registrations/verify-ticket
// @access  Private (Volunteer, Board, Admin)
export const verifyTicket = async (req, res) => {
  try {
    const { ticketCode } = req.body;

    if (!ticketCode) {
      return res.status(400).json({
        success: false,
        message: 'Please scan or provide a valid ticket code',
      });
    }

    const registration = await Registration.findOne({ ticketCode })
      .populate('user', 'name rollNumber department year email')
      .populate('event', 'title venue eventDate');

    if (!registration) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Invalid Ticket: Not found in database',
      });
    }

    if (registration.attended) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Ticket already used at ${registration.attendedAt.toLocaleTimeString()}`,
        data: registration,
      });
    }

    // Mark attended
    registration.attended = true;
    registration.attendedAt = new Date();
    registration.verifiedBy = req.user._id;
    await registration.save();

    res.status(200).json({
      success: true,
      valid: true,
      message: 'Attendance verified successfully!',
      data: registration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Verification failed: ' + error.message,
    });
  }
};

// @desc    Get attendance roster for a specific event
// @route   GET /api/registrations/event/:eventId/roster
// @access  Private (Board & Admin only)
export const getEventRoster = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await Registration.find({ event: eventId })
      .populate('user', 'name email rollNumber department year')
      .populate('verifiedBy', 'name email')
      .sort({ attended: -1, createdAt: 1 });

    const totalRegistered = registrations.length;
    const totalAttended = registrations.filter((r) => r.attended).length;

    res.status(200).json({
      success: true,
      summary: {
        totalRegistered,
        totalAttended,
        turnoutPercentage: totalRegistered > 0 ? ((totalAttended / totalRegistered) * 100).toFixed(1) + '%' : '0%',
      },
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance roster: ' + error.message,
    });
  }
};

// @desc    Export attendance sheet as downloadable CSV file
// @route   GET /api/registrations/event/:eventId/export-csv
// @access  Private (Board & Admin only)
export const exportAttendanceCSV = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate('user', 'name email rollNumber department year')
      .sort({ 'user.rollNumber': 1 });

    if (!registrations || registrations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No registrations found for this event to export.',
      });
    }

    // Map clean table rows
    const rows = registrations.map((reg, index) => ({
      'S.No': index + 1,
      'Roll Number': reg.user?.rollNumber || 'N/A',
      'Student Name': reg.user?.name || 'N/A',
      'Department': reg.user?.department || 'N/A',
      'Year of Study': reg.user?.year || 'N/A',
      'Email': reg.user?.email || 'N/A',
      'Ticket Code': reg.ticketCode,
      'Attendance Status': reg.attended ? 'PRESENT' : 'ABSENT',
      'Check-in Timestamp': reg.attendedAt
        ? new Date(reg.attendedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : 'N/A',
    }));

    const fields = [
      'S.No',
      'Roll Number',
      'Student Name',
      'Department',
      'Year of Study',
      'Email',
      'Ticket Code',
      'Attendance Status',
      'Check-in Timestamp',
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(rows);

    const safeTitle = event.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeTitle}_Attendance_${Date.now()}.csv`;

    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    return res.send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to export CSV: ' + error.message,
    });
  }
};