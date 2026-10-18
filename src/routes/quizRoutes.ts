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
import { requireRole } from "../middlewares/requireRole";

const router = express.Router();

router.get("/all", isAdmin, getAllQuizzesAdm);

router.get("/", requireRole("faculty"), getAllQuizzes);

router.get("/:id", requireRole("faculty"), getQuizById);

router.post("/", requireRole("faculty"), createQuiz);

router.put("/:id", requireRole("faculty"), updateQuiz);

router.patch("/:id/toggle", requireRole("faculty"), toggleQuiz);

router.delete("/:id", requireRole("faculty"), deleteQuiz);

router.patch("/:quizId/addQuestions", requireRole("faculty"), addQuestions);

router.patch("/:quizId/removeQuestions", requireRole("faculty"), removeQuestions);

export default router;
