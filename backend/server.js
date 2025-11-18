import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import database connections
import { connectMongoDB } from './config/mongodb.js';
import { connectPostgres } from './config/postgres.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import healthTipRoutes from './routes/healthTipRoutes.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Healthcare Wellness Portal API is running',
    databases: {
      postgres: 'Connected',
      mongodb: 'Connected'
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/health-tips', healthTipRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Database connections
const connectDatabases = async () => {
  try {
    // Connect to both databases
    await Promise.all([
      connectPostgres(),
      connectMongoDB()
    ]);
    console.log('✅ All databases connected successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDatabases().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🐘 PostgreSQL: User, Audit, Assignments`);
    console.log(`🍃 MongoDB: Goals, Logs, Reminders, Health Tips`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

export default app;
