import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    subject_code: {
      type: String,
      required: [true, 'Subject code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    subject_name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
