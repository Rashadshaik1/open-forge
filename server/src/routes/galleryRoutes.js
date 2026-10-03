import express from 'express';
import {
  getGalleryItems,
  uploadGalleryImage,
  deleteGalleryImage,
} from '../controllers/galleryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getGalleryItems)
  .post(protect, authorize('board', 'admin'), upload.single('image'), uploadGalleryImage);

router.route('/:id').delete(protect, authorize('admin'), deleteGalleryImage);

export default router;