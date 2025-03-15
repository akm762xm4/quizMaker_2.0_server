import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

// Middleware to check if the user is an admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Assuming the user's role is attached to the request object after authentication
  if (req.user?.role !== "admin") {
    return next(createHttpError(403, "Access denied. You are not an admin."));
  }
  next();
};
