import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    question_text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length === 4 && v.every((opt) => opt && opt.trim().length > 0);
        },
        message: 'A question must have exactly 4 non-empty options',
      },
      required: true,
    },
    correct_option: {
      type: Number,
      required: [true, 'Correct option index (0-3) is required'],
      min: 0,
      max: 3,
    },
    marks: {
      type: Number,
      default: 1,
      min: [1, 'Marks must be at least 1'],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    explanation: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model('Question', questionSchema);
export default Question;
