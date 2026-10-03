import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { submitFeedback, getEventFeedback } from '../controllers/feedbackController.js';
import { getPosts, createPost, toggleUpvote, addComment } from '../controllers/postController.js';
import { downloadCertificate } from '../controllers/certificateController.js';
import { getTeam, getAllMembers, updateMemberRole } from '../controllers/teamController.js';

const router = express.Router();

// Feedback
router.post('/feedback/:eventId', protect, submitFeedback);
router.get('/feedback/:eventId', getEventFeedback);

// Community Forum (Reddit)
router.get('/posts', getPosts);
router.post('/posts', protect, createPost);
router.post('/posts/:id/upvote', protect, toggleUpvote);
router.post('/posts/:id/comment', protect, addComment);

// Certificates
router.get('/certificates/download', downloadCertificate);

// Team & Role Management
router.get('/team', getTeam); // Public team list
router.get('/team/all-members', protect, authorize('admin'), getAllMembers); // Admin full roster (including students)
router.patch('/team/role/:id', protect, authorize('admin'), updateMemberRole); // Admin role promotion

export default router;