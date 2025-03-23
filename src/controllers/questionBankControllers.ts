import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import QuestionBank from "../models/QuestionBank";
import Question from "../models/Question";

// Create a new Question Bank
export const createQuestionBank = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title } = req.body;
    const createdBy = req.user?._id; // Assuming `req.user` is set via authentication middleware

    const newQuestionBank = new QuestionBank({
      title,
      createdBy,
    });
    await newQuestionBank.save();

    res.status(201).json({ message: "QuestionBank created successfully!" });
  } catch (error) {
    next(error);
  }
};

// get all question-banks
export const getAllQuestionBanks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = req.user?.role;
    if (role === "student") {
      throw createHttpError(403, "User have no rights !");
    }
    const questionBanks = await QuestionBank.find()
      .populate("createdBy", "username") // Fetch only the username of the creator
      .populate("questions")
      .exec(); // Fetch all question banks
    res.status(200).json(questionBanks);
  } catch (error) {
    next(error);
  }
};

export const getQuestionBankById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = req.user?.role;
    const { id } = req.params;
    if (role === "student") {
      throw createHttpError(403, "User have no rights !");
    }
    const questionBank = await QuestionBank.findById(id)
      .populate("createdBy", "username") // Fetch only the username of the creator
      .populate("questions")
      .exec(); // Fetch all question banks
    res.status(200).json(questionBank);
  } catch (error) {
    next(error);
  }
};

// Edit Question Bank title
export const renameQuestionBank = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const updatedQuestionBank = await QuestionBank.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    if (!updatedQuestionBank) {
      throw createHttpError(404, "Question Bank not found");
    }

    res.status(200).json({
      message: "QuestionBank renamed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete Question Bank
export const deleteQuestionBank = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deletedQuestionBank = await QuestionBank.findByIdAndDelete(id);

    if (!deletedQuestionBank) {
      throw createHttpError(404, "Question Bank not found");
    }

    res.json({ message: "Question Bank deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    const questionBank = await QuestionBank.findById(id).exec();

    if (!questionBank) {
      throw createHttpError(404, "Question Bank not found");
    }

    const questions = questionBank.questions;

    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};

// Add Question to Question Bank
export const addQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { text, options, correctOption, category } = req.body;

    // Create a new question using the Question model
    const newQuestion = new Question({
      text,
      options,
      correctOption,
      category,
    });

    // Save the question to the database
    await newQuestion.save();

    // Add the question's ID to the QuestionBank's questions array
    const updatedBank = await QuestionBank.findByIdAndUpdate(
      id,
      { $push: { questions: newQuestion._id } }, // Store the reference
      { new: true }
    );

    if (!updatedBank) throw createHttpError(404, "Question Bank not found!");

    res.json({ message: "Question Added!", question: newQuestion });
  } catch (error) {
    next(error);
  }
};

// Remove Question from Question Bank
export const removeQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, questionId } = req.params;

    // Remove the question reference from the QuestionBank
    const updatedBank = await QuestionBank.findByIdAndUpdate(
      id,
      { $pull: { questions: questionId } }, // Remove the question reference
      { new: true }
    );

    if (!updatedBank) {
      throw createHttpError(404, "Question Bank not found!");
    }

    // Optionally, delete the question from the Question collection
    await Question.findByIdAndDelete(questionId);

    res.json({ message: "Question Removed!", updatedBank });
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { questionId } = req.params;
    const updates = req.body; // Updated data

    // Update the question in the Question collection
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      updates,
      { new: true }
    );

    if (!updatedQuestion) {
      throw createHttpError(404, "Question not found!");
    }

    res.json({ message: "Question Updated!", updatedQuestion });
  } catch (error) {
    next(error);
  }
};
