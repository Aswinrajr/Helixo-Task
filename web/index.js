import express from 'express';
import dotenv from 'dotenv';
import connectDatabase from './backend/db.js';
import timerRoutes from './backend/routes/timerRoutes.js';
import { asyncHandler } from './backend/middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8085;

// Middleware
app.use(express.json());

// Database Initialization
connectDatabase();

// API Routes
app.use('/api', timerRoutes);

// Pro Tip: Global Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: err.status || 'error',
    message: err.message,
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Helixo Server running on port ${PORT}`);
});

export default app;
