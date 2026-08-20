import express from 'express';
import {
  getProgressStats,
  getSubjectProgress,
  getRecentActivity,
} from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getProgressStats);
router.get('/subjects', protect, getSubjectProgress);
router.get('/activity', protect, getRecentActivity);

export default router;
