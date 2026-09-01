import mongoose from 'mongoose';
import User from '../models/User.js';
import { seedDatabase } from '../seed.js';

let isConnecting = false;

// Official Student Directory Dataset
export const OFFICIAL_STUDENTS = [
  { name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', roll_no: 'BCA202601', department: 'BCA', year: 'SY' },
  { name: 'Riya Patel', email: 'riya.patel@gmail.com', roll_no: 'BCA202602', department: 'BCA', year: 'SY' },
  { name: 'Aditya Mehta', email: 'aditya.mehta@gmail.com', roll_no: 'BCA202603', department: 'BCA', year: 'TY' },
  { name: 'Sneha Joshi', email: 'sneha.joshi@gmail.com', roll_no: 'BCA202604', department: 'BCA', year: 'FY' },
  { name: 'Rohan Verma', email: 'rohan.verma@gmail.com', roll_no: 'IT202601', department: 'BSc IT', year: 'SY' },
  { name: 'Ananya Singh', email: 'ananya.singh@gmail.com', roll_no: 'IT202602', department: 'BSc IT', year: 'TY' },
  { name: 'Kunal Shah', email: 'kunal.shah@gmail.com', roll_no: 'AI202601', department: 'AI', year: 'FY' },
  { name: 'Priya Desai', email: 'priya.desai@gmail.com', roll_no: 'AI202602', department: 'AI', year: 'SY' },
  { name: 'Yash Gupta', email: 'yash.gupta@gmail.com', roll_no: 'BCA202605', department: 'BCA', year: 'FY' },
  { name: 'Neha Kulkarni', email: 'neha.kulkarni@gmail.com', roll_no: 'BCA202606', department: 'BCA', year: 'TY' },
];

// Ensure vital administrative, faculty, and student candidate accounts always exist
export const ensureEssentialAccounts = async () => {
  try {
    // 1. Ensure Faculty Dr. Lt. Mrunali Sawant
    const facultyConfigs = [
      { name: 'Dr. Lt. MRUNALI SAWANT', email: 'sawantmrunali@gmail.com', password: '123456', role: 'teacher', department: 'BCA' },
      { name: 'Dr. Lt. MRUNALI SAWANT', email: 'mrunalisawant@gmail.com', password: '123456', role: 'teacher', department: 'BCA' },
      { name: 'Dr. Lt. MRUNALI SAWANT', email: 'sawantmurnali@gmail.com', password: '123456', role: 'teacher', department: 'BCA' },
    ];

    for (const f of facultyConfigs) {
      const existing = await User.findOne({ email: f.email });
      if (!existing) {
        await User.create({
          name: f.name,
          email: f.email,
          password: f.password,
          role: f.role,
          department: f.department,
          year: 'N/A',
        });
        console.log(`✅ Ensured faculty account: ${f.email}`);
      }
    }

    // 2. Ensure Administrators
    const adminConfigs = [
      { name: 'Gagan Moolya (Admin)', email: 'admin@oems.com', password: 'admin123' },
      { name: 'Shreyas Jha (Admin)', email: 'shreyas.admin@oems.com', password: 'admin123' },
      { name: 'Akash Gupta (Admin)', email: 'akash.admin@oems.com', password: 'admin123' },
    ];

    for (const a of adminConfigs) {
      const existing = await User.findOne({ email: a.email });
      if (!existing) {
        await User.create({
          name: a.name,
          email: a.email,
          password: a.password,
          role: 'admin',
          department: 'Examination Control Division',
        });
        console.log(`✅ Ensured admin account: ${a.email}`);
      }
    }

    // 3. Ensure the 10 Official Student Candidates (Password: 123456)
    for (const s of OFFICIAL_STUDENTS) {
      const existing = await User.findOne({
        $or: [{ email: s.email }, { roll_no: s.roll_no }],
      });
      if (!existing) {
        await User.create({
          name: s.name,
          email: s.email,
          password: '123456',
          role: 'student',
          roll_no: s.roll_no,
          department: s.department,
          year: s.year,
        });
        console.log(`✅ Ensured student candidate: ${s.name} (${s.email})`);
      }
    }
  } catch (err) {
    console.warn('⚠️ Account verification notice:', err.message);
  }
};

export const connectDB = async () => {
  // If already connected, reuse connection (critical for Vercel Serverless)
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (isConnecting) {
    while (isConnecting) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/oems_db';
  isConnecting = true;

  try {
    console.log(`📡 Connecting to MongoDB (${process.env.VERCEL ? 'Vercel Cloud' : 'Local'})...`);
    mongoose.set('strictQuery', false);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds for cloud cold starts
      connectTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected Successfully: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`⚠️ Primary MongoDB connection failed (${err.message}).`);

    // In local non-Vercel environment, fall back to in-memory MongoDB
    if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
      try {
        console.log(`🚀 Spawning high-speed in-memory MongoDB server...`);
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongoMemoryServer = await MongoMemoryServer.create();
        const memUri = mongoMemoryServer.getUri();
        await mongoose.connect(memUri);
        console.log('✅ Connected to In-Memory MongoDB.');
      } catch (memErr) {
        console.error('❌ Failed to start MongoMemoryServer:', memErr);
        throw err;
      }
    } else {
      throw err;
    }
  } finally {
    isConnecting = false;
  }

  // Check if database needs auto-seeding or account verification
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('ℹ️ No existing users found. Auto-seeding initial academic dataset...');
      await seedDatabase();
    } else {
      await ensureEssentialAccounts();
    }
  } catch (seedErr) {
    console.error('⚠️ Auto-seed check failed:', seedErr.message);
  }
};
