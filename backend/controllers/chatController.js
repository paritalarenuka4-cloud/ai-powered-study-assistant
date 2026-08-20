import Chat from '../models/Chat.js';
import Activity from '../models/Activity.js';
import { generateStudyChatResponse } from '../services/aiService.js';

// @desc    Send message to AI assistant and receive answer
// @route   POST /api/chat
// @access  Public / Private
export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty',
      });
    }

    let chat = null;
    let history = [];

    if (req.user) {
      chat = await Chat.findOne({ user: req.user._id });
      if (!chat) {
        chat = await Chat.create({
          user: req.user._id,
          title: 'Study Assistant Session',
          messages: [],
        });
      }
      history = chat.messages.map((m) => ({ role: m.role, text: m.text }));
    }

    // Generate AI response
    const aiResponseText = await generateStudyChatResponse(message, history);

    // Save to user chat history if authenticated
    if (chat && req.user) {
      chat.messages.push({ role: 'user', text: message });
      chat.messages.push({ role: 'assistant', text: aiResponseText });
      await chat.save();

      // Log study activity periodically
      if (chat.messages.length % 4 === 0) {
        await Activity.create({
          user: req.user._id,
          activityType: 'chat',
          title: 'AI Tutor Consultation Session',
          durationMinutes: 10,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        role: 'assistant',
        text: aiResponseText,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's chat history
// @route   GET /api/chat/history
// @access  Private
export const getChatHistory = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: chat ? chat.messages : [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear chat history
// @route   DELETE /api/chat/history
// @access  Private
export const clearChatHistory = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ user: req.user._id });

    if (chat) {
      chat.messages = [];
      await chat.save();
    }

    res.status(200).json({
      success: true,
      message: 'Chat history cleared',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};
