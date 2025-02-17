import { NextFunction, Request, Response } from "express";
import Quiz from "../models/Quiz";
import createHttpError from "http-errors";

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
    const quizzes = await Quiz.find();
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
    res.status(200).json({ message: "Quizzes fetched successfully", quizzes });
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
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      throw createHttpError(404, "Quiz not found");
    }
    res.status(200).json({ message: "Quiz fetched successfully", quiz });
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
    res.status(200).json({ message: "Quiz updated successfully", quiz });
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
