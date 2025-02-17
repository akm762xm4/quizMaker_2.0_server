import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Question from "../models/Question";

export const getQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { category } = req.query;

  try {
    if (category) {
      const questions = await Question.find({ category: category }).exec();
      if (!questions) {
        throw createHttpError(404, "No Questions found!");
      }
      res
        .status(200)
        .json({ message: "Questions fetched successfully", questions });
    }
    const questions = await Question.find().exec();
    res
      .status(200)
      .json({ message: "Questions fetched successfully", questions });
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { text, options, correctOption, category } = req.body;

  try {
    const question = new Question({
      text,
      options,
      correctOption,
      category,
    });

    await question.save();
    res
      .status(201)
      .json({ message: "Question created successfully", question });
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const question = await Question.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!question) {
      throw createHttpError(404, "question not found");
    }
    res
      .status(200)
      .json({ message: "question updated successfully", question });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      throw createHttpError(404, "Question not found");
    }
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    next(error);
  }
};
