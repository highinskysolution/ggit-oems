import app from '../server/src/server.js';
import { connectDB } from '../server/src/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('Serverless MongoDB Connection Error:', err);
    // If health check, return online with warning
    if (req.url?.includes('/health')) {
      return res.status(200).json({
        status: 'online',
        database: 'connecting',
        message: err.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Database connection error: ' + (err.message || 'Please check MongoDB Atlas Network Access (0.0.0.0/0)'),
    });
  }

  return app(req, res);
}
