import mongoose from 'mongoose';


const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  try {
    const connectionInstance = await mongoose.connect(mongoUri, {
      autoIndex: true,
    });

    console.log(`✅ MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};


mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error(`🔴 MongoDB Runtime Error: ${err}`);
});

export default connectDatabase;
