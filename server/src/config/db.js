import mongoose from 'mongoose';
import User from '../models/User.js';
import { seedDatabase } from '../seed.js';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/oems_db';

  try {
    console.log(`📡 Connecting to MongoDB at ${uri} (timeout: 2.5s)...`);
    mongoose.set('strictQuery', false);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });

    console.log(`✅ MongoDB Connected Successfully: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`⚠️ Local MongoDB connection failed (${err.message}).`);
    console.log(`🚀 Spawning high-speed in-memory MongoDB server (mongodb-memory-server)...`);

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      console.log(`📦 In-Memory MongoDB running at: ${memUri}`);

      await mongoose.connect(memUri);
      console.log('✅ Connected to In-Memory MongoDB.');
    } catch (memErr) {
      console.error('❌ Failed to start MongoMemoryServer:', memErr);
      process.exit(1);
    }
  }

  // Check if database needs auto-seeding
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('ℹ️ No existing users found. Auto-seeding initial academic dataset...');
      await seedDatabase();
    } else {
      console.log(`ℹ️ Database already initialized with ${userCount} users.`);
    }
  } catch (seedErr) {
    console.error('⚠️ Auto-seed check failed:', seedErr);
  }
};
