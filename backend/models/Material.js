import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Notes', 'PDF', 'Video', 'Article', 'Practice Questions'],
      default: 'Notes',
    },
    url: {
      type: String,
      default: '',
    },
    keyTakeaways: [
      {
        type: String,
      },
    ],
    readingTimeMinutes: {
      type: Number,
      default: 5,
    },
    isAiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Material = mongoose.model('Material', materialSchema);
export default Material;
