import mongoose from 'mongoose';
import User from '../models/User.js';
import { seedDatabase } from '../seed.js';

let isConnecting = false;

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

  // Check if database needs auto-seeding
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('ℹ️ No existing users found. Auto-seeding initial academic dataset...');
      await seedDatabase();
    }
  } catch (seedErr) {
    console.error('⚠️ Auto-seed check failed:', seedErr.message);
  }
};
