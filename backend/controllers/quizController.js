import Quiz from '../models/Quiz.js';
import QuizResult from '../models/QuizResult.js';
import Activity from '../models/Activity.js';
import { generateAiQuizQuestions } from '../services/aiService.js';

// @desc    Get all available quizzes
// @route   GET /api/quizzes
// @access  Public / Private
export const getQuizzes = async (req, res, next) => {
  try {
    const { subject, difficulty } = req.query;
    const query = {};

    if (subject && subject !== 'All') {
      query.subject = { $regex: `^${subject}$`, $options: 'i' };
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    const quizzes = await Quiz.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz by ID
// @route   GET /api/quizzes/:id
// @access  Public / Private
export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz answers and calculate results
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    const { answers } = req.body; // Map of { questionIndex: selectedOptionKey } e.g. { "0": "B", "1": "C" }

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    let score = 0;
    const answersReview = quiz.questions.map((q, idx) => {
      const selected = answers ? answers[idx] : null;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score += 1;

      return {
        question: q.question,
        selectedAnswer: selected || 'Not answered',
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation || '',
      };
    });

    const totalQuestions = quiz.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    let resultRecord = null;
    if (req.user) {
      resultRecord = await QuizResult.create({
        user: req.user._id,
        quiz: quiz._id,
        quizTitle: quiz.title,
        subject: quiz.subject,
        score,
        totalQuestions,
        percentage,
        answersReview,
      });

      await Activity.create({
        user: req.user._id,
        activityType: 'quiz',
        title: `Completed Quiz: ${quiz.title} (${score}/${totalQuestions})`,
        durationMinutes: 10,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        score,
        totalQuestions,
        percentage,
        answersReview,
        resultId: resultRecord?._id,
        quizTitle: quiz.title,
        subject: quiz.subject,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's past quiz results
// @route   GET /api/quizzes/results
// @access  Private
export const getQuizResults = async (req, res, next) => {
  try {
    const results = await QuizResult.find({ user: req.user._id }).sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate a custom AI quiz
// @route   POST /api/quizzes/generate
// @access  Private
export const generateAiQuiz = async (req, res, next) => {
  try {
    const { subject, topic, difficulty, count } = req.body;

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a subject for quiz generation',
      });
    }

    const questions = await generateAiQuizQuestions({ subject, topic, difficulty, count });

    const newQuiz = await Quiz.create({
      subject,
      title: `${topic ? `${topic} - ` : ''}AI Custom Quiz (${difficulty || 'Medium'})`,
      description: `AI-generated practice test on ${topic || subject}.`,
      difficulty: difficulty || 'Medium',
      questions,
      isAiGenerated: true,
    });

    if (req.user) {
      await Activity.create({
        user: req.user._id,
        activityType: 'ai_generate',
        title: `Generated AI Quiz on ${subject}`,
        durationMinutes: 5,
      });
    }

    res.status(201).json({
      success: true,
      message: 'AI Quiz generated successfully!',
      data: newQuiz,
    });
  } catch (error) {
    next(error);
  }
};
