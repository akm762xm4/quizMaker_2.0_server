import { NextFunction, Request, Response } from 'express';
import Quiz from '../models/Quiz';
import Result from '../models/Result';
import createHttpError from 'http-errors';

export const getAvailableQuizzes = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const studentClass = req.user?.class; // Assuming `class` is part of the `req.user` payload.

    const quizzes = await Quiz.find({
      class: studentClass,
      enabled: true,
    });

    res.status(200).json({ message: 'Available quizzes fetched successfully', quizzes });
  } catch (error) {
    next(error)
  }
};



export const attemptQuiz = async (req: Request, res: Response,next:NextFunction) => {
  const { quizId, answers } = req.body;

  try {
    // Fetch the quiz
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      throw createHttpError(404,'Quiz not found');
    }

    if (!quiz.enabled) {
     throw createHttpError(400,'Quiz is not enabled' );
    }

    // Calculate the score
    let score = 0;
    quiz.questions.forEach((question:any, index) => {
      if (question.correctOption === answers[index]) {
        score++;
      }
    });

    // Save the result
    const result = new Result({
      studentId: req.user?.id,
      quizId,
      score,
      totalQuestions: quiz.questions.length,
    });

    await result.save();

    res.status(201).json({ message: 'Quiz attempted successfully', result });
  } catch (error) {
    next(error)
  }
};

export const getResults = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const results = await Result.find({ studentId: req.user?.id }).populate('quizId', 'title subject class');

    res.status(200).json({ message: 'Results fetched successfully', results });
  } catch (error) {
    next(error)
  }
};

