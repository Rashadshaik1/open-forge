import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleEventRegistration,
  updateEventStatus,
  addGalleryMedia,
  removeGalleryMedia,
} from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getEvents)
  .post(protect, authorize('board', 'admin'), createEvent);

// Manual toggle routes (Board & Admin only)
router.patch('/:id/toggle-registration', protect, authorize('board', 'admin'), toggleEventRegistration);
router.patch('/:id/status', protect, authorize('board', 'admin'), updateEventStatus);

// Multi-media gallery routes (Board & Admin only)
router.post('/:id/gallery', protect, authorize('board', 'admin'), addGalleryMedia);
router.delete('/:id/gallery/:mediaId', protect, authorize('board', 'admin'), removeGalleryMedia);

router
  .route('/:id')
  .get(getEventById)
  .put(protect, authorize('board', 'admin'), updateEvent)
  .patch(protect, authorize('board', 'admin'), updateEvent)
  .delete(protect, authorize('admin'), deleteEvent);

export default router;