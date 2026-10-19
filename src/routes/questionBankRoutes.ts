import express from "express";
import {
  createQuestionBank,
  deleteQuestionBank,
  renameQuestionBank,
  addQuestion,
  removeQuestion,
  getAllQuestionBanks,
  updateQuestion,
  // getQuestions,
  getQuestionBankById,
} from "../controllers/questionBankControllers";
import { requireRole } from "../middlewares/requireRole";
import multer from "multer";
import { importQuestionBankFromDocument } from "../controllers/documentImportControllers";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.use(requireRole("admin", "faculty"));

router.post("/", createQuestionBank);

router.post("/import-document", upload.single("file"), importQuestionBankFromDocument);

router.get("/", getAllQuestionBanks);

router.get("/:id", getQuestionBankById);

router.put("/:id", renameQuestionBank);

router.delete("/:id", deleteQuestionBank);

// router.get("/getQuestions/:id", getQuestions);

router.post("/addQuestion/:id", addQuestion);

router.delete("/removeQuestion/:id/:questionId", removeQuestion);

router.put("/updateQuestion/:questionId", updateQuestion);

export default router;
