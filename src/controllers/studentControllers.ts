import { NextFunction, Request, Response } from "express";
import Quiz from "../models/Quiz";
import Result from "../models/Result";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";

export const getAllResults = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await Result.find()
      .populate("quizId", "title")
      .populate("studentId", "username");

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

export const getAvailableQuizzes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quizzes = await Quiz.find({ enabled: true });

    res.status(200).json(quizzes);
  } catch (error) {
    next(error);
  }
};

export const attemptQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { quizId, answers } = req.body;

  try {
    // Fetch the quiz
    const quiz = await Quiz.findById(quizId)
      .populate("questions") // Populate the questions
      .exec();

    if (!quiz) {
      throw createHttpError(404, "Quiz not found");
    }

    if (!quiz.enabled) {
      throw createHttpError(400, "Quiz is not enabled");
    }

    // Calculate the score
    let score = 0;
    quiz.questions.forEach((question: any, index: number) => {
      if (question.correctOption === answers[index]) {
        score++;
      }
    });

    // Save the result
    const result = new Result({
      studentId: req.user?.id, // Assuming the user ID is available in req.user
      quizId,
      score,
      totalMarks: quiz.questions.length, // Total marks is the total number of questions
      attemptedOn: new Date(),
    });

    await result.save();

    res.status(201).json({ message: "Quiz attempted successfully", score });
    // res.status(200).json(quiz);
  } catch (error) {
    next(error);
  }
};

export const getResults = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await Result.find({ studentId: req.user?.id })
      .populate("quizId", "title")
      .populate("studentId", "username");

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

export const getQuizQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId)
      .populate("questions") // Populate the questions
      .exec();

    if (!quiz) {
      throw createHttpError(404, "Quiz not found");
    }

    if (!quiz.enabled) {
      throw createHttpError(400, "Quiz is not enabled");
    }

    res.status(200).json(quiz.questions);
  } catch (error) {
    next(error);
  }
};

export const deleteResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { resultId } = req.params;

  if (!isValidObjectId(resultId)) {
    throw createHttpError(400, "Invalid result ID");
  }

  try {
    const result = await Result.findByIdAndDelete(resultId);

    if (!result) {
      throw createHttpError(404, "Result not found");
    }

    res.status(200).json({ message: "Result deleted successfully" });
  } catch (error) {
    next(error);
  }
};
