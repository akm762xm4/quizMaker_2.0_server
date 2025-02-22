import { NextFunction, Request, Response } from "express";
import Quiz from "../models/Quiz";
import createHttpError from "http-errors";
import Question from "../models/Question";

export const createQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, maxTime } = req.body;

  try {
    const quiz = new Quiz({
      title,
      maxTime,
      enabled: false,
      createdBy: req.user?._id, // Assuming `req.user.id` stores faculty ID
    });

    await quiz.save();

    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    next(error);
  }
};

export const getAllQuizzesAdm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req?.user) {
      throw createHttpError(404, "Quizzes not found");
    }
    const quizzes = await Quiz.find().populate("createdBy", "username").exec();
    res.status(200).json(quizzes);
  } catch (error) {
    next(error);
  }
};

export const getAllQuizzes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req?.user) {
      throw createHttpError(404, "Quiz not found");
    }
    const quizzes = await Quiz.find({ createdBy: req.user?._id }); // Fetch quizzes by the logged-in faculty
    res.status(200).json(quizzes);
  } catch (error) {
    next(error);
  }
};

export const getQuizById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.findById(id)
      .populate("createdBy", "username")
      .exec();
    if (!quiz) {
      throw createHttpError(404, "Quiz not found");
    }
    res.status(200).json(quiz);
  } catch (error) {
    next(error);
  }
};

export const updateQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const quiz = await Quiz.findByIdAndUpdate(id, updates, { new: true });
    if (!quiz) {
      throw createHttpError(404, "Quiz not found");
    }
    res.status(200).json({ message: "Quiz updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.findByIdAndDelete(id);
    if (!quiz) {
      throw createHttpError(404, "Quiz not found");
    }
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Add Specific Questions to a Quiz
export const addQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { quizId } = req.params;
    const { questionIds } = req.body; // Expecting an array of question IDs

    if (!questionIds || !Array.isArray(questionIds)) {
      throw createHttpError(400, "Invalid question IDs format");
    }

    // Verify that all question IDs exist
    const existingQuestions = await Question.find({
      _id: { $in: questionIds },
    });
    if (existingQuestions.length !== questionIds.length) {
      throw createHttpError(404, "One or more questions not found");
    }

    // Update the quiz by adding questions (avoids duplicates)
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $addToSet: { questions: { $each: questionIds } } }, // Add without duplicates
      { new: true }
    );

    if (!updatedQuiz) throw createHttpError(404, "Quiz not found!");

    res.json({ message: "Questions added to quiz!" });
  } catch (error) {
    next(error);
  }
};

// Remove Specific Questions from a Quiz
export const removeQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { quizId } = req.params;
    const { questionIds } = req.body; // Expecting an array of question IDs

    if (!questionIds || !Array.isArray(questionIds)) {
      throw createHttpError(400, "Invalid question IDs format");
    }

    // Update the quiz by removing questions
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $pull: { questions: { $in: questionIds } } }, // Remove specified questions
      { new: true }
    );

    if (!updatedQuiz) throw createHttpError(404, "Quiz not found!");

    res.json({ message: "Questions removed from quiz!" });
  } catch (error) {
    next(error);
  }
};
