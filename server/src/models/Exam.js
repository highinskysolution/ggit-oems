import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Exam title is required'],
      trim: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    duration_mins: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    total_marks: {
      type: Number,
      required: [true, 'Total marks are required'],
      min: 1,
    },
    passing_marks: {
      type: Number,
      required: [true, 'Passing marks are required'],
      min: 1,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
    instructions: {
      type: String,
      default: 'Read all questions carefully. Each question carries marks as indicated. Auto-submission will trigger when the countdown timer reaches zero.',
    },
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
