import express from "express";
import {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getAllQuizzesAdm,
  addQuestions,
  removeQuestions,
} from "../controllers/quizControllers";

const router = express.Router();

router.get("/all", getAllQuizzesAdm);

// Get all quizzes
router.get("/", getAllQuizzes);

// Get a quiz by ID
router.get("/:id", getQuizById);

// Create a new quiz
router.post("/", createQuiz);

// Update a quiz
router.put("/:id", updateQuiz);

// Delete a quiz
router.delete("/:id", deleteQuiz);

// Add Selected Questions to a Quiz
router.post("/:quizId/addQuestions", addQuestions);

// Remove Selected Questions from a Quiz
router.delete("/:quizId/removeQuestions", removeQuestions);

export default router;
