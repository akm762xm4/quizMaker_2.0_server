import express from "express";
import {
  getAvailableQuizzes,
  attemptQuiz,
  getResults,
  getAllResults,
  getQuizQuestions,
  deleteResult,
} from "../controllers/studentControllers";
import { requireRole } from "../middlewares/requireRole";

const router = express.Router();

router.get("/resultAdm", requireRole("admin", "faculty"), getAllResults);

// Get quizzes available for the student's class
router.get("/quizzes", requireRole("student"), getAvailableQuizzes);

// Attempt a quiz
router.post("/quizzes/attempt", requireRole("student"), attemptQuiz);

// Get all attempted quiz results for the student
router.get("/result", requireRole("student"), getResults);

router.get("/:quizId/questions", requireRole("student"), getQuizQuestions);

router.delete("/result/:resultId", requireRole("admin"), deleteResult);

export default router;
