import Material from '../models/Material.js';
import Subject from '../models/Subject.js';
import Activity from '../models/Activity.js';
import { generateAiStudyNotes } from '../services/aiService.js';

// @desc    Get all study materials with optional filtering and search
// @route   GET /api/materials
// @access  Public / Private
export const getMaterials = async (req, res, next) => {
  try {
    const { search, subject, type } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (subject && subject !== 'All') {
      query.subject = { $regex: `^${subject}$`, $options: 'i' };
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    const materials = await Material.find(query).sort({ createdAt: -1 });
    const subjects = await Subject.find({});

    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials,
      subjects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single material by ID
// @route   GET /api/materials/:id
// @access  Public / Private
export const getMaterialById = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }

    // Log study activity if user is authenticated
    if (req.user) {
      await Activity.create({
        user: req.user._id,
        activityType: 'material',
        title: `Studied: ${material.title}`,
        durationMinutes: material.readingTimeMinutes || 5,
      });
    }

    // Fetch related materials from same subject
    const related = await Material.find({
      subject: material.subject,
      _id: { $ne: material._id },
    }).limit(3);

    res.status(200).json({
      success: true,
      data: material,
      related,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new study material
// @route   POST /api/materials
// @access  Private
export const createMaterial = async (req, res, next) => {
  try {
    const { subject, title, description, content, type, url, keyTakeaways, readingTimeMinutes } = req.body;

    const material = await Material.create({
      subject,
      title,
      description,
      content,
      type: type || 'Notes',
      url: url || '',
      keyTakeaways: keyTakeaways || [],
      readingTimeMinutes: readingTimeMinutes || 5,
    });

    res.status(201).json({
      success: true,
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI Study Notes
// @route   POST /api/materials/generate
// @access  Private
export const generateMaterialAI = async (req, res, next) => {
  try {
    const { subject, topic, difficulty, length } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a topic to generate notes for',
      });
    }

    const aiNotes = await generateAiStudyNotes({ subject, topic, difficulty, length });

    const newMaterial = await Material.create({
      ...aiNotes,
      isAiGenerated: true,
    });

    if (req.user) {
      await Activity.create({
        user: req.user._id,
        activityType: 'ai_generate',
        title: `Generated AI Notes: ${topic}`,
        durationMinutes: 5,
      });
    }

    res.status(201).json({
      success: true,
      message: 'AI Study Notes successfully generated!',
      data: newMaterial,
    });
  } catch (error) {
    next(error);
  }
};
