import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Question from "../models/Question";
import QuestionBank from "../models/QuestionBank";
import { extractDocumentText, extractMcqsFromText } from "../services/documentQuestionExtractor";

export const importQuestionBankFromDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const file = req.file;
    if (!file) throw createHttpError(400, "Please upload a PDF, DOCX, or TXT document.");

    const text = await extractDocumentText(file.buffer, file.mimetype, file.originalname);
    const questions = await extractMcqsFromText(text);

    if (!questions.length) {
      res.status(200).json({
        status: "no_mcqs",
        message: "No multiple-choice questions were found in this document.",
      });
      return;
    }

    const savedQuestions = await Question.insertMany(questions);
    const title = file.originalname.replace(/\.[^/.]+$/, "").trim() || "Imported question bank";
    const bank = await QuestionBank.create({
      title,
      createdBy: req.user?._id,
      questions: savedQuestions.map((question) => question._id),
    });

    const populated = await bank.populate([
      { path: "createdBy", select: "username" },
      { path: "questions" },
    ]);
    res.status(201).json({ status: "success", questionBank: populated });
  } catch (error) {
    if (error instanceof Error && !Object.prototype.hasOwnProperty.call(error, "status")) {
      console.error("Document import failed:", error);
      next(createHttpError(502, error.message || "Document processing failed."));
      return;
    }
    next(error);
  }
};
