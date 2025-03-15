import express from "express";
import {
  createQuestionBank,
  deleteQuestionBank,
  renameQuestionBank,
  addQuestion,
  removeQuestion,
  getAllQuestionBanks,
  updateQuestion,
  getQuestions,
  getQuestionBankById,
} from "../controllers/questionBankControllers";

const router = express.Router();

router.post("/", createQuestionBank);

router.get("/", getAllQuestionBanks);

router.get("/:id", getQuestionBankById);

router.put("/:id", renameQuestionBank);

router.delete("/:id", deleteQuestionBank);

router.get("/getQuestions/:id", getQuestions);

router.post("/addQuestion/:id", addQuestion);

router.delete("/removeQuestion/:id/:questionId", removeQuestion);

router.put("/updateQuestion/:id/:questionId", updateQuestion);

export default router;
