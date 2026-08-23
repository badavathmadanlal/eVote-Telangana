import mongoose from 'mongoose';
import envConfig from './env.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(envConfig.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB Disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB Error: ${err.message}`);
});

export default connectDB;
