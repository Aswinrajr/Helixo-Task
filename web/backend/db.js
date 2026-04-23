import mongoose from 'mongoose';

/**
 * Robust MongoDB connection utility with retry logic and event logging.
 * Professional standards for production-ready MERN apps.
 */
const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/helixo-countdown';

  try {
    const connectionInstance = await mongoose.connect(mongoUri, {
      autoIndex: true, // Build indexes for performance
    });

    console.log(`✅ MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // In a professional setup, we might want to alert a monitoring service here
    process.exit(1);
  }
};

// Monitor connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error(`🔴 MongoDB Runtime Error: ${err}`);
});

export default connectDatabase;
