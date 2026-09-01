import app from '../server/src/server.js';
import { connectDB } from '../server/src/config/db.js';

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('Serverless MongoDB Connection Error:', err);
    }
  }
  return app(req, res);
}
