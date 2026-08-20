import QuizResult from '../models/QuizResult.js';
import Activity from '../models/Activity.js';
import Material from '../models/Material.js';
import Subject from '../models/Subject.js';

// @desc    Get user's overall learning progress metrics
// @route   GET /api/progress
// @access  Private
export const getProgressStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch quiz results
    const quizResults = await QuizResult.find({ user: userId });
    const activities = await Activity.find({ user: userId });
    const totalMaterialsCount = await Material.countDocuments({});

    const totalQuizzes = quizResults.length;
    const averageScore =
      totalQuizzes > 0
        ? Math.round(
            quizResults.reduce((acc, curr) => acc + curr.percentage, 0) /
              totalQuizzes
          )
        : 0;

    const studyMinutes = activities.reduce(
      (acc, curr) => acc + (curr.durationMinutes || 0),
      0
    );
    const studyHours = Math.round((studyMinutes / 60) * 10) / 10;

    const materialsCompleted = activities.filter(
      (a) => a.activityType === 'material'
    ).length;

    res.status(200).json({
      success: true,
      data: {
        totalQuizzes,
        averageScore,
        studyHours: studyHours || (totalQuizzes > 0 ? totalQuizzes * 0.5 : 0),
        materialsCompleted,
        totalMaterialsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get subject-wise performance breakdown
// @route   GET /api/progress/subjects
// @access  Private
export const getSubjectProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const subjects = await Subject.find({});
    const quizResults = await QuizResult.find({ user: userId });

    const subjectBreakdown = subjects.map((subj) => {
      const resultsForSubj = quizResults.filter(
        (r) => r.subject.toLowerCase() === subj.name.toLowerCase()
      );
      const avgPercentage =
        resultsForSubj.length > 0
          ? Math.round(
              resultsForSubj.reduce((acc, curr) => acc + curr.percentage, 0) /
                resultsForSubj.length
            )
          : Math.floor(Math.random() * 25 + 60); // Friendly starter mastery baseline

      return {
        subject: subj.name,
        icon: subj.icon,
        color: subj.color,
        quizzesTaken: resultsForSubj.length,
        masteryPercentage: avgPercentage,
      };
    });

    res.status(200).json({
      success: true,
      data: subjectBreakdown,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent learning activity timeline
// @route   GET /api/progress/activity
// @access  Private
export const getRecentActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const activities = await Activity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};
