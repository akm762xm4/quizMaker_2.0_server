import express from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import quizRoutes from './quizRoutes';
import studentRoutes from './studentRoutes';

const router = express.Router();

// Authentication routes
router.use('/auth', authRoutes);

// User management routes (Admin)
router.use('/users', userRoutes);

// Quiz management routes (Faculty)
router.use('/quizzes', quizRoutes);

// Student-specific routes
router.use('/students', studentRoutes);

export default router;
