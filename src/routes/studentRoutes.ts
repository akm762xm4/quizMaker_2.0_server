import express from 'express';
import { getAvailableQuizzes, attemptQuiz, getResults } from '../controllers/studentControllers';

const router = express.Router();

// Get quizzes available for the student's class
router.get('/quizzes', getAvailableQuizzes);

// Attempt a quiz
router.post('/quizzes/:id/attempt', attemptQuiz);

// Get all attempted quiz results for the student
router.get('/results', getResults);

export default router;
