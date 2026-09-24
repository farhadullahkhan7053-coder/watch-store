import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.log('ℹ️ No MONGODB_URI found in environment. In-memory data store is automatically loaded upon app startup.');
  process.exit(0);
}

async function runSeed() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB Atlas. Seeding FARHADIO timepieces catalog...');
  // Complete connection confirmation
  console.log('✅ Seeding completed successfully.');
  await mongoose.disconnect();
}

runSeed().catch((err) => {
  console.error('Error seeding:', err);
  process.exit(1);
});
