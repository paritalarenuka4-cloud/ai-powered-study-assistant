import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    quizTitle: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    answersReview: [
      {
        question: String,
        selectedAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
        explanation: String,
      },
    ],
  },
  { timestamps: true }
);

const QuizResult = mongoose.model('QuizResult', quizResultSchema);
export default QuizResult;
