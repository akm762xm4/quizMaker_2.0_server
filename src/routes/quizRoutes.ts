import express from 'express';
import {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from '../controllers/quizControllers';

const router = express.Router();

// Get all quizzes
router.get('/', getAllQuizzes);

// Get a quiz by ID
router.get('/:id', getQuizById);

// Create a new quiz
router.post('/', createQuiz);

// Update a quiz
router.put('/:id', updateQuiz);

// Delete a quiz
router.delete('/:id', deleteQuiz);

export default router;
