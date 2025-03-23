import express from "express";
import {
  getAvailableQuizzes,
  attemptQuiz,
  getResults,
  getAllResults,
  getQuizQuestions,
} from "../controllers/studentControllers";

const router = express.Router();

router.get("/resultAdm", getAllResults);

// Get quizzes available for the student's class
router.get("/quizzes", getAvailableQuizzes);

// Attempt a quiz
router.post("/quizzes/attempt", attemptQuiz);

// Get all attempted quiz results for the student
router.get("/result", getResults);

router.get("/:quizId/questions", getQuizQuestions);

export default router;
