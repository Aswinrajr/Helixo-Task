import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDatabase from './backend/db.js';
import timerRoutes from './backend/routes/timerRoutes.js';
import { asyncHandler } from './backend/middleware/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8085;

// Middleware
app.use(express.json());

// Database Initialization
connectDatabase();

// Health Check (For Render to see the app is alive)
app.get('/health', (req, res) => res.status(200).send('OK'));

// API Routes
app.use('/api', timerRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

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
