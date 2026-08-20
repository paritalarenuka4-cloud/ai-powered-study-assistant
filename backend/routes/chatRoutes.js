import express from 'express';
import {
  sendMessage,
  getChatHistory,
  clearChatHistory,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', (req, res, next) => {
  // Optional auth for public guest demo or logged-in student
  if (req.headers.authorization) {
    return protect(req, res, next);
  }
  next();
}, sendMessage);

router.get('/history', protect, getChatHistory);
router.delete('/history', protect, clearChatHistory);

export default router;
