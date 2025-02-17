import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getQuestions,
  updateQuestion,
} from "../controllers/questionControllers";

const router = express.Router();

//get all questions or get by topic
router.get("/", getQuestions);

//create a question
router.post("/", createQuestion);

//update a question
router.put("/:questionId", updateQuestion);

//delete a question
router.delete("/:questionId", deleteQuestion);

export default router;
