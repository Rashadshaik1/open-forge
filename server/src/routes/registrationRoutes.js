import express from 'express';
import {
  registerForEvent,
  getMyTickets,
  verifyTicket,
  getEventRoster,
  exportAttendanceCSV,
} from '../controllers/registrationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// General ticket routes
router.post('/verify-ticket', protect, authorize('volunteer', 'board', 'admin'), verifyTicket);
router.get('/my-tickets', protect, getMyTickets);

// Event-specific attendance management routes (Board & Admin only)
router.get('/event/:eventId/roster', protect, authorize('board', 'admin'), getEventRoster);
router.get('/event/:eventId/export-csv', protect, authorize('board', 'admin'), exportAttendanceCSV);

// Student registration
router.post('/:eventId', protect, registerForEvent);

export default router;