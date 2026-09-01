import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    total_score: {
      type: Number,
      required: true,
      default: 0,
    },
    correct_count: {
      type: Number,
      required: true,
      default: 0,
    },
    wrong_count: {
      type: Number,
      required: true,
      default: 0,
    },
    unanswered_count: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Pass', 'Fail'],
      required: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: true,
        },
        selectedOption: {
          type: Number, // 0, 1, 2, 3 or -1 for unattempted
          default: -1,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
        marksAwarded: {
          type: Number,
          default: 0,
        },
      },
    ],
    time_taken_seconds: {
      type: Number,
      default: 0,
    },
    tab_switch_count: {
      type: Number,
      default: 0,
    },
    proctor_flags: [
      {
        timestamp: { type: Date, default: Date.now },
        reason: { type: String, default: 'Tab Switch / Window Blur' },
      },
    ],
    submitted_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a student can only have 1 result per exam (Single-Attempt restriction FR-OE-02)
resultSchema.index({ student: 1, exam: 1 }, { unique: true });

const Result = mongoose.model('Result', resultSchema);
export default Result;
