import express from "express";
import {
  getAvailableQuizzes,
  attemptQuiz,
  getResults,
  getAllResults,
} from "../controllers/studentControllers";

const router = express.Router();

router.get("/resultAdm", getAllResults);

// Get quizzes available for the student's class
router.get("/quizzes", getAvailableQuizzes);

// Attempt a quiz
router.post("/quizzes/:id/attempt", attemptQuiz);

// Get all attempted quiz results for the student
router.get("/result", getResults);

export default router;
