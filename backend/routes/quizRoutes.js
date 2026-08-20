import express from 'express';
import {
  getQuizzes,
  getQuizById,
  submitQuiz,
  getQuizResults,
  generateAiQuiz,
} from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getQuizzes);
router.get('/results', protect, getQuizResults);
router.get('/:id', getQuizById);
router.post('/:id/submit', protect, submitQuiz);
router.post('/generate', protect, generateAiQuiz);

export default router;
