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
  toggleQuiz,
} from "../controllers/quizControllers";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router.get("/all", isAdmin, getAllQuizzesAdm); //

router.get("/", getAllQuizzes); // Get all quizzes

router.get("/:id", getQuizById); // Get a quiz by ID

router.post("/", createQuiz); // Create a new quiz

router.put("/:id", updateQuiz); // Update a quiz

router.patch("/:id/toggle", toggleQuiz); //toggle quiz

router.delete("/:id", deleteQuiz); // Delete a quiz

router.patch("/:quizId/addQuestions", addQuestions); // Add Selected Questions to a Quiz

router.patch("/:quizId/removeQuestions", removeQuestions); // Remove Selected Questions from a Quiz

export default router;
