import mongoose from 'mongoose';
import User from '../models/User.js';
import { seedDatabase } from '../seed.js';

let isConnecting = false;

// Ensure vital administrative and faculty accounts always exist
export const ensureEssentialAccounts = async () => {
  try {
    // 1. Ensure Faculty Dr. Lt. Mrunali Sawant
    const facultyConfigs = [
      { name: 'Dr. Lt. MRUNALI SAWANT', email: 'sawantmrunali@gmail.com', password: '123456', role: 'teacher', department: 'BCA' },
      { name: 'Dr. Lt. MRUNALI SAWANT', email: 'mrunalisawant@gmail.com', password: '123456', role: 'teacher', department: 'BCA' },
      { name: 'Dr. Lt. MRUNALI SAWANT', email: 'sawantmurnali@gmail.com', password: '123456', role: 'teacher', department: 'BCA' },
      { name: 'Dr. Lt. MRUNALI SAWANT', email: 'sawantmuranali@gmail.com', password: '123456', role: 'teacher', department: 'BCA' },
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
