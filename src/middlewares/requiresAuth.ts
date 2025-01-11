import jwt from "jsonwebtoken";
import User from "../models/User";
import env from "../utils/validateEnv";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export const requiresAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw createHttpError(401, "Token Required!");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };

    if (!decoded) {
      throw createHttpError(400, "Invalid token!");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw createHttpError(404, "User not found!");
    }else{
      req.user = user as {
        _id: string;
        id: string;
        class?: string;
        role?: string;
      };
    }
    //req.user = await User.findById(decoded.id).exec()

    next();
  } catch (error) {
    next(error);
  }
};
